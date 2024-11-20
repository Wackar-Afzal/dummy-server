'use client';
import { useEffect, useRef, useState } from 'react';
import { icons } from '../../../assets/icons';
import MerchantEcoChart from '@/components/TopMerchant';
import DougnutChart from '@/components/DougnutChart';
import LineChart from '@/components/LineChart';
import ThreeBarChart from '@/components/ThreeBarChart';
import { HtmlToImage } from '@/utils/HtmlToPng';


export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('last30days');
  const componentRef = useRef(null);


  const handleCapture = (format) => {
    HtmlToImage(componentRef.current,format)

  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/transctions?customerId=cust_001`, { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Check if data is empty before filtering
  const filteredData =
  data && Object.keys(data).length > 0
    ? timeRange === 'last30days'
      ? data.last30days
      : timeRange === 'yearly'
      ? data.yearly
      : data.monthly
    : []; // Return an empty array if data is empty


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // If filtered data is empty, render a message
  // if (!filteredData.length) {
  //   return <p>No data available for the selected time range.</p>;
  // }

  return (
    <>

    <div ref={componentRef} className='p-4'>
      <div className='flex justify-between'>
        <h1 className='font-bold'>Customer ABC DashBoard</h1>
        <div className='flex gap-4'>

          <button onClick={() => setTimeRange('yearly')} className={`flex items-center text-[.8rem] border p-2 ${timeRange === 'yearly' ? 'bg-slate-600 text-white' : ''}`}>
            Yearly
          </button>
          <button onClick={() => setTimeRange('monthly')} className={`flex items-center text-[.8rem] border p-2 ${timeRange === 'monthly' ? 'bg-slate-600 text-white' : ''}`}>
            Monthly
          </button>
          <button onClick={() => setTimeRange('last30days')} className={` flex items-center text-[.8rem] border p-2 ${timeRange === 'last30days' ? 'bg-slate-600 text-white' : ''}`}>
            Last 30 Days
          </button>
      <button className="bg-slate-800 text-white p-2" onClick={()=>handleCapture('png')}>Download</button>

        </div>
      </div>
      <div className='flex mt-4 mb-4'>
      <div>
      <p className='p-4'> Customer abc completed <span className='pr-color font-bold'>{filteredData.totalTransactions}</span> transactions {timeRange === 'last30days'?"in last 30 days":timeRange === 'monthly'?"in last 12 months":"with Bank ABC"}, reducing carbon emissions by <span className='pr-color font-bold'>{filteredData.totalCo2Saved}</span> kg while producing <span className='pr-color font-bold'>{filteredData.totalCo2Emitted}</span> kg</p>
      <div className='flex justify-between gap-5 m-4'>
        <div className='w-[33%] bg-gray-100 flex flex-col justify-center gap-4 items-center shadow-lg'>
          {icons.light}
          <h1 className='font-semibold'>Per Transaction CO2 Production</h1>
          <p>{filteredData.perTranscionCo2} kg/transaction</p>
        </div>
        <div className='flex flex-col justify-center items-center gap-4 w-[33%] p-4 shadow-lg'>
          {icons.light}
          <h1 className='font-semibold'>Trees Burdened</h1>
          <p className='text-center'>{filteredData.treesBurderned} trees burdened due to carbon emissions.</p>
        </div>
        <div className='flex flex-col justify-center items-center gap-4 w-[33%] p-4 shadow-lg '>
          {icons.light}
          <h1 className='font-semibold'>Trees Relaxed</h1>
          <p className='text-center'>{filteredData.treesRelaxed} trees relaxed due to less carbon emissions.</p>
        </div>

      </div>
      </div>
      <div className='flex flex-col justify-center items-center w-[30%] h-[18rem]  p-4'>
          <DougnutChart  label1="CO2 Emitted" value1={filteredData.totalCo2Emitted} label2="CO2 Saved"  value2={filteredData.totalCo2Saved}  />
        </div>
      </div>

      <div className='flex mt-8 gap-4'>
        <div className='w-[50%] shadow-lg '>
          <LineChart data={filteredData.co2EmissionCo2SavedOverTime} title="CO2 Emissions & CO2 Saved over time" y2={true}/>
        </div>
        <div className='w-[50%] shadow-lg '>
          <LineChart data={filteredData.categoryEmissionsOverTime} title="CO2 Emissions of each category over time" y2={false}/>
        </div>

      </div>
      <div className='flex'>
        <div className='w-[50%] shadow-lg '>
          <ThreeBarChart data={filteredData.categoryCo2Trans} text1="Number of transctions" text2="CO2 (kg)" title="CO2 Emissions, CO2 Saved, and number of transction by Category"/>
        </div>
        <div className='w-[50%] shadow-lg '>
          <ThreeBarChart data={filteredData.categoryCo2Amount} text1="Amount Spent (USD)" text2="CO2 (kg)" title="CO2 Emissions, CO2 Saved, and Amount Spent by Category"/>
        </div>
      </div>
      <div className='flex'>

        <div className='w-[50%] shadow-lg '>
          <MerchantEcoChart data={filteredData.topmerchant} text1="Amount Spent (USD)" text2="CO2 (kg)" title="Top 5 Eco-Friendly Merchants (Spending & CO2 Saved)" x2={true}/>
        </div>
        <div className='w-[50%] shadow-lg '>
          <MerchantEcoChart data={filteredData.topCO2SavedCategories} text1="Amount Spent (USD)" text2="CO2 (kg)" title="Top 5 Eco-Friendly categories (CO2 Saved)" x2={false}/>
        </div>
      </div>
      </div>
    </>
  );
}
