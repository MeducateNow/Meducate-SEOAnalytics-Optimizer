import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function ContentList() {
  const { user } = useAuth()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    // This would normally fetch real data from Supabase
    // For demo purposes, we'll use mock data
    const fetchContent = async () => {
      setLoading(true)
      
      try {
        // Mock data for demonstration
        const mockContent = [
          { 
            id: 1, 
            title: 'Advanced Cardiac Life Support', 
            type: 'Webinar', 
            created_at: '2023-10-15', 
            status: 'published',
            seo_optimized: true,
            views: 1245,
            engagement: 72.4
          },
          { 
            id: 2, 
            title: 'New Approaches to Diabetes Management', 
            type: 'Article', 
            created_at: '2023-10-12', 
            status: 'published',
            seo_optimized: true,
            views: 987,
            engagement: 68.9
          },
          { 
            id: 3, 
            title: 'Pediatric Emergency Medicine Update', 
            type: 'Webinar', 
            created_at: '2023-10-08', 
            status: 'published',
            seo_optimized: true,
            views: 876,
            engagement: 65.2
          },
          { 
            id: 4, 
            title: 'Mental Health in Primary Care', 
            type: 'Article', 
            created_at: '2023-10-05', 
            status: 'draft',
            seo_optimized: false,
            views: 0,
            engagement: 0
          },
          { 
            id: 5, 
            title: 'Antibiotic Stewardship Guidelines', 
            type: 'Article', 
            created_at: '2023-10-01', 
            status: 'published',
            seo_optimized: true,
            views: 543,
            engagement: 62.1
          },
          { 
            id: 6, 
            title: 'Telemedicine Best Practices', 
            type: 'Webinar', 
            created_at: '2023-09-28', 
            status: 'published',
            seo_optimized: false,
            views: 432,
            engagement: 58.7
          },
          { 
            id: 7, 
            title: 'COVID-19 Long-term Effects', 
            type: 'Article', 
            created_at: '2023-09-25', 
            status: 'published',
            seo_optimized: true,
            views: 789,
            engagement: 64.3
          },
          { 
            id: 8, 
            title: 'Oncology Treatment Advances', 
            type: 'Webinar', 
            created_at: '2023-09-20', 
            status: 'draft',
            seo_optimized: false,
            views: 0,
            engagement: 0
          },
          { 
            id: 9, 
            title: 'Preventive Care Guidelines 2023', 
            type: 'Article', 
            created_at: '2023-09-15', 
            status: 'published',
            seo_optimized: true,
            views: 654,
            engagement: 61.8
          },
          { 
            id: 10, 
            title: 'Medical Ethics in Modern Practice', 
            type: 'Webinar', 
            created_at: '2023-09-10', 
            status: 'published',
            seo_optimized: true,
            views: 521,
            engagement: 59.5
          }
        ]
        
        setContent(mockContent)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContent()
  }, [user])

  // Filter content based on search term and filter type
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'webinar' && item.type === 'Webinar') ||
      (filterType === 'article' && item.type === 'Article') ||
      (filterType === 'optimized' && item.seo_optimized) ||
      (filterType === 'not-optimized' && !item.seo_optimized) ||
      (filterType === 'published' && item.status === 'published') ||
      (filterType === 'draft' && item.status === 'draft')
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Content</h1>
        </div>
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Content</h1>
          <Link
            to="/content/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Content
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Content</option>
                <option value="webinar">Webinars</option>
                <option value="article">Articles</option>
                <option value="optimized">SEO Optimized</option>
                <option value="not-optimized">Not Optimized</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
          
          {/* Content List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => (
                  <li key={item.id}>
                    <Link to={`/content/${item.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{item.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            {item.seo_optimized ? (
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
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {item.type}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Created: {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {item.status === 'published' && (
                              <>
                                <span className="mr-4">{item.views.toLocaleString()} views</span>
                                <span>{item.engagement}% engagement</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-500">
                  No content found matching your criteria.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
