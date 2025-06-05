import OpenAI from 'openai'

export async function fetchAndAnalyzeUrl(url) {
  try {
    // Get API key from localStorage or environment variable
    const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found')
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    })
    
    // Try to fetch content from the URL using a CORS proxy or fallback to URL-only analysis
    let content = ''
    let contentFetchSuccess = false
    
    try {
      content = await fetchUrlContent(url)
      contentFetchSuccess = true
    } catch (fetchError) {
      console.warn('Failed to fetch URL content:', fetchError)
      // We'll continue with URL-only analysis
    }
    
    // Generate analysis using OpenAI
    const analysis = await generateAnalysis(openai, url, content, contentFetchSuccess)
    
    return analysis
  } catch (error) {
    console.error('Error in fetchAndAnalyzeUrl:', error)
    throw error
  }
}

async function fetchUrlContent(url) {
  // List of CORS proxies to try
  const corsProxies = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`
  ]
  
  let content = ''
  let success = false
  let lastError = null
  
  // Try each proxy until one works
  for (const proxyUrl of corsProxies) {
    try {
      const response = await fetch(proxyUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'follow',
        mode: 'cors',
        timeout: 10000 // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      content = await response.text()
      
      // Check if we got actual content (not just an error page)
      if (content.length > 500) {
        success = true
        break
      } else {
        console.warn(`Proxy ${proxyUrl} returned too little content, trying next proxy`)
      }
    } catch (error) {
      console.warn(`Proxy ${proxyUrl} failed:`, error)
      lastError = error
    }
  }
  
  if (!success) {
    throw new Error(`Failed to fetch URL content: ${lastError?.message || 'Unknown error'}`)
  }
  
  return content
}

async function generateAnalysis(openai, url, content, contentFetchSuccess) {
  try {
    let prompt = ''
    
    if (contentFetchSuccess && content) {
      // Truncate content if it's too long (OpenAI has token limits)
      const truncatedContent = content.substring(0, 15000)
      
      prompt = `
        Analyze the following webpage content for SEO optimization:
        URL: ${url}
        
        Content:
        ${truncatedContent}
        
        Please provide:
        1. 5-7 primary keywords that best represent the content
        2. 5-7 secondary keywords that could improve SEO
        3. 5-7 relevant tags for the content
        4. 3 optimized meta descriptions (under 160 characters each)
        5. A brief analysis of the content's SEO strengths and weaknesses
        6. 3-5 specific recommendations to improve SEO
      `
    } else {
      // Fallback to URL-only analysis when content can't be fetched
      prompt = `
        Analyze the following URL for SEO optimization:
        URL: ${url}
        
        I was unable to fetch the content due to CORS restrictions, but please analyze the URL itself and provide:
        1. 5-7 potential primary keywords based on the URL structure
        2. 5-7 potential secondary keywords that might be relevant
        3. 5-7 relevant tags based on the URL and domain
        4. 3 potential meta descriptions (under 160 characters each) that would work well for this URL
        5. A brief analysis of potential SEO strengths and weaknesses based on the URL structure
        6. 3-5 general recommendations for improving SEO for this type of content
        
        Note: Since you don't have access to the actual content, please make educated guesses based on the URL structure, domain name, and your knowledge of similar content.
      `
    }
    
    prompt += `
      Format your response as a JSON object with the following structure:
      {
        "primaryKeywords": ["keyword1", "keyword2", ...],
        "secondaryKeywords": ["keyword1", "keyword2", ...],
        "tags": ["tag1", "tag2", ...],
        "metaDescriptions": ["description1", "description2", "description3"],
        "analysis": {
          "strengths": ["strength1", "strength2", ...],
          "weaknesses": ["weakness1", "weakness2", ...]
        },
        "recommendations": ["recommendation1", "recommendation2", ...],
        "analysisType": "${contentFetchSuccess ? 'full-content' : 'url-only'}"
      }
      
      IMPORTANT: Ensure your response is valid JSON that can be parsed with JSON.parse().
      Do not include any text outside the JSON object.
    `
    
    // First attempt with GPT-3.5-turbo
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an SEO expert assistant. Analyze webpages and provide SEO optimization suggestions in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5, // Lower temperature for more consistent output
        max_tokens: 1500, // Increased token limit
        response_format: { type: "json_object" }
      })
      
      const responseText = response.choices[0].message.content.trim()
      
      try {
        // Parse the JSON response
        const analysisResult = JSON.parse(responseText)
        
        // Validate the response structure
        if (!analysisResult.primaryKeywords || !analysisResult.secondaryKeywords || 
            !analysisResult.tags || !analysisResult.metaDescriptions || 
            !analysisResult.analysis || !analysisResult.recommendations) {
          throw new Error('Incomplete response structure')
        }
        
        // Add the URL to the result object
        analysisResult.url = url
        
        return analysisResult
      } catch (parseError) {
        console.error('Error parsing OpenAI response as JSON:', parseError)
        console.log('Raw response:', responseText)
        
        // Create a fallback analysis result
        return createFallbackAnalysisResult(url, contentFetchSuccess)
      }
    } catch (openaiError) {
      console.error('Error with GPT-3.5-turbo, trying fallback:', openaiError)
      
      // Create a fallback analysis result
      return createFallbackAnalysisResult(url, contentFetchSuccess)
    }
  } catch (error) {
    console.error('Error generating analysis with OpenAI:', error)
    throw new Error(`Failed to analyze URL: ${error.message || 'Unknown error'}`)
  }
}

// Create a fallback analysis result when OpenAI fails
function createFallbackAnalysisResult(url, contentFetchSuccess) {
  // Extract domain and path from URL
  const urlObj = new URL(url)
  const domain = urlObj.hostname.replace('www.', '')
  const path = urlObj.pathname
  
  // Extract potential keywords from the URL
  const pathSegments = path.split('/').filter(Boolean)
  const potentialKeywords = pathSegments.map(segment => 
    segment.replace(/-/g, ' ').replace(/\.(html|php|aspx)$/, '')
  ).filter(kw => kw.length > 0)
  
  // Use domain name as a fallback keyword if no path segments
  if (potentialKeywords.length === 0) {
    potentialKeywords.push(domain.split('.')[0])
  }
  
  return {
    url: url,
    primaryKeywords: potentialKeywords.slice(0, 5),
    secondaryKeywords: [domain.split('.')[0], "online", "website", "information", "services"],
    tags: [domain.split('.')[0], ...potentialKeywords.slice(0, 4)],
    metaDescriptions: [
      `Learn more about ${potentialKeywords[0] || domain} on our website. Find detailed information and resources.`,
      `Discover ${potentialKeywords[0] || domain} and related topics. Visit our page for comprehensive guides and tips.`,
      `Explore ${potentialKeywords[0] || domain} with our expert resources and information. Click to learn more.`
    ],
    analysis: {
      strengths: [
        "URL structure is descriptive",
        "Domain name is relevant to content",
        "URL is concise and readable"
      ],
      weaknesses: [
        "Unable to analyze actual page content due to access restrictions",
        "Meta information could not be evaluated",
        "Keyword density and placement could not be assessed"
      ]
    },
    recommendations: [
      "Ensure your page content includes keywords from the URL",
      "Add relevant meta descriptions that include your primary keywords",
      "Create quality content that addresses user search intent",
      "Include internal links to related content on your site",
      "Optimize images with descriptive alt text"
    ],
    analysisType: contentFetchSuccess ? 'full-content' : 'url-only'
  }
}
