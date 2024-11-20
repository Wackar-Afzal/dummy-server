import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ label1, value1, label2, value2 }) => {
  const chartData = {
    labels: [label1, label2],
    datasets: [
      {
        data: [value1, value2],
        backgroundColor: ['#fea022', '#171717'],
      },
    ],
  };

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
  };

  return <Doughnut options={options} data={chartData} />;
};

export default DoughnutChart;
