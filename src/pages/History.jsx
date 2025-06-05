import React, { useState, useEffect } from 'react'
import { FiLoader, FiExternalLink, FiTrash2 } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import AnalysisResult from '../components/AnalysisResult'
import toast from 'react-hot-toast'

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [deleting, setDeleting] = useState(false)
  
  useEffect(() => {
    fetchAnalyses()
  }, [])
  
  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching analyses:', error)
        toast.error('Failed to load history: ' + error.message)
        return
      }
      
      setAnalyses(data || [])
      
      // Select the first analysis by default if available
      if (data && data.length > 0 && !selectedAnalysis) {
        setSelectedAnalysis(data[0])
      }
    } catch (error) {
      console.error('Error in fetchAnalyses:', error)
      toast.error('An error occurred while loading history')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return
    }
    
    try {
      setDeleting(true)
      
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting analysis:', error)
        toast.error('Failed to delete analysis: ' + error.message)
        return
      }
      
      // Remove from state
      setAnalyses(analyses.filter(analysis => analysis.id !== id))
      
      // If the deleted analysis was selected, clear selection
      if (selectedAnalysis && selectedAnalysis.id === id) {
        setSelectedAnalysis(null)
      }
      
      toast.success('Analysis deleted successfully')
    } catch (error) {
      console.error('Error in handleDelete:', error)
      toast.error('An error occurred while deleting the analysis')
    } finally {
      setDeleting(false)
    }
  }
  
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
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your previous URL analyses
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FiLoader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
          <span>Loading analysis history...</span>
        </div>
      ) : analyses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">No analyses found in your history.</p>
          <a href="/analyzer" className="btn btn-primary">
            Analyze a URL
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Your Analyses
                </h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {analyses.map((analysis) => (
                  <li 
                    key={analysis.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedAnalysis?.id === analysis.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="px-4 py-4 sm:px-6 flex justify-between">
                      <div className="truncate">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {truncateUrl(analysis.url)}
                          </p>
                          <a 
                            href={analysis.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-400 hover:text-gray-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(analysis.created_at)}
                        </p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(analysis.id)
                        }}
                        disabled={deleting}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <div className="card p-6">
                <AnalysisResult 
                  result={selectedAnalysis.result} 
                  url={selectedAnalysis.url} 
                />
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-gray-500">
                  Select an analysis from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
