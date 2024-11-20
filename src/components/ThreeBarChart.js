import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ThreeBarChart = ({ data,text1,text2,title }) => {


  const options = {
    responsive: true,
    borderRadius:'50',

    scales: {
      y1: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: text1,
        },
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: text2,
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
      title: {
        display: true,
        text: `${title}`,
      },
    },
  };

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
};

export default ThreeBarChart;
