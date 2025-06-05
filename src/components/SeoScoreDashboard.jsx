import React from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi'

export default function SeoScoreDashboard({ scoreDetails }) {
  if (!scoreDetails) return null
  
  const { scores, overallScore, focusKeyword, isUrlOnlyAnalysis } = scoreDetails
  
  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }
  
  // Determine score background color based on value
  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-amber-100'
    return 'bg-red-100'
  }
  
  return (
    <div className="mt-8 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Score</h2>
      
      {isUrlOnlyAnalysis && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <FiInfo className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <p className="text-sm text-blue-700">
              This is a URL-only analysis score. For a more accurate score, try a URL that allows content access.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="md:col-span-1 card p-5 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </div>
          <div className="text-sm text-gray-500 mt-1">Overall Score</div>
          <div className="text-xs text-gray-400 mt-1">Focus: {focusKeyword}</div>
        </div>
        
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(scores).map(([key, scoreData]) => (
            <div key={key} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  {key === 'focusKeywordPlacement' ? 'Keyword Placement' : 
                   key === 'linking' ? 'Linking' : 
                   key === 'titleReadability' ? 'Title Readability' : 
                   'Content Quality'}
                </h3>
                <div className={`text-sm font-semibold ${getScoreColor(scoreData.score)}`}>
                  {Math.round(scoreData.score)}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${getScoreBgColor(scoreData.score)} h-2 rounded-full`} 
                  style={{ width: `${scoreData.score}%` }}
                ></div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                {scoreData.points}/{scoreData.maxPoints} points
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(scores).map(([key, scoreData]) => (
          <div key={key} className="card p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {key === 'focusKeywordPlacement' ? 'Keyword Placement' : 
               key === 'linking' ? 'Linking' : 
               key === 'titleReadability' ? 'Title Readability' : 
               'Content Quality'}
            </h3>
            
            <ul className="space-y-2">
              {scoreData.details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  {detail.passed ? (
                    <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <FiAlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  )}
                  <span className="text-sm text-gray-800">{detail.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
