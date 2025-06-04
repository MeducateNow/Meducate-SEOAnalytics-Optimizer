import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalContent: 0,
    optimizedContent: 0,
    totalPageViews: 0,
    averageEngagement: 0
  })
  const [recentContent, setRecentContent] = useState([])
  const [topKeywords, setTopKeywords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would normally fetch real data from Supabase
    // For demo purposes, we'll use mock data
    const fetchDashboardData = async () => {
      setLoading(true)
      
      try {
        // Mock data for demonstration
        setStats({
          totalContent: 24,
          optimizedContent: 18,
          totalPageViews: 12453,
          averageEngagement: 67.8
        })
        
        setRecentContent([
          { id: 1, title: 'Advanced Cardiac Life Support', type: 'Webinar', views: 1245, engagement: 72.4, trend: 'up' },
          { id: 2, title: 'New Approaches to Diabetes Management', type: 'Article', views: 987, engagement: 68.9, trend: 'up' },
          { id: 3, title: 'Pediatric Emergency Medicine Update', type: 'Webinar', views: 876, engagement: 65.2, trend: 'down' },
          { id: 4, title: 'Mental Health in Primary Care', type: 'Article', views: 654, engagement: 59.8, trend: 'up' },
          { id: 5, title: 'Antibiotic Stewardship Guidelines', type: 'Article', views: 543, engagement: 62.1, trend: 'down' }
        ])
        
        setTopKeywords([
          { keyword: 'cardiac care', volume: 2400, difficulty: 'Medium', opportunity: 'High' },
          { keyword: 'diabetes management', volume: 1800, difficulty: 'High', opportunity: 'Medium' },
          { keyword: 'pediatric emergency', volume: 1600, difficulty: 'Medium', opportunity: 'High' },
          { keyword: 'mental health primary care', volume: 1200, difficulty: 'Low', opportunity: 'High' },
          { keyword: 'antibiotic stewardship', volume: 950, difficulty: 'Medium', opportunity: 'Medium' }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-60 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <DocumentTextIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Content</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalContent}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/content" className="font-medium text-primary-600 hover:text-primary-500">
                  View all<span className="sr-only"> content</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <MagnifyingGlassIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">SEO Optimized</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.optimizedContent}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/seo-optimizer" className="font-medium text-primary-600 hover:text-primary-500">
                  Optimize more<span className="sr-only"> content</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Page Views</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalPageViews.toLocaleString()}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/analytics" className="font-medium text-primary-600 hover:text-primary-500">
                  View analytics<span className="sr-only"> for page views</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Engagement</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.averageEngagement}%</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link to="/performance" className="font-medium text-primary-600 hover:text-primary-500">
                  View performance<span className="sr-only"> metrics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="mt-8">
          <div className="pb-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Content Performance</h3>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Engagement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentContent.map((content) => (
                        <tr key={content.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/content/${content.id}`} className="hover:text-primary-600">
                                {content.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{content.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{content.views.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{content.engagement}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {content.trend === 'up' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                <ArrowUpIcon className="h-4 w-4 mr-1" /> Up
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                <ArrowDownIcon className="h-4 w-4 mr-1" /> Down
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="mt-8">
          <div className="pb-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Top Performing Keywords</h3>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keyword
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Search Volume
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opportunity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topKeywords.map((keyword, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{keyword.volume.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              keyword.difficulty === 'High' 
                                ? 'bg-red-100 text-red-800' 
                                : keyword.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {keyword.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              keyword.opportunity === 'High' 
                                ? 'bg-green-100 text-green-800' 
                                : keyword.opportunity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {keyword.opportunity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
