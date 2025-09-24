import React, { useEffect, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
  data: {
    labels: string[]
    values: number[]
    colors: string[]
  }
  title: string
  centerText?: string
  size?: number
}

export default function DonutChart({ data, title, centerText, size = 200 }: DonutChartProps) {
  const chartRef = useRef<ChartJS<'doughnut'>>(null)

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
        borderColor: data.colors.map(color => color),
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverOffset: 8,
        cutout: '70%',
      }
    ]
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed} (${percentage}%)`
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart'
    },
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  }

  // Custom plugin for center text
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart: ChartJS<'doughnut'>) => {
      if (centerText) {
        const { ctx, width, height } = chart
        ctx.restore()
        const fontSize = Math.min(width, height) / 10
        ctx.font = `bold ${fontSize}px Inter, sans-serif`
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#ffffff'
        
        const textX = Math.round(width / 2)
        const textY = Math.round(height / 2)
        
        ctx.fillText(centerText, textX, textY)
        ctx.save()
      }
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      ChartJS.register(centerTextPlugin)
    }
    
    return () => {
      ChartJS.unregister(centerTextPlugin)
    }
  }, [centerText])

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">{title}</h3>
      <div style={{ height: size, position: 'relative' }}>
        <Doughnut 
          ref={chartRef}
          data={chartData} 
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
    </div>
  )
}
