import React, { useState, useEffect } from 'react'
import { FiSave, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  
  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem('openai_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    }
    
    // Check if API key is set in environment variables
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY
    setHasEnvApiKey(!!envApiKey)
  }, [])
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      // If empty, remove the key from localStorage
      localStorage.removeItem('openai_api_key')
      toast.success('API key removed')
      setApiKey('')
      return
    }
    
    // Basic validation for OpenAI API key format (starts with "sk-")
    if (!apiKey.startsWith('sk-')) {
      toast.error('Invalid OpenAI API key format')
      return
    }
    
    // Save API key to localStorage
    localStorage.setItem('openai_api_key', apiKey)
    
    // Trigger storage event for other components to detect the change
    window.dispatchEvent(new Event('storage'))
    
    toast.success('API key saved successfully')
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your application settings
        </p>
      </div>
      
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h2>
        
        <div className="mb-6">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="input pr-24"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <div className="mt-2">
            {hasEnvApiKey ? (
              <div className="flex items-center text-sm text-green-600">
                <FiCheckCircle className="mr-1" />
                <span>Environment API key is available</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-amber-600">
                <FiAlertTriangle className="mr-1" />
                <span>No environment API key found</span>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Your API key is stored locally in your browser and never sent to our servers.
              {hasEnvApiKey && " You can also use the environment API key instead of setting one here."}
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Security Information</h3>
          <p className="text-xs text-blue-700">
            Your API key is stored securely in your browser's local storage and is only sent directly to OpenAI's servers.
            We never store or process your API key on our backend.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveApiKey}
            className="btn btn-primary flex items-center"
          >
            <FiSave className="mr-2 h-5 w-5" />
            Save Settings
          </button>
        </div>
      </div>
      
      <div className="mt-6 card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
        
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-sm font-medium text-amber-800 mb-1">Data Privacy</h3>
          <p className="text-xs text-amber-700">
            When you analyze a URL, the content is processed using OpenAI's API. Please ensure you have the right to analyze any content you submit.
            Your analysis results are stored in our database for your convenience, but you can delete them at any time from the History page.
          </p>
        </div>
      </div>
    </div>
  )
}
