import React from 'react'

export default function StatCard({ title, value, icon, change, changeType }) {
  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-12 w-12 rounded-md flex items-center justify-center ${
            changeType === 'positive' 
              ? 'bg-green-100 text-green-600' 
              : changeType === 'negative'
                ? 'bg-red-100 text-red-600'
                : 'bg-primary-100 text-primary-600'
          }`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${
            changeType === 'positive' 
              ? 'text-green-600' 
              : changeType === 'negative'
                ? 'text-red-600'
                : 'text-gray-500'
          }`}>
            {changeType === 'positive' && (
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{change}</span>
          </div>
        </div>
      )}
    </div>
  )
}
