import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ScoreBreakdown({ scoreDetails }) {
  if (!scoreDetails) return null;
  
  const { scores, overallScore, focusKeyword } = scoreDetails;
  
  // Get score category label
  const getScoreCategory = (score) => {
    if (score >= 80) return { label: 'Good', color: 'text-green-600' };
    if (score >= 60) return { label: 'Needs Improvement', color: 'text-amber-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };
  
  const overallCategory = getScoreCategory(overallScore);
  
  return (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          SEO Score Breakdown
        </h3>
        <p className="text-sm text-gray-500">
          Focus keyword: <span className="font-medium">{focusKeyword || 'None detected'}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Overall rating: <span className={`font-medium ${overallCategory.color}`}>{overallCategory.label}</span>
        </p>
      </div>
      
      {/* Keyword Placement */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-900">
            Keyword Placement
          </h4>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {Math.round(scores.focusKeywordPlacement.score)}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${scores.focusKeywordPlacement.score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {scores.focusKeywordPlacement.details.map((detail, index) => (
            <li key={index} className="flex items-start">
              {detail.passed ? (
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <FiXCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <span className="text-sm text-gray-800">{detail.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Linking */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-900">
            Linking
          </h4>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {Math.round(scores.linking.score)}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${scores.linking.score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {scores.linking.details.map((detail, index) => (
            <li key={index} className="flex items-start">
              {detail.passed ? (
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <FiXCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <span className="text-sm text-gray-800">{detail.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Title Readability */}
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-900">
            Title Readability
          </h4>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {Math.round(scores.titleReadability.score)}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${scores.titleReadability.score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {scores.titleReadability.details.map((detail, index) => (
            <li key={index} className="flex items-start">
              {detail.passed ? (
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <FiXCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <span className="text-sm text-gray-800">{detail.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Content Quality */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium text-gray-900">
            Content Quality
          </h4>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">
              {Math.round(scores.contentQuality.score)}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${scores.contentQuality.score}%` }}
              ></div>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {scores.contentQuality.details.map((detail, index) => (
            <li key={index} className="flex items-start">
              {detail.passed ? (
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <FiXCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <span className="text-sm text-gray-800">{detail.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
