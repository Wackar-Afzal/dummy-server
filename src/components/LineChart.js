'use client'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineChart({ data ,title,y2}) {
  console.log(data,"datata")

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'CO2 Emitted (kg)',
        },
      },
      y2:y2? {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'CO2 Saved (kg)',
        },
        grid: {
          drawOnChartArea: false, // Prevent grid lines from appearing on both y-axes
        },
      }:null,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${title}`,
      },
    },
  };

  return <Line options={options} data={data} />;
}
