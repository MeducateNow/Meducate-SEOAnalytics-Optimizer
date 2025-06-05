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
    
    // Try to fetch content from the URL using a CORS proxy
    const content = await fetchUrlContent(url)
    
    // Generate analysis using OpenAI
    const analysis = await generateAnalysis(openai, url, content)
    
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
      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      content = await response.text()
      success = true
      break
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

async function generateAnalysis(openai, url, content) {
  try {
    // Truncate content if it's too long (OpenAI has token limits)
    const truncatedContent = content.substring(0, 15000)
    
    const prompt = `
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
        "recommendations": ["recommendation1", "recommendation2", ...]
      }
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an SEO expert assistant. Analyze webpages and provide SEO optimization suggestions in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
    
    const responseText = response.choices[0].message.content.trim()
    
    // Extract JSON from the response
    let jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/)
    let jsonStr = ''
    
    if (jsonMatch && jsonMatch[1]) {
      // Extract JSON from code block
      jsonStr = jsonMatch[1]
    } else {
      // Try to find JSON directly
      jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      } else {
        jsonStr = responseText
      }
    }
    
    try {
      // Parse the JSON response
      const analysisResult = JSON.parse(jsonStr)
      return analysisResult
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError)
      console.log('Raw response:', responseText)
      throw new Error('Failed to parse analysis result')
    }
  } catch (error) {
    console.error('Error generating analysis with OpenAI:', error)
    throw error
  }
}
