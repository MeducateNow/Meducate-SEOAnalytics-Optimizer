import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Integration settings
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('')
  const [googleSearchConsoleVerified, setGoogleSearchConsoleVerified] = useState(false)
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    weeklyReports: true,
    contentPerformance: true,
    seoAlerts: true
  })
  
  // API settings
  const [apiKey, setApiKey] = useState('••••••••••••••••')
  const [showApiKey, setShowApiKey] = useState(false)
  
  const handleSaveIntegrations = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // This would normally save to Supabase
      // For demo purposes, we'll just simulate a successful save
      
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: 'Integration settings saved successfully!' 
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while saving settings.' 
      })
      setLoading(false)
    }
  }
  
  const handleSaveNotifications = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      // This would normally save to Supabase
      // For demo purposes, we'll just simulate a successful save
      
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: 'Notification settings saved successfully!' 
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'An error occurred while saving settings.' 
      })
      setLoading(false)
    }
  }
  
  const generateNewApiKey = () => {
    // This would normally generate a new API key
    // For demo purposes, we'll just simulate a new key
    
    const newKey = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    setApiKey(newKey)
    setShowApiKey(true)
    
    setMessage({ 
      type: 'success', 
      text: 'New API key generated successfully! Make sure to copy it now.' 
    })
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {message.text && (
            <div className={`mb-4 rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Account Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account settings.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date().toLocaleDateString()}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Premium
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Analytics Integrations */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Analytics Integrations</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Connect your analytics accounts for enhanced reporting.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleSaveIntegrations}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="google-analytics-id" className="block text-sm font-medium text-gray-700">
                      Google Analytics ID
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="google-analytics-id"
                        id="google-analytics-id"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                        value={googleAnalyticsId}
                        onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter your Google Analytics tracking ID to integrate with your Meducate.now account.
                    </p>
                  </div>
                  
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="google-search-console"
                        name="google-search-console"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={googleSearchConsoleVerified}
                        onChange={(e) => setGoogleSearchConsoleVerified(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="google-search-console" className="font-medium text-gray-700">
                        Google Search Console Verified
                      </label>
                      <p className="text-gray-500">
                        Check this if you've verified your domain with Google Search Console.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Integration Settings'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage how and when you receive notifications.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <form onSubmit={handleSaveNotifications}>
                <div className="space-y-6">
                  <div>
                    <div className="text-base font-medium text-gray-900">Email Notifications</div>
                    <p className="text-sm text-gray-500">
                      Select which email notifications you'd like to receive.
                    </p>
                    
                    <div className="mt-4 space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="weekly-reports"
                            name="weekly-reports"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={emailNotifications.weeklyReports}
                            onChange={(e) => setEmailNotifications({
                              ...emailNotifications,
                              weeklyReports: e.target.checked
                            })}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="weekly-reports" className="font-medium text-gray-700">
                            Weekly Performance Reports
                          </label>
                          <p className="text-gray-500">
                            Receive a weekly summary of your content performance.
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="content-performance"
                            name="content-performance"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={emailNotifications.contentPerformance}
                            onChange={(e) => setEmailNotifications({
                              ...emailNotifications,
                              contentPerformance: e.target.checked
                            })}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="content-performance" className="font-medium text-gray-700">
                            Content Performance Alerts
                          </label>
                          <p className="text-gray-500">
                            Get notified when your content reaches performance milestones.
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="seo-alerts"
                            name="seo-alerts"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            checked={emailNotifications.seoAlerts}
                            onChange={(e) => setEmailNotifications({
                              ...emailNotifications,
                              seoAlerts: e.target.checked
                            })}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="seo-alerts" className="font-medium text-gray-700">
                            SEO Improvement Suggestions
                          </label>
                          <p className="text-gray-500">
                            Receive suggestions for improving your content's SEO.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Notification Settings'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* API Access */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">API Access</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your API keys for programmatic access.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type={showApiKey ? "text" : "password"}
                      name="api-key"
                      id="api-key"
                      className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      value={apiKey}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                    >
                      {showApiKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Use this key to authenticate API requests. Keep it secure and never share it publicly.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={generateNewApiKey}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Generate New API Key
                  </button>
                </div>
                
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Generating a new API key will invalidate your existing key. Any applications or scripts using the old key will need to be updated.
                        </p>
                      </div>
                    </div>
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
