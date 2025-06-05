import { useState, useEffect } from 'react'
import { FiMenu, FiSearch, FiBell, FiUser } from 'react-icons/fi'

export default function Header({ setSidebarOpen }) {
  const [apiKeySet, setApiKeySet] = useState(false)
  
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
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <div className="text-2xl font-bold text-primary-600">SEO Optimizer</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {!apiKeySet && (
              <div className="mr-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm">
                API Key not set
              </div>
            )}
            
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <span className="sr-only">View notifications</span>
                <FiBell className="h-6 w-6" aria-hidden="true" />
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                  <FiUser className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
