import React from 'react'
import { FiEye, FiTrash2 } from 'react-icons/fi'

export default function HistoryTable({ analyses, onViewDetails, onDeleteAnalysis }) {
  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // Truncate URL if it's too long
  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }
  
  // Get a summary of the analysis
  const getAnalysisSummary = (result) => {
    if (!result) return 'No data'
    
    const keywordCount = (result.primaryKeywords?.length || 0) + (result.secondaryKeywords?.length || 0)
    const tagCount = result.tags?.length || 0
    const metaCount = result.metaDescriptions?.length || 0
    
    return `${keywordCount} keywords, ${tagCount} tags, ${metaCount} meta descriptions`
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Summary
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {analyses.map((analysis) => (
            <tr key={analysis.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <a 
                  href={analysis.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 hover:underline"
                >
                  {truncateUrl(analysis.url)}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(analysis.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getAnalysisSummary(analysis.result)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(analysis)}
                  className="text-primary-600 hover:text-primary-900 mr-4"
                  title="View details"
                >
                  <FiEye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteAnalysis(analysis.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete analysis"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
