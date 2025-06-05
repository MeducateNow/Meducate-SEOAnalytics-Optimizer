import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiExternalLink, FiClock, FiBarChart2, FiLoader } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchAnalyses() {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setAnalyses(data || [])
      } catch (error) {
        console.error('Error fetching analyses:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalyses()
  }, [])
  
  // Function to get domain from URL
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch (error) {
      return url
    }
  }
  
  // Function to format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return 'Unknown date'
    }
  }
  
  // Function to get score color class
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your previous SEO analyses
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
          <span>Loading analysis history...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-md font-medium text-red-800 mb-2">Error Loading History</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't analyzed any URLs yet.</p>
          <Link to="/analyzer" className="btn btn-primary">
            Analyze a URL
          </Link>
        </div>
      ) : (
        <div className="card p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analysis Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                          {getDomain(analysis.url).charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {getDomain(analysis.url)}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {analysis.url}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analysis.score !== null ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColorClass(analysis.score)}`}>
                          {analysis.score}/100
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">No score</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${analysis.result?.analysisType === 'url-only' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {analysis.result?.analysisType === 'url-only' ? 'URL Only' : 'Full Content'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-4 w-4 text-gray-400" />
                        {formatDate(analysis.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <a 
                          href={analysis.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                          title="Open URL"
                        >
                          <FiExternalLink className="h-5 w-5" />
                        </a>
                        <Link
                          to={`/analyzer?url=${encodeURIComponent(analysis.url)}`}
                          className="text-primary-600 hover:text-primary-800"
                          title="Re-analyze"
                        >
                          <FiBarChart2 className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
