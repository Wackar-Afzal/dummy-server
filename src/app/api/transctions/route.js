import { Underdog } from 'next/font/google';
import { NextResponse } from 'next/server'

const { faker } = require('@faker-js/faker');


// Category mapping
const categoryMapping = {
  '5812': 'Food & Beverage',
  '4121': 'Travel',
  '5310': 'Clothing',
  '5200': 'Home Improvement',
  '5311': 'Shopping',
  '8211': 'Education',
  '7922': 'Entertainment',
  '5411': 'Groceries',
  // '4814': 'Telecommunications',
  // '5541': 'Gas Stations'
};

// CO2 emission factors (kg CO2 per USD spent)
const co2Factors = {
  'Food & Beverage': 0.2,
  'Travel': 0.8,
  'Clothing': 0.3,
  'Home Improvement': 0.4,
  'Shopping': 0.3,
  'Education': 0.2,
  'Entertainment': 0.3,
  'Groceries': 0.4,
  'Telecommunications': 0.3,
  'Gas Stations': 1.0
};

// Helper function to generate a random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to calculate CO2 emissions and savings
function calculateCO2(amount, category, isEcoFriendly) {
  const factor = co2Factors[category];
  const baseEmissions = amount * (factor);
  const emissions = isEcoFriendly ? baseEmissions * 0.4 : baseEmissions; // 30% reduction for eco-friendly
  const saved = isEcoFriendly ? baseEmissions * 0.6 : 0;
  return { emissions: parseFloat(emissions.toFixed(2)), saved: parseFloat(saved.toFixed(2)) };
}

// Generate transaction data
function generateTransactions(count) {
  const transactions = [];
  const customers = new Set();
  const groups = new Set();
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const categoryKeys = Object.keys(categoryMapping);

  for (let i = 0; i < count; i++) {
    const isEcoFriendly = Math.random() < 0.3; // 30% chance of being eco-friendly
    let CustomerId=''
    let GroupId=''
    if(i%100==0){
       CustomerId = `cust_001`;
       GroupId = `group_001`;
    }else{
       CustomerId = `cust_${faker.number.int({ min: 1, max: 200 })}`;
       GroupId = `group_${faker.number.int({ min: 1, max: 20 })}`;
    }

    customers.add(CustomerId);
    groups.add(GroupId);

    let transactionDate;
    if (i < 500) {
      transactionDate = randomDate(thirtyDaysAgo, now);
    } else if (i < 1000) {
      transactionDate = randomDate(oneYearAgo, now);
    } else {
      transactionDate = randomDate(fiveYearsAgo, now);
    }

    const amount = parseFloat(faker.finance.amount({ min: 1, max: 1000, dec: 2 }));
    const categoryCode = faker.helpers.arrayElement(categoryKeys);
    const category = categoryMapping[categoryCode];
    const co2 = calculateCO2(amount, category, isEcoFriendly);

    transactions.push({
      TransctionId: `txn_${faker.string.alphanumeric(6)}`,
      TransctionDateTime: transactionDate.toISOString(),
      TransctionAmount: {
        Amount: amount,
        Currency: "USD"
      },
      MerchantDetails: {
        MerchantName: faker.company.name(),
        MerchantCategoryCode: categoryCode
      },
      Description: `${category} - ${isEcoFriendly ? 'Eco-friendly ' : ''}${faker.commerce.productName()}`,
      CustomerId: CustomerId,
      GroupId: GroupId,
      // CO2: {
      //   Emissions: co2.emissions,
      //   Source: isEcoFriendly ? `Eco-friendly ${category.toLowerCase()} transaction` : `Standard ${category.toLowerCase()} transaction`
      // },
      // CO2Saved: co2.saved
    });
  }

  return {
    transactions,
    uniqueCustomers: customers.size,
    uniqueGroups: groups.size
  };
}

// Generate 15000 transactions
const { transactions, uniqueCustomers, uniqueGroups } = generateTransactions(15000);

