import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
  title: string
  height?: number
}

export default function LineChart({ data, title, height = 300 }: LineChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: dataset.borderColor,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 3,
    }))
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: '#e2e8f0'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b5cff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        },
        beginAtZero: true
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      delay: (context) => {
        return context.type === 'data' && context.mode === 'default' 
          ? context.dataIndex * 100 
          : 0
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  }

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div style={{ height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
