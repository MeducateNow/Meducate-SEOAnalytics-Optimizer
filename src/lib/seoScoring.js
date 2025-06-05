/**
 * SEO Scoring System
 * Calculates an overall SEO score based on various criteria
 */

// Define scoring weights (total should add up to 100)
const SCORING_WEIGHTS = {
  focusKeywordPlacement: 40, // 40% of total score
  linking: 20,               // 20% of total score
  titleReadability: 30,      // 30% of total score
  contentQuality: 10         // 10% of total score
};

/**
 * Calculate SEO score based on analysis results
 * @param {Object} result - The analysis result object
 * @param {string} url - The analyzed URL
 * @param {string} userFocusKeyword - User-provided focus keyword (optional)
 * @returns {Object} - Score details and overall score
 */
export function calculateSeoScore(result, url, userFocusKeyword = '') {
  if (!result) return null;
  
  // Use user-provided focus keyword if available, otherwise use the first primary keyword
  const focusKeyword = userFocusKeyword || result.primaryKeywords?.[0] || '';
  
  // Check if this is a URL-only analysis
  const isUrlOnlyAnalysis = result.analysisType === 'url-only';
  
  // Initialize score components
  const scores = {
    focusKeywordPlacement: calculateKeywordPlacementScore(result, focusKeyword, url, isUrlOnlyAnalysis),
    linking: calculateLinkingScore(result, isUrlOnlyAnalysis),
    titleReadability: calculateTitleReadabilityScore(result, focusKeyword, isUrlOnlyAnalysis),
    contentQuality: calculateContentQualityScore(result, isUrlOnlyAnalysis)
  };
  
  // Calculate overall score (weighted average)
  const overallScore = Object.keys(scores).reduce((total, key) => {
    return total + (scores[key].score * SCORING_WEIGHTS[key] / 100);
  }, 0);
  
  return {
    scores,
    overallScore: Math.round(overallScore),
    focusKeyword,
    isUrlOnlyAnalysis
  };
}

/**
 * Calculate score for keyword placement
 */
function calculateKeywordPlacementScore(result, focusKeyword, url, isUrlOnlyAnalysis) {
  if (!focusKeyword) {
    return { score: 0, details: [] };
  }
  
  const details = [];
  let points = 0;
  let maxPoints = isUrlOnlyAnalysis ? 3 : 5; // Fewer points possible for URL-only analysis
  
  // Check if focus keyword is in title
  const keywordInTitle = result.analysis?.strengths?.some(
    strength => strength.toLowerCase().includes('keyword in title') || 
                strength.toLowerCase().includes('title contains keyword')
  );
  
  if (keywordInTitle) {
    points++;
    details.push({ passed: true, text: 'Focus keyword found in SEO title' });
  } else {
    details.push({ passed: false, text: 'Focus keyword missing from SEO title' });
  }
  
  // Check if focus keyword is in meta description
  const keywordInMetaDesc = result.metaDescriptions?.some(
    desc => desc.toLowerCase().includes(focusKeyword.toLowerCase())
  );
  
  if (keywordInMetaDesc) {
    points++;
    details.push({ passed: true, text: 'Focus keyword found in meta description' });
  } else {
    details.push({ passed: false, text: 'Focus keyword missing from meta description' });
  }
  
  // Check if focus keyword is in URL
  const keywordInUrl = url.toLowerCase().includes(
    focusKeyword.toLowerCase().replace(/\s+/g, '-')
  );
  
  if (keywordInUrl) {
    points++;
    details.push({ passed: true, text: 'Focus keyword found in URL' });
  } else {
    details.push({ passed: false, text: 'Focus keyword missing from URL' });
  }
  
  // Skip content-specific checks for URL-only analysis
  if (!isUrlOnlyAnalysis) {
    // Check if focus keyword appears in first 10% of content
    const keywordInFirstPart = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('beginning of content') || 
                  strength.toLowerCase().includes('first paragraph')
    );
    
    if (keywordInFirstPart) {
      points++;
      details.push({ passed: true, text: 'Focus keyword found in first 10% of content' });
    } else {
      details.push({ passed: false, text: 'Focus keyword missing from first 10% of content' });
    }
    
    // Check if focus keyword is found in content
    const keywordInContent = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('keyword density') || 
                  strength.toLowerCase().includes('keyword appears')
    );
    
    if (keywordInContent) {
      points++;
      details.push({ passed: true, text: 'Focus keyword found in content' });
    } else {
      details.push({ passed: false, text: 'Focus keyword missing from content' });
    }
  }
  
  // Calculate percentage score
  const score = (points / maxPoints) * 100;
  
  return {
    score,
    details,
    points,
    maxPoints
  };
}

/**
 * Calculate score for linking
 */
