import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function ContentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This would normally fetch real data from Supabase
    // For demo purposes, we'll use mock data
    const fetchContentDetail = async () => {
      setLoading(true)
      
      try {
        // Mock data for demonstration
        const mockContent = {
          id: parseInt(id),
          title: 'Advanced Cardiac Life Support',
          type: 'Webinar',
          description: 'This comprehensive webinar covers the latest guidelines and techniques for Advanced Cardiac Life Support (ACLS). Medical professionals will learn about updated protocols, medication administration, and team dynamics during cardiac emergencies.',
          created_at: '2023-10-15',
          updated_at: '2023-10-20',
          status: 'published',
          seo_optimized: true,
          views: 1245,
          engagement: 72.4,
          duration: '90 minutes',
          presenter: 'Dr. Sarah Johnson, MD, FACC',
          meta_description: 'Learn the latest ACLS guidelines and techniques for cardiac emergencies in this comprehensive webinar for medical professionals.',
          keywords: ['ACLS', 'cardiac life support', 'emergency medicine', 'cardiac arrest', 'medical education', 'CPR guidelines'],
          tags: ['Emergency Medicine', 'Cardiology', 'Critical Care', 'CME'],
          performance: {
            organic_traffic: 876,
            referral_traffic: 245,
            social_traffic: 124,
            avg_time_on_page: '6:32',
            bounce_rate: '24%',
            conversion_rate: '8.2%'
          }
        }
        
        setContent(mockContent)
      } catch (error) {
        console.error('Error fetching content detail:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContentDetail()
  }, [id, user])

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="h-80 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Content not found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The content you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <div className="mt-6">
                <Link
                  to="/content"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Back to Content List
                </Link>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/content"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Back
            </Link>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">{content.title}</h1>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/seo-optimizer?id=${content.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <MagnifyingGlassIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              SEO Optimize
            </Link>
            <Link
              to={`/analytics?id=${content.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChartBarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Analytics
            </Link>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Content Overview */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Content Overview</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and metadata.</p>
              </div>
              <div>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  content.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {content.status}
                </span>
                <span className="ml-2">
                  {content.seo_optimized ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-xs">SEO Optimized</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600">
                      <XCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-xs">Not Optimized</span>
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.title}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.type}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.description}</dd>
                </div>
                {content.type === 'Webinar' && (
                  <>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.duration}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Presenter</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.presenter}</dd>
                    </div>
                  </>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(content.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(content.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* SEO Information */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">SEO Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Search engine optimization details.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Meta Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{content.meta_description}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Keywords</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {content.keywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Performance Metrics */}
          {content.status === 'published' && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Metrics</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Analytics and engagement data.</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="bg-white overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.views.toLocaleString()}</dd>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Engagement Rate</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.engagement}%</dd>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time on Page</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.performance.avg_time_on_page}</dd>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Organic Traffic</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.performance.organic_traffic.toLocaleString()}</dd>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Bounce Rate</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.performance.bounce_rate}</dd>
                          </dl>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{content.performance.conversion_rate}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