console.log(`Generated ${transactions.length} transactions`);
console.log(`Unique customers: ${uniqueCustomers}`);
console.log(`Unique groups: ${uniqueGroups}`);
console.log('\nSample of 5 transactions:');
console.log(JSON.stringify(transactions.slice(0, 5), null, 2));
const randomData=transactions
// const randomData = [
//   {
//     "TransactionId": "txn_001",
//     "TransactionDateTime": "2029-12-15T14:30:00Z",
//     "TransactionAmount": {
//       "Amount": 50.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Starbucks",
//       "MerchantCategoryCode": "5812"
//     },
//     "Description": "Coffee purchase",
//     "CustomerId": "cust_001",
//     "GroupId": "group_001",
//     "CO2": {
//       "Emissions": 0.5,
//       "Source": "Estimated based on coffee production and transportation"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_002",
//     "TransactionDateTime": "2022-10-16T09:15:00Z",
//     "TransactionAmount": {
//       "Amount": 120.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Uber",
//       "MerchantCategoryCode": "4121"
//     },
//     "Description": "Ride to office (Electric Vehicle)",
//     "CustomerId": "cust_002",
//     "GroupId": "group_002",
//     "CO2": {
//       "Emissions": 1.0,  // Reduced emissions due to electric vehicle
//       "Source": "Electric vehicle ride"
//     },
//     "CO2Saved": 1.0  // CO2 saved by using an electric vehicle
//   },
//   {
//     "TransactionId": "txn_003",
//     "TransactionDateTime": "2024-07-16T12:45:00Z",
//     "TransactionAmount": {
//       "Amount": 300.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Walmart",
//       "MerchantCategoryCode": "5311"
//     },
//     "Description": "Eco-friendly grocery shopping",
//     "CustomerId": "cust_003",
//     "GroupId": "group_003",
//     "CO2": {
//       "Emissions": 1.0,  // Reduced emissions for eco-friendly products
//       "Source": "Sustainable grocery products"
//     },
//     "CO2Saved": 0.5  // CO2 saved from buying eco-friendly products
//   },
//   {
//     "TransactionId": "txn_004",
//     "TransactionDateTime": "2024-10-17T18:00:00Z",
//     "TransactionAmount": {
//       "Amount": 45.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Amazon",
//       "MerchantCategoryCode": "8211"
//     },
//     "Description": "Book purchase",
//     "CustomerId": "cust_004",
//     "GroupId": "group_004",
//     "CO2": {
//       "Emissions": 0.3,
//       "Source": "Estimated based on book production and shipping"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_005",
//     "TransactionDateTime": "2024-10-17T20:30:00Z",
//     "TransactionAmount": {
//       "Amount": 75.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Domino's Pizza",
//       "MerchantCategoryCode": "5812"
//     },
//     "Description": "Dinner order (Vegan option)",
//     "CustomerId": "cust_005",
//     "GroupId": "group_005",
//     "CO2": {
//       "Emissions": 0.7,  // Reduced emissions for vegan food
//       "Source": "Vegan pizza order"
//     },
//     "CO2Saved": 0.3  // CO2 saved by choosing a vegan option
//   },
//   {
//     "TransactionId": "txn_006",
//     "TransactionDateTime": "2024-10-18T08:00:00Z",
//     "TransactionAmount": {
//       "Amount": 15.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "McDonald's",
//       "MerchantCategoryCode": "5812"
//     },
//     "Description": "Breakfast sandwich",
//     "CustomerId": "cust_006",
//     "GroupId": "group_006",
//     "CO2": {
//       "Emissions": 0.4,
//       "Source": "Estimated based on food production and transportation"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_007",
//     "TransactionDateTime": "2024-10-18T12:30:00Z",
//     "TransactionAmount": {
//       "Amount": 60.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Target",
//       "MerchantCategoryCode": "5310"
//     },
//     "Description": "Clothing purchase (Eco-friendly brand)",
//     "CustomerId": "cust_007",
//     "GroupId": "group_007",
//     "CO2": {
//       "Emissions": 0.4,  // Reduced emissions for sustainable clothing
//       "Source": "Eco-friendly clothing"
//     },
//     "CO2Saved": 0.3  // CO2 saved by purchasing sustainable clothing
//   },
//   {
//     "TransactionId": "txn_008",
//     "TransactionDateTime": "2024-10-18T17:00:00Z",
//     "TransactionAmount": {
//       "Amount": 25.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Subway",
//       "MerchantCategoryCode": "5812"
//     },
//     "Description": "Lunch order",
//     "CustomerId": "cust_008",
//     "GroupId": "group_008",
//     "CO2": {
//       "Emissions": 0.6,
//       "Source": "Estimated based on food production and transportation"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_009",
//     "TransactionDateTime": "2024-10-19T09:00:00Z",
//     "TransactionAmount": {
//       "Amount": 200.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "JetBlue",
//       "MerchantCategoryCode": "4121"
//     },
//     "Description": "Flight to New York",
//     "CustomerId": "cust_009",
//     "GroupId": "group_009",
//     "CO2": {
//       "Emissions": 4.0,
//       "Source": "Estimated based on average flight emissions"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_010",
//     "TransactionDateTime": "2024-10-19T13:30:00Z",
//     "TransactionAmount": {
//       "Amount": 300.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Best Buy",
//       "MerchantCategoryCode": "5200"
//     },
//     "Description": "Electronics purchase",
//     "CustomerId": "cust_010",
//     "GroupId": "group_010",
//     "CO2": {
//       "Emissions": 1.2,
//       "Source": "Estimated based on electronics production and shipping"
//     },
//     "CO2Saved": 0  // No CO2 savings
//   },
//   {
//     "TransactionId": "txn_011",
//     "TransactionDateTime": "2024-10-19T16:00:00Z",
//     "TransactionAmount": {
//       "Amount": 90.00,
//       "Currency": "USD"
//     },
//     "MerchantDetails": {
//       "MerchantName": "Home Depot",
//       "MerchantCategoryCode": "5210"
//     },
//     "Description": "Home improvement supplies (Sustainable materials)",
//     "CustomerId": "cust_011",
//     "GroupId": "group_011",
//     "CO2": {
//       "Emissions": 0.7,  // Reduced emissions for sustainable materials
//       "Source": "Eco-friendly construction materials"
//     },
//     "CO2Saved": 0.3  // CO2 saved by purchasing sustainable materials
//   }
// ]


