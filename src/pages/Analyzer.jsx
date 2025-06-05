import React, { useState, useEffect } from 'react'
import { FiSearch, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AnalysisResult from '../components/AnalysisResult'
import SeoScoreDashboard from '../components/SeoScoreDashboard'
import { fetchAndAnalyzeUrl } from '../lib/openai'
import { calculateSeoScore } from '../lib/seoScoring'
import { supabase, refreshSchemaCache, verifyAnalysesTableStructure } from '../lib/supabase'

export default function Analyzer() {
  const [url, setUrl] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scoreDetails, setScoreDetails] = useState(null)
  const [apiKeySet, setApiKeySet] = useState(false)
  const [error, setError] = useState(null)
  const [dbReady, setDbReady] = useState(false)
  
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY
      setApiKeySet(!!apiKey)
    }
    
    checkApiKey()
    window.addEventListener('storage', checkApiKey)
    
    // Verify database structure on component mount
    const initDb = async () => {
      try {
        // First refresh the schema cache
        await refreshSchemaCache()
        
        // Then verify the table structure
        const verified = await verifyAnalysesTableStructure()
        setDbReady(verified)
        
        if (!verified) {
          console.warn('Database structure verification failed')
        }
      } catch (error) {
        console.error('Database initialization error:', error)
      }
    }
    
    initDb()
    
    return () => {
      window.removeEventListener('storage', checkApiKey)
    }
  }, [])
  
  // Calculate SEO score whenever result changes
  useEffect(() => {
    if (result) {
      const score = calculateSeoScore(result, url, focusKeyword)
      setScoreDetails(score)
    } else {
      setScoreDetails(null)
    }
  }, [result, url, focusKeyword])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Please enter a URL')
      return
    }
    
    if (!focusKeyword) {
      toast.error('Please enter a focus keyword')
      return
    }
    
    if (!apiKeySet) {
      toast.error('Please set your OpenAI API key in Settings')
      return
    }
    
    // Basic URL validation
    try {
      new URL(url)
    } catch (error) {
      toast.error('Please enter a valid URL')
      return
    }
    
    setLoading(true)
    setResult(null)
    setScoreDetails(null)
    setError(null)
    
    try {
      const analysisResult = await fetchAndAnalyzeUrl(url)
      
      if (!analysisResult) {
        throw new Error('No analysis result returned')
      }
      
      setResult(analysisResult)
      
      // Calculate SEO score
      const score = calculateSeoScore(analysisResult, url, focusKeyword)
      setScoreDetails(score)
      
      // Prepare data for database
      const analysisData = {
        url: url,
        focus_keyword: focusKeyword,
        result: analysisResult,
        score: score.overallScore
      }
      
      console.log('Saving analysis to database:', analysisData)
      
      // Verify database structure before saving
      if (!dbReady) {
        await verifyAnalysesTableStructure()
      }
      
      // Save to database
      try {
        // First try with the focus_keyword column
        const { data, error: dbError } = await supabase
          .from('analyses')
          .insert([analysisData])
          .select()
        
        if (dbError) {
          console.error('Database error:', dbError)
          
          // If there's an error with focus_keyword, try without it
          if (dbError.message.includes('focus_keyword')) {
            console.log('Trying to save without focus_keyword')
            
            const fallbackData = {
              url: url,
              result: {
                ...analysisResult,
                focus_keyword: focusKeyword // Include focus_keyword in the result JSON instead
              },
              score: score.overallScore
            }
            
            const { data: fallbackResult, error: fallbackError } = await supabase
              .from('analyses')
              .insert([fallbackData])
              .select()
            
            if (fallbackError) {
              throw fallbackError
            } else {
              console.log('Analysis saved to database without focus_keyword column:', fallbackResult)
              toast.success('Analysis completed and saved to history (focus keyword stored in result)')
            }
          } else {
            throw dbError
          }
        } else {
          console.log('Analysis saved to database successfully:', data)
          
          // Show appropriate toast message based on analysis type
          if (analysisResult.analysisType === 'url-only') {
            toast.success('URL-only analysis completed and saved to history')
          } else {
            toast.success('Full content analysis completed and saved to history')
          }
        }
      } catch (dbError) {
        console.error('Error saving to database:', dbError)
        toast.error('Failed to save analysis to history: ' + (dbError.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error.message || 'Unknown error')
      toast.error('Error analyzing URL: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">URL Analyzer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter a URL to analyze and get SEO optimization suggestions
        </p>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL to Analyze
              </label>
              <input
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog-post"
                className="input"
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-700 mb-1">
                Focus Keyword
              </label>
              <input
                type="text"
                id="focusKeyword"
                name="focusKeyword"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g., digital marketing"
                className="input"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the main keyword you want to rank for. This will be used to calculate your SEO score.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto flex items-center justify-center"
                disabled={loading || !apiKeySet}
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2 h-5 w-5" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-2 h-5 w-5" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
          
          {!apiKeySet && (
            <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md">
              <p className="text-sm">
                Please set your OpenAI API key in the Settings page before analyzing URLs.
              </p>
            </div>
          )}
        </form>
        
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <FiLoader className="animate-spin h-10 w-10 text-primary-600 mb-4" />
            <p className="text-gray-600">Analyzing URL content and generating SEO suggestions...</p>
            <p className="text-sm text-gray-500 mt-2">This may take up to a minute</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-md font-medium text-red-800 mb-2">Error Analyzing URL</h3>
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              This may be due to CORS restrictions on the target website. Try a different URL or a site that allows cross-origin requests.
            </p>
          </div>
        )}
        
        {scoreDetails && <SeoScoreDashboard scoreDetails={scoreDetails} />}
        
        <AnalysisResult result={result} url={url} focusKeyword={focusKeyword} />
      </div>
    </div>
  )
}