function calculateLinkingScore(result, isUrlOnlyAnalysis) {
  const details = [];
  let points = 0;
  let maxPoints = isUrlOnlyAnalysis ? 1 : 3; // Fewer points possible for URL-only analysis
  
  // For URL-only analysis, we can only check if the URL structure suggests internal linking
  if (isUrlOnlyAnalysis) {
    // Check if URL structure suggests good internal linking (e.g., has path segments)
    const hasPathSegments = new URL(result.url || '').pathname.split('/').filter(Boolean).length > 1;
    
    if (hasPathSegments) {
      points++;
      details.push({ passed: true, text: 'URL structure suggests proper site hierarchy' });
    } else {
      details.push({ passed: false, text: 'URL structure may not reflect proper site hierarchy' });
    }
  } else {
    // Full content analysis checks
    // Check for external links
    const hasExternalLinks = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('external link') || 
                  strength.toLowerCase().includes('outbound link')
    );
    
    if (hasExternalLinks) {
      points++;
      details.push({ passed: true, text: 'External links found in content' });
    } else {
      details.push({ passed: false, text: 'No external links found' });
    }
    
    // Check for at least one external link
    const hasAtLeastOneExternal = hasExternalLinks;
    
    if (hasAtLeastOneExternal) {
      points++;
      details.push({ passed: true, text: 'At least one external link present' });
    } else {
      details.push({ passed: false, text: 'Missing at least one external link' });
    }
    
    // Check for internal links
    const hasInternalLinks = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('internal link') || 
                  strength.toLowerCase().includes('links to other')
    );
    
    if (hasInternalLinks) {
      points++;
      details.push({ passed: true, text: 'Internal links to other resources found' });
    } else {
      details.push({ passed: false, text: 'No internal links found' });
    }
  }
  
  // Calculate percentage score
  const score = (points / maxPoints) * 100;
  
  return {
    score,
    details,
    points,
    maxPoints
  };
}

/**
 * Calculate score for title readability
 */
function calculateTitleReadabilityScore(result, focusKeyword, isUrlOnlyAnalysis) {
  const details = [];
  let points = 0;
  let maxPoints = isUrlOnlyAnalysis ? 1 : 3; // Fewer points possible for URL-only analysis
  
  if (isUrlOnlyAnalysis) {
    // For URL-only analysis, we can only check if the URL itself is readable
    const urlPath = new URL(result.url || '').pathname;
    const isReadableUrl = urlPath.split('/').filter(Boolean).some(segment => 
      segment.length > 0 && 
      segment.length < 50 && 
      !segment.includes('%20') && 
      /^[a-z0-9-]+$/i.test(segment)
    );
    
    if (isReadableUrl) {
      points++;
      details.push({ passed: true, text: 'URL is readable and well-structured' });
    } else {
      details.push({ passed: false, text: 'URL could be more readable and user-friendly' });
    }
  } else {
    // Full content analysis checks
    // Check if focus keyword is at the beginning of title
    const keywordAtBeginning = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('beginning of title') || 
                  strength.toLowerCase().includes('starts with keyword')
    );
    
    if (keywordAtBeginning) {
      points++;
      details.push({ passed: true, text: 'Focus keyword used at beginning of title' });
    } else {
      details.push({ passed: false, text: 'Focus keyword not at beginning of title' });
    }
    
    // Check for sentiment in title
    const hasSentiment = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('sentiment') || 
                  strength.toLowerCase().includes('emotional') ||
                  strength.toLowerCase().includes('engaging title')
    );
    
    if (hasSentiment) {
      points++;
      details.push({ passed: true, text: 'Title has positive or negative sentiment' });
    } else {
      details.push({ passed: false, text: 'Title lacks emotional sentiment' });
    }
    
    // Check for power words in title
    const hasPowerWords = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('power word') || 
                  strength.toLowerCase().includes('compelling word') ||
                  strength.toLowerCase().includes('strong word')
    );
    
    if (hasPowerWords) {
      points++;
      details.push({ passed: true, text: 'Title contains power words' });
    } else {
      details.push({ passed: false, text: 'Title lacks power words' });
    }
  }
  
  // Calculate percentage score
  const score = (points / maxPoints) * 100;
  
  return {
    score,
    details,
    points,
    maxPoints
  };
}

/**
 * Calculate score for content quality
 */
function calculateContentQualityScore(result, isUrlOnlyAnalysis) {
  const details = [];
  let points = 0;
  let maxPoints = isUrlOnlyAnalysis ? 1 : 2; // Fewer points possible for URL-only analysis
  
  if (isUrlOnlyAnalysis) {
    // For URL-only analysis, we can only make a basic assessment
    // Check if URL suggests quality content (e.g., not too short, has descriptive segments)
    const urlPath = new URL(result.url || '').pathname;
    const pathSegments = urlPath.split('/').filter(Boolean);
    const hasDescriptiveSegments = pathSegments.some(segment => segment.length > 3 && segment.includes('-'));
    
    if (hasDescriptiveSegments) {
      points++;
      details.push({ passed: true, text: 'URL suggests descriptive content structure' });
    } else {
      details.push({ passed: false, text: 'URL structure could be more descriptive' });
    }
  } else {
    // Full content analysis checks
    // Check for keyword in subheadings
    const keywordInSubheadings = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('subheading') || 
                  strength.toLowerCase().includes('heading')
    );
    
    if (keywordInSubheadings) {
      points++;
      details.push({ passed: true, text: 'Focus keyword found in subheadings' });
    } else {
      details.push({ passed: false, text: 'Focus keyword missing from subheadings' });
    }
    
    // Check for keyword in image alt attributes
    const keywordInImageAlt = result.analysis?.strengths?.some(
      strength => strength.toLowerCase().includes('image alt') || 
                  strength.toLowerCase().includes('alt text') ||
                  strength.toLowerCase().includes('alt attribute')
    );
    
    if (keywordInImageAlt) {
      points++;
      details.push({ passed: true, text: 'Focus keyword found in image alt attributes' });
    } else {
      details.push({ passed: false, text: 'Focus keyword missing from image alt attributes' });
    }
  }
  
  // Calculate percentage score
  const score = (points / maxPoints) * 100;
  
  return {
    score,
    details,
    points,
    maxPoints
  };
}