// export async function GET(request) {
//   const { searchParams } = new URL(request.url)
//   const customerId = searchParams.get('customerId')
//   const groupId = searchParams.get('groupId')
//   console.log(customerId,"customerId",groupId,"groupId")



//   if (customerId) {
//     const customer = mockData.filter(transaction => transaction.CustomerId === customerId);
//     if (customer) {
//       return NextResponse.json(customer)
//     } else {
//       return NextResponse.json({ message: 'Customer not found' }, { status: 404 })
//     }
//   } else if (groupId) {
//     const group = mockData.filter(transaction => transaction.GroupId === groupId)
//     if (group) {
//       return NextResponse.json(group)
//     } else {
//       return NextResponse.json({ message: 'Group not found' }, { status: 404 })
//     }
//   } else {
//     return NextResponse.json(mockData)
//   }
// }


// const categoryMapping = {
//   '5812': 'Food & Beverage',         // Restaurants & Fast Food
//   '4121': 'Travel',                  // Uber, Lyft, etc.
//   '5310': 'Clothing',                // Clothing Stores
//   '5200': 'Home Improvement',        // Home Improvement Stores
//   '5311': 'Shopping',                // General Shopping
//   '8211': 'Education',               // Schools, Colleges
//   '7922': 'Entertainment',           // Theatrical Producers
// };


const categoryColorMapping = {
  'Food & Beverage': 'rgba(254, 160, 34, 0.5)',    // Use primary color (orange)
  'Travel': 'rgba(23, 23, 23, 0.5)',               // Foreground (dark gray/black)
  'Clothing': 'rgba(34, 128, 254, 0.5)',           // Blue
  'Home Improvement': 'rgba(75, 192, 192, 0.5)',   // Light teal
  'Shopping': 'rgba(255, 99, 132, 0.5)',           // Pink
  'Education': 'rgba(153, 102, 255, 0.5)',         // Purple
  'Entertainment': 'rgba(255, 206, 86, 0.5)',      // Yellow
};

