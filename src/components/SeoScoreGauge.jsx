import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SeoScoreGauge({ score }) {
  // Default to 0 if score is not provided
  const scoreValue = score || 0;
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green for good scores
    if (score >= 60) return '#f59e0b'; // Amber for medium scores
    return '#ef4444'; // Red for poor scores
  };
  
  const scoreColor = getScoreColor(scoreValue);
  
  // Chart data
  const data = {
    datasets: [
      {
        data: [scoreValue, 100 - scoreValue],
        backgroundColor: [
          scoreColor,
          '#e5e7eb', // Light gray for remaining portion
        ],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  
  return (
    <div className="relative h-48 w-48">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-gray-900">{scoreValue}</span>
        <span className="text-sm text-gray-500">out of 100</span>
      </div>
    </div>
  );
}
