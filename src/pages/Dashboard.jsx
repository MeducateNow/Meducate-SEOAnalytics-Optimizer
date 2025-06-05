import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiClock, FiSettings, FiLoader } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiKeySet, setApiKeySet] = useState(false)
  
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
  
  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (error) {
          console.error('Error fetching recent analyses:', error)
          return
        }
        
        setRecentAnalyses(data || [])
      } catch (error) {
        console.error('Error in fetchRecentAnalyses:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentAnalyses()
  }, [])
  
  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // Truncate URL if it's too long
  const truncateUrl = (url, maxLength = 40) => {
    if (!url) return 'Unknown URL'
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to SEO Optimizer. Get started by analyzing a URL.
        </p>
      </div>
      
      {!apiKeySet && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-md font-medium text-amber-800 mb-2">OpenAI API Key Required</h3>
          <p className="text-sm text-amber-700 mb-3">
            To use the SEO Optimizer, you need to set your OpenAI API key in the Settings page.
          </p>
          <Link to="/settings" className="btn btn-sm btn-amber">
            Go to Settings
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/analyzer"
          className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <FiSearch className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analyze URL</h3>
          <p className="text-sm text-gray-500">
            Analyze a webpage and get AI-powered SEO suggestions
          </p>
        </Link>
        
        <Link
          to="/history"
          className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <FiClock className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">View History</h3>
          <p className="text-sm text-gray-500">
            Access your previous analyses and results
          </p>
        </Link>
        
        <Link
          to="/settings"
          className="card p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <FiSettings className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
          <p className="text-sm text-gray-500">
            Configure your API keys and preferences
          </p>
        </Link>
      </div>
      
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Analyses
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
            <span>Loading recent analyses...</span>
          </div>
        ) : recentAnalyses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No analyses found. Start by analyzing a URL.</p>
            <Link to="/analyzer" className="btn btn-primary mt-4">
              Analyze URL
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a 
                        href={analysis.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        {truncateUrl(analysis.url)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(analysis.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to="/history"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
