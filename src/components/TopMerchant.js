import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MerchantEcoChart({ data, title, x2 }) {
  const options = useMemo(() => ({
    responsive: true,
    indexAxis: 'y',
    borderRadius: 50,
    plugins: {
      legend: {
        display: true, // Ensure legend is displayed
        position: 'top', // Position legend at the top
        labels: {
          boxWidth: 20, // Size of color box next to legend text
          padding: 15, // Padding around each legend item
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x1: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'CO2(kg) saved',
        },
        ticks: {
          beginAtZero: true,
        },
      },
      ...(x2 && {
        x2: {
          type: 'linear',
          position: 'top',
          ticks: {
            beginAtZero: true,
          },
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Amount($) Spent',
          },
        },
      }),
      y: {
        type: 'category',
        labels: data.labels,
      },
    },
  }), [data, title, x2]);

  return (
    <div className="p-6">
      {data.labels?.length > 0 ? (
        <div className="w-full">
          <Bar data={data} options={options} />
        </div>
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
}