const aggregateTransactions = (mockData, timeRange) => {
  let now = new Date();
  let yearlyData = { totalCustomers: new Set(), totalTransactions: 0, totalCo2Saved: 0, totalCo2Emitted: 0 };
  let totalMonthlyData =  { totalCustomers: new Set(), totalTransactions: 0, totalCo2Saved: 0, totalCo2Emitted: 0 };
  let totalLast30DaysData =  { totalCustomers: new Set(), totalTransactions: 0, totalCo2Saved: 0, totalCo2Emitted: 0 };

  let monthlyData=[]
  let last30days=[]
  


const isInLast12Months = (date) => {
  const now = new Date();
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setFullYear(now.getFullYear() - 1); // Subtract 12 months

  return date >= twelveMonthsAgo && date <= now; // Check if date is within the range
  
};

const isInLast30Days = (date) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30); // Subtract 30 days

  return date >= thirtyDaysAgo && date <= now; // Check if date is within the range
};

  mockData.forEach(transaction => {
    const date = new Date(transaction.TransactionDateTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.toLocaleDateString();
    // console.log(year,month,day,"date",date)
    
    
    yearlyData.totalTransactions++;
    yearlyData.totalCo2Saved += transaction.CO2Saved;
    yearlyData.totalCo2Emitted += transaction.CO2.Emissions;
    yearlyData.totalCustomers.add(transaction.CustomerId); // Use customerId from transaction
    // Monthly aggregation
    
 
   if(isInLast12Months(date)){
    totalMonthlyData.totalTransactions++;
    totalMonthlyData.totalCo2Saved += transaction.CO2Saved;
    totalMonthlyData.totalCo2Emitted += transaction.CO2.Emissions;
    totalMonthlyData.totalCustomers.add(transaction.CustomerId);
    monthlyData.push(transaction)
   }



    if (isInLast30Days(date)) {
      totalLast30DaysData.totalTransactions++;
      totalLast30DaysData.totalCo2Saved += transaction.CO2Saved;
      totalLast30DaysData.totalCo2Emitted += transaction.CO2.Emissions;
      totalLast30DaysData.totalCustomers.add(transaction.CustomerId);
      last30days.push(transaction)
    }


  });
  // Finalize customer counts
  // console.log(yearlyData,"yearly data")

  const finalizeCounts = (data) => {
      data.totalCustomers = data.totalCustomers.size; // Count unique customers
      data.totalCo2Emitted = parseFloat(data.totalCo2Emitted.toFixed(2)); // Convert to string, then back to number
      data.totalCo2Saved = parseFloat(data.totalCo2Saved.toFixed(2));
      data.treesBurderned=Math.round(data.totalCo2Emitted/21.77)
      data.treesRelaxed=Math.round(data.totalCo2Saved/21.77)
      data.perTranscionCo2=parseFloat((data.totalCo2Emitted/data.totalTransactions).toFixed(2));
  };

  // Finalize counts for yearly and monthly data
  finalizeCounts(yearlyData);
  finalizeCounts(totalMonthlyData);
  finalizeCounts(totalLast30DaysData);

  // console.log(yearlyData,"yearly data")
  // Prepare the data for charting
  const timeCo2emitedSaved = (data, timeUnit) => {
    const labels = [];
    const emittedData = [];
    const savedData = [];
    const aggregatedData = {};
  
    // Aggregate data based on the time unit
    data.forEach(transaction => {
      const date = new Date(transaction.TransactionDateTime);
      let key;
  
      // Create a key based on the time unit
      if (timeUnit === 'year') {
        key = date.getFullYear();
      } else if (timeUnit === 'month') {
        key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        key = date.toISOString().split('T')[0]; // Use YYYY-MM-DD for daily
      }
  
      // Initialize data if not already present
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          totalCo2Emitted: 0,
          totalCo2Saved: 0,
        };
      }
  
      // Accumulate emissions and savings
      aggregatedData[key].totalCo2Emitted += transaction.CO2.Emissions;
      aggregatedData[key].totalCo2Saved += transaction.CO2Saved;
    });
  
    // Sort the keys based on the time unit
    const sortedKeys = Object.keys(aggregatedData).sort((a, b) => {
      if (timeUnit === 'year') {
        return a - b; // Sort numerically for years
      } else if (timeUnit === 'month') {
        return new Date(a + '-01') - new Date(b + '-01'); // Sort by year-month
      } else {
        return new Date(a) - new Date(b); // Sort by date
      }
    });
  
    // Populate labels and datasets based on sorted keys
    for (const key of sortedKeys) {
      labels.push(key);
      emittedData.push(aggregatedData[key].totalCo2Emitted);
      savedData.push(aggregatedData[key].totalCo2Saved);
    }
  
    return {
      labels,
      datasets: [
        {
          label: 'CO2 Emitted (kg)',
          data: emittedData,
          borderColor: 'rgba(0, 0, 0, 1)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
        {
          label: 'CO2 Saved (kg)',
          data: savedData,
          borderColor: 'rgba(254, 160, 34)',
          backgroundColor: 'rgba(254, 160, 34,0.2)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y2',
        },
      ],
    };
  };

  const categoryCo2Amount = (data,type) => {
    const categoryData = data.reduce((acc, transaction) => {
      const categoryCode = transaction?.MerchantDetails?.MerchantCategoryCode;
      const amount = transaction?.TransactionAmount?.Amount || 0;
      const emissions = transaction?.CO2?.Emissions || 0;
      const saved = transaction?.CO2Saved || 0; // Assuming 'Saved' value exists in your data
  
      // Use category name instead of code, or default to 'others'
      const categoryName = categoryMapping[categoryCode] || 'others';
  
      if (!acc[categoryName]) {
        acc[categoryName] = { 
          totalAmount: 0, 
          totalCO2: 0, 
          totalCO2Saved: 0,
          transactionsCount: 0 // Initialize transaction count
        };
      }
  
      acc[categoryName].totalAmount += amount;
      acc[categoryName].totalCO2 += emissions;
      acc[categoryName].totalCO2Saved += saved;
      acc[categoryName].transactionsCount += 1; // Increment transaction count
  
      return acc;
    }, {});
  
    const categories = Object.keys(categoryData).sort((a, b) => b.length - a.length);


    const amounts = categories.map((cat) => categoryData[cat].totalAmount);
    const co2Emissions = categories.map((cat) => categoryData[cat].totalCO2);
    const co2Saved = categories.map((cat) => categoryData[cat].totalCO2Saved);
    const transactionsCount = categories.map((cat) => categoryData[cat].transactionsCount); // Get transaction count
  
    if(type==='amount'){
      return {
        labels: categories,
        datasets: [
          {
            label: 'Amount Spent (USD)',
            data: amounts,
            backgroundColor: ' rgba(254, 160, 34)',
            borderColor: 'rgba(254, 160, 34, 1)',
            borderWidth: 0,
            yAxisID: 'y1',
          },
          {
            label: 'CO2 Emissions (kg)',
            data: co2Emissions,
            backgroundColor: 'rgba(34, 128, 254, 1)',
            borderColor: 'rgba(0, 191, 166, 1)',
            borderWidth: 0,
            yAxisID: 'y2',
          },
          {
            label: 'CO2 Saved (kg)',
            data: co2Saved,
            backgroundColor: 'rgba(254, 127, 34, 1)',
            borderColor: 'rgba(254, 227, 34, 1)',
            borderWidth: 0,
            yAxisID: 'y2', // CO2 Saved shares the same axis as CO2 Emissions
          },
         
        ],
      };
    }else{
      return {
        labels: categories,
        datasets: [
          {
            label: 'CO2 Emissions (kg)',
            data: co2Emissions,
            backgroundColor: 'rgba(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 0,
            yAxisID: 'y2',
          },
          {
            label: 'CO2 Saved (kg)',
            data: co2Saved,
            backgroundColor: 'rgba(255, 159, 64)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 0,
            yAxisID: 'y2', // CO2 Saved shares the same axis as CO2 Emissions
          },
          {
            label: 'Number of Transactions',
            data: transactionsCount, // Add transaction count to the chart
            backgroundColor: 'rgba(153, 102, 255)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 0,
            yAxisID: 'y1', // Add a new axis for the number of transactions
          },
        ],
      };
    }

  };
  const categoryEmissionsOverTime = (data, timeUnit) => {
    const aggregatedData = {};
  
    // Aggregate data based on time and category
    data.forEach((transaction) => {
      const date = new Date(transaction.TransactionDateTime);
      let timeKey;
  
      // Create a key based on the time unit
      if (timeUnit === 'year') {
        timeKey = date.getFullYear();
      } else if (timeUnit === 'month') {
        timeKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`; // YYYY-MM
      } else {
        timeKey = date.toISOString().split('T')[0]; // YYYY-MM-DD for daily
      }
  
      const categoryCode = transaction?.MerchantDetails?.MerchantCategoryCode;
      const emissions = transaction?.CO2?.Emissions || 0;
      const categoryName = categoryMapping[categoryCode] || 'others';
  
      // Initialize data if not present for the given time and category
      if (!aggregatedData[timeKey]) {
        aggregatedData[timeKey] = {};
      }
      if (!aggregatedData[timeKey][categoryName]) {
        aggregatedData[timeKey][categoryName] = {
          totalCo2Emitted: 0,
        };
      }
  
      // Accumulate emissions for the category
      aggregatedData[timeKey][categoryName].totalCo2Emitted += emissions;
    });
  
    // Extract labels and datasets
    const labels = Object.keys(aggregatedData).sort((a, b) => {
      if (timeUnit === 'year') {
        return a - b; // Sort by year
      } else if (timeUnit === 'month') {
        return new Date(a + '-01') - new Date(b + '-01'); // Sort by year-month
      } else {
        return new Date(a) - new Date(b); // Sort by date
      }
    });
  
    const categoryNames = Array.from(
      new Set(
        data.map(
          (transaction) =>
            categoryMapping[transaction?.MerchantDetails?.MerchantCategoryCode] ||
            'others'
        )
      )
    );
  
    const datasets = categoryNames.map((category) => {
      const emissionsData = labels.map((label) => {
        return aggregatedData[label][category]
          ? aggregatedData[label][category].totalCo2Emitted
          : 0;
      });
  
      return {
        label: category,
        data: emissionsData,
        backgroundColor: categoryColorMapping[category] || 'rgba(153, 10, 55, 0.6)', // Set color for each category
        borderColor: categoryColorMapping[category] || 'rgba(153, 10, 55, 1)',        
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      };
    });
  
    return {
      labels,
      datasets,
    };
  };
  
  const topMerchant = (data) => {
    const merchantAggregation = data.reduce((acc, transaction) => {
      // Extract merchant details
      const merchantName = transaction?.MerchantDetails?.MerchantName;
      const amountSpent = transaction?.TransactionAmount?.Amount || 0;
      const co2Saved = transaction?.CO2Saved || 0;
  
      // Initialize the merchant data if not already done
      if (!acc[merchantName]) {
        acc[merchantName] = {
          totalAmountSpent: 0,
          totalCO2Saved: 0,
        };
      }
  
      // Accumulate the values
      acc[merchantName].totalAmountSpent += amountSpent;
      acc[merchantName].totalCO2Saved += co2Saved;
  
      return acc;
    }, {});
  
    // Sort merchants by total amount spent and select top 10
    const sortedMerchants = Object.entries(merchantAggregation)
      .sort(([, a], [, b]) => b.totalCO2Saved - a.totalCO2Saved)
      .slice(0,5);
  
    // Extract merchant names, total amount spent, and total CO2 saved for the chart
    const merchantNames = sortedMerchants.map(([merchant]) => merchant.substring(0, 15)+'...');
    const totalAmountsSpent = sortedMerchants.map(([, data]) => data.totalAmountSpent);
    const totalCO2Saved = sortedMerchants.map(([, data]) => data.totalCO2Saved);
  console.log(sortedMerchants,"sorted merchants",merchantNames,"name",totalAmountsSpent,"amount spent",totalCO2Saved,"co2 saved")
    // Return chart data
    return {
      labels: merchantNames, // Merchant names for the x-axis
      datasets: [
        {
          label: 'Amount Spent (USD)',
          data: totalAmountsSpent, // Amount spent data
          backgroundColor: 'rgba(254, 160, 34)',
          borderColor: 'rgba(254, 160, 34)',
          borderWidth: 0,
          xAxisID: 'x2', // Associate with first axis
        },
        {
          label: 'CO2 Saved (kg)',
          data: totalCO2Saved, // CO2 saved data
          backgroundColor: 'rgba(23, 23, 23, 1)',
          borderColor: 'rgba(23, 23, 23, 1)',
          borderWidth: 1,
          xAxisID: 'x1', // Associate with second axis
        },
      ],
    };
  };

  const topCO2SavedCategories = (data) => {
    // Aggregate data by category
    const categoryAggregation = data.reduce((acc, transaction) => {
      const categoryCode = transaction?.MerchantDetails?.MerchantCategoryCode;
      const co2Saved = transaction?.CO2Saved || 0;
  
      // Use category name instead of code, or default to 'others'
      const categoryName = categoryMapping[categoryCode] || 'others';
  
      // Initialize the category if not already present
      if (!acc[categoryName]) {
        acc[categoryName] = {
          totalCO2Saved: 0,
        };
      }
  
      // Accumulate CO2 saved
      acc[categoryName].totalCO2Saved += co2Saved;
  
      return acc;
    }, {});
  
    // Sort categories by total CO2 saved and take the top 5
    const sortedCategories = Object.entries(categoryAggregation)
      .sort(([, a], [, b]) => b.totalCO2Saved - a.totalCO2Saved)
      .slice(0, 5);
  
    // Extract category names and CO2 saved for the chart
    const categoryNames = sortedCategories.map(([category]) => category);
    const totalCO2Saved = sortedCategories.map(([, data]) => data.totalCO2Saved);
  
    // Return the chart data
    return {
      labels: categoryNames, // Category names for the x-axis
      datasets: [
        {
          label: 'CO2 Saved (kg)',
          data: totalCO2Saved, // CO2 saved data
          backgroundColor:  'rgba(75, 192, 192)', // Assign colors based on categories
          borderColor:  ' rgba(75, 192, 192)', // Matching border colors
          borderWidth: 1,
          xAxisID: 'x1', // Associate with first axis
        },
      ],
    };
  };
  
  return {
    yearly: {
      ...yearlyData,
      co2EmissionCo2SavedOverTime: timeCo2emitedSaved(mockData, 'year'),categoryCo2Amount:categoryCo2Amount(mockData,'amount'),categoryCo2Trans:categoryCo2Amount(mockData,'noOfTransction'),topmerchant:topMerchant(mockData),categoryEmissionsOverTime:categoryEmissionsOverTime(mockData,'year'),topCO2SavedCategories:topCO2SavedCategories(mockData)
    },
    monthly: {
      ...totalMonthlyData,
      co2EmissionCo2SavedOverTime: timeCo2emitedSaved(monthlyData, 'month'),categoryCo2Amount:categoryCo2Amount(monthlyData,'amount'),categoryCo2Trans:categoryCo2Amount(monthlyData,'noOfTransction'),topmerchant:topMerchant(monthlyData),categoryEmissionsOverTime:categoryEmissionsOverTime(monthlyData,'month'),topCO2SavedCategories:topCO2SavedCategories(monthlyData)
    },
    last30days: {
      ...totalLast30DaysData,
      co2EmissionCo2SavedOverTime: timeCo2emitedSaved(last30days, 'day'),categoryCo2Amount:categoryCo2Amount(last30days,'amount'),categoryCo2Trans:categoryCo2Amount(last30days,'noOfTransction'),topmerchant:topMerchant(last30days),categoryEmissionsOverTime:categoryEmissionsOverTime(last30days,'day'),topCO2SavedCategories:topCO2SavedCategories(last30days)
    },
  };
};

export async function GET(request) {
  let data =undefined// Fetch transactions from your database
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get('customerId')
  const groupId = searchParams.get('groupId')
  console.log(customerId,"customerId",groupId,"groupId")
    if (customerId) {
      data = randomData.filter(transaction => transaction.CustomerId === customerId);

    if (!data) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 })
    } 
    const aggregatedData = aggregateTransactions(data);
    return NextResponse.json(aggregatedData)
  } 
  if (groupId) {
    data = randomData.filter(transaction => transaction.GroupId === groupId);

  if (!data) {
    return NextResponse.json({ message: 'Customer not found' }, { status: 404 })
  } 
  const aggregatedData = aggregateTransactions(data);
  return NextResponse.json(aggregatedData)
} 
  data = randomData// Fetch transactions from your database
  // const aggregatedData = aggregateTransactions(data);

  return NextResponse.json({success:true,data})
}
