import React, { useState, useEffect } from 'react'
import { FiSave, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  
  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save API key to localStorage
    localStorage.setItem('openai_api_key', apiKey.trim())
    
    // Show success message
    setSaved(true)
    toast.success('API key saved successfully')
    
    // Reset saved state after 3 seconds
    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your API keys and application preferences
        </p>
      </div>
      
      <div className="card p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Keys</h2>
            
            <div className="mb-4">
              <label htmlFor="openai_api_key" className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                id="openai_api_key"
                name="openai_api_key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="input"
              />
              <p className="mt-1 text-sm text-gray-500">
                Your OpenAI API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              {saved ? (
                <>
                  <FiCheck className="mr-2 h-5 w-5" />
                  Saved
                </>
              ) : (
                <>
                  <FiSave className="mr-2 h-5 w-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
