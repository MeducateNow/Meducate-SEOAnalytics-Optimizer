import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function KeywordChart({ analyses }) {
  // Count keyword occurrences across all analyses
  const keywordCounts = React.useMemo(() => {
    if (!analyses || analyses.length === 0) return {}
    
    const counts = {}
    analyses.forEach(analysis => {
      if (!analysis.result || !analysis.result.primaryKeywords) return
      
      analysis.result.primaryKeywords.forEach(keyword => {
        counts[keyword] = (counts[keyword] || 0) + 1
      })
    })
    
    return counts
  }, [analyses])
  
  // Sort keywords by frequency and take top 10
  const topKeywords = React.useMemo(() => {
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [keywordCounts])
  
  const chartData = {
    labels: topKeywords.map(([keyword]) => keyword),
    datasets: [
      {
        label: 'Keyword Frequency',
        data: topKeywords.map(([, count]) => count),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  }
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Keywords Across All Analyses',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }
  
  if (topKeywords.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <p className="text-gray-500">No keyword data available</p>
      </div>
    )
  }
  
  return (
    <div className="h-64 bg-white rounded-lg shadow p-4">
      <Bar data={chartData} options={options} />
    </div>
  )
}
