import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  Filler
)

export default function Analytics() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const contentId = searchParams.get('id')
  
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    // This would normally fetch real data from Supabase
    // For demo purposes, we'll use mock data
    const fetchAnalyticsData = async () => {
      setLoading(true)
      
      try {
        // Generate dates for the chart
        const dates = []
        const now = new Date()
        const daysToShow = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
        
        for (let i = daysToShow - 1; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        }
        
        // Generate random data for the charts
        const generateRandomData = (min, max, count) => {
          return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
        }
        
        const pageViews = generateRandomData(50, 200, daysToShow)
        const uniqueVisitors = pageViews.map(views => Math.floor(views * 0.7))
        const bounceRates = generateRandomData(20, 60, daysToShow)
        const avgTimeOnPage = generateRandomData(60, 300, daysToShow)
        
        // Calculate totals and averages
        const totalPageViews = pageViews.reduce((a, b) => a + b, 0)
        const totalUniqueVisitors = uniqueVisitors.reduce((a, b) => a + b, 0)
        const avgBounceRate = Math.round(bounceRates.reduce((a, b) => a + b, 0) / bounceRates.length)
        const avgTime = Math.round(avgTimeOnPage.reduce((a, b) => a + b, 0) / avgTimeOnPage.length)
        
        // Traffic sources
        const trafficSources = {
          labels: ['Organic Search', 'Direct', 'Referral', 'Social', 'Email', 'Other'],
          data: [45, 25, 15, 10, 3, 2]
        }
        
        // Device breakdown
        const deviceBreakdown = {
          labels: ['Desktop', 'Mobile', 'Tablet'],
          data: [55, 38, 7]
        }
        
        // Geographic data
        const topCountries = [
          { country: 'United States', visitors: Math.floor(totalUniqueVisitors * 0.65) },
          { country: 'United Kingdom', visitors: Math.floor(totalUniqueVisitors * 0.12) },
          { country: 'Canada', visitors: Math.floor(totalUniqueVisitors * 0.08) },
          { country: 'Australia', visitors: Math.floor(totalUniqueVisitors * 0.06) },
          { country: 'Germany', visitors: Math.floor(totalUniqueVisitors * 0.04) },
          { country: 'Other', visitors: Math.floor(totalUniqueVisitors * 0.05) }
        ]
        
        // Set the analytics data
        setAnalyticsData({
          dates,
          pageViews,
          uniqueVisitors,
          bounceRates,
          avgTimeOnPage,
          totalPageViews,
          totalUniqueVisitors,
          avgBounceRate,
          avgTime,
          trafficSources,
          deviceBreakdown,
          topCountries
        })
        
        // If content ID is provided, fetch content details
        if (contentId) {
          const mockContent = {
            id: parseInt(contentId),
            title: 'Advanced Cardiac Life Support',
            type: 'Webinar'
          }
          setContent(mockContent)
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalyticsData()
  }, [contentId, dateRange, user])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
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
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">
              {content ? `Analytics: ${content.title}` : 'Analytics Dashboard'}
            </h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-500">
              <CalendarIcon className="inline-block h-5 w-5 mr-1 text-gray-400" />
              Time period:
            </span>
            <select
              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Page Views</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{analyticsData.totalPageViews.toLocaleString()}</dd>
                  <dd className="mt-2 flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                    12.5% from previous period
                  </dd>
                </dl>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Unique Visitors</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{analyticsData.totalUniqueVisitors.toLocaleString()}</dd>
                  <dd className="mt-2 flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                    8.2% from previous period
                  </dd>
                </dl>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Bounce Rate</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{analyticsData.avgBounceRate}%</dd>
                  <dd className="mt-2 flex items-center text-sm text-red-600">
                    <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                    3.2% from previous period
                  </dd>
                </dl>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time on Page</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatTime(analyticsData.avgTime)}</dd>
                  <dd className="mt-2 flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                    <span className="sr-only">Increased by</span>
                    15.3% from previous period
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Traffic Overview Chart */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Traffic Overview</h3>
            <div className="h-80">
              <Line
                data={{
                  labels: analyticsData.dates,
                  datasets: [
                    {
                      label: 'Page Views',
                      data: analyticsData.pageViews,
                      borderColor: 'rgb(99, 102, 241)',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      tension: 0.3,
                      fill: true
                    },
                    {
                      label: 'Unique Visitors',
                      data: analyticsData.uniqueVisitors,
                      borderColor: 'rgb(20, 184, 166)',
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      tension: 0.3,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  },
                  interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                  }
                }}
              />
            </div>
          </div>

          {/* Traffic Sources and Device Breakdown */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Traffic Sources</h3>
              <div className="h-64">
                <Doughnut
                  data={{
                    labels: analyticsData.trafficSources.labels,
                    datasets: [
                      {
                        data: analyticsData.trafficSources.data,
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.8)',
                          'rgba(20, 184, 166, 0.8)',
                          'rgba(245, 158, 11, 0.8)',
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(107, 114, 128, 0.8)'
                        ],
                        borderColor: [
                          'rgba(99, 102, 241, 1)',
                          'rgba(20, 184, 166, 1)',
                          'rgba(245, 158, 11, 1)',
                          'rgba(239, 68, 68, 1)',
                          'rgba(16, 185, 129, 1)',
                          'rgba(107, 114, 128, 1)'
                        ],
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Device Breakdown</h3>
              <div className="h-64">
                <Doughnut
                  data={{
                    labels: analyticsData.deviceBreakdown.labels,
                    datasets: [
                      {
                        data: analyticsData.deviceBreakdown.data,
                        backgroundColor: [
                          'rgba(99, 102, 241, 0.8)',
                          'rgba(20, 184, 166, 0.8)',
                          'rgba(245, 158, 11, 0.8)'
                        ],
                        borderColor: [
                          'rgba(99, 102, 241, 1)',
                          'rgba(20, 184, 166, 1)',
                          'rgba(245, 158, 11, 1)'
                        ],
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="h-80">
              <Bar
                data={{
                  labels: analyticsData.dates,
                  datasets: [
                    {
                      label: 'Bounce Rate (%)',
                      data: analyticsData.bounceRates,
                      backgroundColor: 'rgba(239, 68, 68, 0.6)',
                      borderColor: 'rgba(239, 68, 68, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'Avg. Time on Page (seconds)',
                      data: analyticsData.avgTimeOnPage,
                      backgroundColor: 'rgba(16, 185, 129, 0.6)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.dataset.label.includes('Time')) {
                            label += formatTime(context.raw);
                          } else {
                            label += context.raw + '%';
                          }
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Geographic Distribution</h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visitors
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topCountries.map((country, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{country.country}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{country.visitors.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {((country.visitors / analyticsData.totalUniqueVisitors) * 100).toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Details */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <ComputerDesktopIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Desktop Users</dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {Math.round(analyticsData.totalUniqueVisitors * (analyticsData.deviceBreakdown.data[0] / 100)).toLocaleString()}
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        {analyticsData.deviceBreakdown.data[0]}% of total
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-secondary-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Mobile Users</dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {Math.round(analyticsData.totalUniqueVisitors * (analyticsData.deviceBreakdown.data[1] / 100)).toLocaleString()}
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        {analyticsData.deviceBreakdown.data[1]}% of total
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <ClockIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Session Duration</dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {formatTime(analyticsData.avgTime * 1.8)}
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        <span className="text-green-600">+12.3%</span> vs. previous period
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
