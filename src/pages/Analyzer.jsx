import React, { useState, useEffect } from 'react'
import { FiSearch, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AnalysisResult from '../components/AnalysisResult'
import { fetchAndAnalyzeUrl } from '../lib/openai'
import { supabase } from '../lib/supabase'

export default function Analyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [apiKeySet, setApiKeySet] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY
      setApiKeySet(!!apiKey)
    }
    
    checkApiKey()
    window.addEventListener('storage', checkApiKey)
    
    return () => {
      window.removeEventListener('storage', checkApiKey)
    }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      toast.error('Please enter a URL')
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
    setError(null)
    
    try {
      const analysisResult = await fetchAndAnalyzeUrl(url)
      setResult(analysisResult)
      
      // Save to database
      const { data, error: dbError } = await supabase
        .from('analyses')
        .insert([
          { 
            url, 
            result: analysisResult 
          }
        ])
        .select()
      
      if (dbError) {
        console.error('Database error:', dbError)
        toast.error('Failed to save analysis to history: ' + dbError.message)
        // Don't throw here, we still want to show results even if DB save fails
      } else {
        console.log('Analysis saved to database successfully:', data)
        toast.success('Analysis completed and saved to history')
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
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
            <div className="flex items-end">
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
        
        <AnalysisResult result={result} url={url} />
      </div>
    </div>
  )
}
