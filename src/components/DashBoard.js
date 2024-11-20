'use client'

import { Box, Typography, Grid } from '@mui/material'
import TransactionChart from './LineChart'
import CO2ImpactChart from './CO2ImpactChart'

export default function Dashboard({ data, title }) {
    console.log(data,"dtata in dashboard")
  return (
    <Box>
      {/* <Typography variant="h4" className="mb-4">{title}</Typography> */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TransactionChart data={data} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CO2ImpactChart data={data} />
        </Grid>
      </Grid>
    </Box>
  )
}