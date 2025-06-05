import React from 'react'
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

export default function AnalysisResult({ result, url }) {
  if (!result) return null
  
  const {
    primaryKeywords,
    secondaryKeywords,
    tags,
    metaDescriptions,
    analysis,
    recommendations
  } = result
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Analysis Results for {url}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Primary Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {primaryKeywords?.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Secondary Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {secondaryKeywords?.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card p-5 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="card p-5 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Optimized Meta Descriptions</h3>
        <div className="space-y-3">
          {metaDescriptions?.map((desc, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-800">{desc}</p>
              <div className="mt-1 text-xs text-gray-500">
                {desc.length} characters {desc.length <= 160 ? '(Good)' : '(Too long)'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Strengths</h3>
          <ul className="space-y-2">
            {analysis?.strengths?.map((strength, index) => (
              <li key={index} className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm text-gray-800">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Weaknesses</h3>
          <ul className="space-y-2">
            {analysis?.weaknesses?.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <FiAlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-sm text-gray-800">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="card p-5">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
        <ul className="space-y-2">
          {recommendations?.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mr-3">
                {index + 1}
              </span>
              <span className="text-sm text-gray-800">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
