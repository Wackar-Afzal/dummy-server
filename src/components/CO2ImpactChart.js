// components/CO2ImpactChart.js
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const CO2ImpactChart = ({ data }) => {
  // Ensure transactions is always an array
  const transactions = data?.customers 
    ? data.customers.flatMap(c => c.transactions || []) 
    : (data?.transactions || [])

  // Safely calculate total CO2 emissions
  const totalCO2 = transactions.reduce((sum, t) => sum + (t.CO2?.Emissions || 0), 0)

  // Prepare chart data
  const chartData = {
    labels: ['CO2 Emitted', 'CO2 Saved'],
    datasets: [
      {
        data: [totalCO2, Math.max(0, 100 - totalCO2)], // Assuming 100 as baseline
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'CO2 Impact',
      },
    },
  }

  // Render the Doughnut chart
  return <Doughnut options={options} data={chartData} />
}

export default CO2ImpactChart
