import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiClock, FiSettings, FiLoader, FiBarChart2, FiLink, FiFileText } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import KeywordChart from '../components/KeywordChart'

export default function Dashboard() {
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiKeySet, setApiKeySet] = useState(false)
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    topKeywords: [],
    recentActivity: 0
  })
  
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
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch recent analyses
        const { data: analysesData, error: analysesError } = await supabase
          .from('analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (analysesError) {
          console.error('Error fetching recent analyses:', analysesError)
          return
        }
        
        setRecentAnalyses(analysesData || [])
        
        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('analyses')
          .select('*')
        
        if (statsError) {
          console.error('Error fetching stats:', statsError)
          return
        }
        
        // Calculate stats
        const totalAnalyses = statsData?.length || 0;
        
        // Calculate average score
        const scores = statsData
          ?.map(analysis => analysis.score || 0)
          .filter(score => score > 0);
        
        const averageScore = scores?.length 
          ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) 
          : 0;
        
        // Calculate recent activity (analyses in the last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentActivity = statsData?.filter(analysis => {
          const analysisDate = new Date(analysis.created_at);
          return analysisDate >= oneWeekAgo;
        }).length || 0;
        
        setStats({
          totalAnalyses,
          averageScore,
          recentActivity
        });
      } catch (error) {
        console.error('Error in fetchData:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
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
        <StatCard 
          title="Total Analyses" 
          value={stats.totalAnalyses} 
          icon={<FiBarChart2 className="h-6 w-6" />} 
        />
        
        <StatCard 
          title="Average SEO Score" 
          value={`${stats.averageScore}/100`} 
          icon={<FiFileText className="h-6 w-6" />} 
          change={stats.averageScore > 70 ? "Good" : "Needs improvement"} 
          changeType={stats.averageScore > 70 ? "positive" : "negative"} 
        />
        
        <StatCard 
          title="Recent Activity" 
          value={stats.recentActivity} 
          icon={<FiClock className="h-6 w-6" />} 
          change="Last 7 days" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Keyword Trends</h3>
          <KeywordChart analyses={recentAnalyses} />
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/analyzer"
              className="flex items-center p-3 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors"
            >
              <FiSearch className="h-5 w-5 mr-3" />
              <span>Analyze New URL</span>
            </Link>
            
            <Link
              to="/history"
              className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiClock className="h-5 w-5 mr-3" />
              <span>View Analysis History</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiSettings className="h-5 w-5 mr-3" />
              <span>Configure Settings</span>
            </Link>
          </div>
        </div>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
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
                        className="text-primary-600 hover:text-primary-800 hover:underline flex items-center"
                      >
                        <FiLink className="h-4 w-4 mr-2" />
                        {truncateUrl(analysis.url)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(analysis.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {analysis.score ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          analysis.score >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : analysis.score >= 60 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {analysis.score}/100
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
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
