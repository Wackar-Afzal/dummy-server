import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const TransctionTripleBar = ({ data }) => {
  const [chartData, setChartData] = useState({});

  // Mapping of category codes to human-readable names
  const categoryMapping = {
    '5812': 'Food & Beverage',         // Restaurants & Fast Food
    '4121': 'Travel',                  // Uber, Lyft, etc.
    '5310': 'Clothing',                // Clothing Stores
    '5200': 'Home Improvement',        // Home Improvement Stores
    '5311': 'Shopping',                // General Shopping
    '8211': 'Education',               // Schools, Colleges
    '7922': 'Entertainment',           // Theatrical Producers
  };

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data available or data is not in correct format');
      return;
    }

    const categoryData = data.reduce((acc, transaction) => {
      const categoryCode = transaction?.MerchantDetails?.MerchantCategoryCode;
      const emissions = transaction?.CO2?.Emissions || 0;
      const co2Saved = transaction?.CO2Saved || 0; // Assuming CO2 saved is present in your data

      // Use category name instead of code, or default to 'others'
      const categoryName = categoryMapping[categoryCode] || 'others';

      if (!acc[categoryName]) {
        acc[categoryName] = { totalTransactions: 0, totalCO2: 0, totalCO2Saved: 0 };
      }

      // Count number of transactions per category
      acc[categoryName].totalTransactions += 1;
      acc[categoryName].totalCO2 += emissions;
      acc[categoryName].totalCO2Saved += co2Saved;

      return acc;
    }, {});

    const categories = Object.keys(categoryData);
    const transactionCounts = categories.map((cat) => categoryData[cat].totalTransactions);
    const co2Emissions = categories.map((cat) => categoryData[cat].totalCO2);
    const co2Saved = categories.map((cat) => categoryData[cat].totalCO2Saved);

    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Number of Transactions',
          data: transactionCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: 'CO2 Emissions (kg)',
          data: co2Emissions,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y2',
        },
        {
          label: 'CO2 Saved (kg)',
          data: co2Saved,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          yAxisID: 'y2',
        },
      ],
    });
  }, [data]);

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Number of Transactions',
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'CO2 (kg)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Number of Transactions vs CO2 Emissions and CO2 Saved by Category</h2>
      {chartData.labels?.length > 0 ? (
        <div className="w-full">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>No data available to display.</p>
      )}
    </div>
  );
};

export default TransctionTripleBar;
