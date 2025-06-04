import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

export default function SeoOptimizer() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const contentId = searchParams.get('id')
  
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [metaDescription, setMetaDescription] = useState('')
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')
  const [suggestedKeywords, setSuggestedKeywords] = useState([])
  const [suggestedMetaDescription, setSuggestedMetaDescription] = useState('')
  const [seoScore, setSeoScore] = useState(0)
  const [seoIssues, setSeoIssues] = useState([])
  const [seoRecommendations, setSeoRecommendations] = useState([])

  useEffect(() => {
    // This would normally fetch real data from Supabase
    // For demo purposes, we'll use mock data
    const fetchContentForOptimization = async () => {
      setLoading(true)
      
      try {
        if (contentId) {
          // Mock data for demonstration
          const mockContent = {
            id: parseInt(contentId),
            title: 'Advanced Cardiac Life Support',
            type: 'Webinar',
            description: 'This comprehensive webinar covers the latest guidelines and techniques for Advanced Cardiac Life Support (ACLS). Medical professionals will learn about updated protocols, medication administration, and team dynamics during cardiac emergencies.',
            meta_description: 'Learn the latest ACLS guidelines and techniques for cardiac emergencies in this comprehensive webinar for medical professionals.',
            keywords: ['ACLS', 'cardiac life support', 'emergency medicine', 'cardiac arrest', 'medical education', 'CPR guidelines'],
            seo_optimized: true
          }
          
          setContent(mockContent)
          setMetaDescription(mockContent.meta_description)
          setKeywords(mockContent.keywords)
          
          // Simulate SEO analysis
          setSeoScore(78)
          setSeoIssues([
            'Meta description could be more compelling',
            'Missing some high-volume keywords',
            'Title could be more specific'
          ])
          setSeoRecommendations([
            'Add more specific medical terms related to ACLS',
            'Include keywords about certification or CME credits',
            'Mention target audience more explicitly in meta description'
          ])
          
          // Suggested improvements
          setSuggestedMetaDescription('Master the latest ACLS protocols and life-saving techniques in this CME-eligible webinar for emergency physicians, cardiologists, and critical care specialists.')
          setSuggestedKeywords([
            'ACLS certification',
            'cardiac emergency protocols',
            'CME cardiology',
            'advanced life support training',
            'cardiac arrest management',
            'emergency cardiovascular care'
          ])
        } else {
          // No content selected, show empty state
          setContent(null)
        }
      } catch (error) {
        console.error('Error fetching content for optimization:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContentForOptimization()
  }, [contentId, user])

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const handleRemoveKeyword = (keyword) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleAddSuggestedKeyword = (keyword) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword])
      // Remove from suggestions
      setSuggestedKeywords(suggestedKeywords.filter(k => k !== keyword))
    }
  }

  const handleUseSuggestedMetaDescription = () => {
    setMetaDescription(suggestedMetaDescription)
  }

  const handleAnalyzeContent = () => {
    setAnalyzing(true)
    
    // Simulate analysis delay
    setTimeout(() => {
      // Update SEO score based on changes
      const newScore = Math.min(95, seoScore + Math.floor(Math.random() * 10) + 5)
      setSeoScore(newScore)
      
      // Update issues and recommendations
      if (newScore > 85) {
        setSeoIssues(['Minor keyword density issues'])
        setSeoRecommendations(['Consider adding more internal links'])
      }
      
      setAnalyzing(false)
    }, 2000)
  }

  const handleSaveChanges = () => {
    // This would normally save to Supabase
    // For demo purposes, we'll just update the local state
    setContent({
      ...content,
      meta_description: metaDescription,
      keywords: keywords,
      seo_optimized: true
    })
    
    // Show success message or redirect
    alert('SEO changes saved successfully!')
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">SEO Optimizer</h1>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {contentId && (
              <Link
                to={`/content/${contentId}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Back to Content
              </Link>
            )}
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">SEO Optimizer</h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {!content ? (
            <div className="text-center py-12">
              <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No content selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select content from your library to optimize its SEO.
              </p>
              <div className="mt-6">
                <Link
                  to="/content"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go to Content Library
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column - Content Editor */}
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Content Information</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit SEO elements for your content.</p>
                    </div>
                    <div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.seo_optimized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.seo_optimized ? 'SEO Optimized' : 'Not Optimized'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="mb-6">
                      <h4 className="text-base font-medium text-gray-900">Title</h4>
                      <p className="mt-2 text-sm text-gray-900 font-medium">{content.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        A good title is crucial for SEO. It should be descriptive, contain key terms, and be under 60 characters.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700">
                        Meta Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="meta-description"
                          name="meta-description"
                          rows={3}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={metaDescription}
                          onChange={(e) => setMetaDescription(e.target.value)}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {metaDescription.length}/160 characters. Meta descriptions should be compelling and include key terms.
                      </p>
                      {suggestedMetaDescription && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <LightBulbIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                              <p className="text-sm text-blue-700">{suggestedMetaDescription}</p>
                              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                <button
                                  onClick={handleUseSuggestedMetaDescription}
                                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                                >
                                  Use this
                                </button>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                        Keywords
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="keywords"
                          id="keywords"
                          className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder="Add a keyword"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <button
                          type="button"
                          onClick={handleAddKeyword}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                            >
                              <span className="sr-only">Remove {keyword}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Add 5-10 relevant keywords that describe your content.
                      </p>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleAnalyzeContent}
                        disabled={analyzing}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {analyzing ? (
                          <>
                            <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                            Analyze
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - SEO Analysis */}
              <div>
                {/* SEO Score */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">SEO Score</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Overall optimization rating.</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-center">
                      <div className="relative h-36 w-36">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          ></circle>
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={seoScore >= 90 ? '#10b981' : seoScore >= 70 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="2"
                            strokeDasharray={`${seoScore} 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{seoScore}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {seoScore >= 90 
                          ? 'Excellent! Your content is well-optimized.' 
                          : seoScore >= 70 
                          ? 'Good. Some improvements could help boost your ranking.' 
                          : 'Needs work. Follow the recommendations below.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* SEO Issues */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Issues to Address</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Problems that may affect your ranking.</p>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {seoIssues.length > 0 ? (
                        seoIssues.map((issue, index) => (
                          <li key={index} className="px-4 py-4 sm:px-6">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-700">{issue}</p>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-4 sm:px-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-700">No major issues found!</p>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* SEO Recommendations */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recommendations</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Suggestions to improve your SEO.</p>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {seoRecommendations.map((recommendation, index) => (
                        <li key={index} className="px-4 py-4 sm:px-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <LightBulbIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-700">{recommendation}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Suggested Keywords */}
                {suggestedKeywords.length > 0 && (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Suggested Keywords</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">High-performing keywords for your content.</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="flex flex-wrap gap-2">
                        {suggestedKeywords.map((keyword, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddSuggestedKeyword(keyword)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
