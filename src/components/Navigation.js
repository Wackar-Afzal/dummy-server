'use client'

import Link from 'next/link'
import {  Toolbar, Typography, Button } from '@mui/material'
import forilogo from "../assets/fori_logo.png"
import Image from 'next/image'; 

export default function Navigation() {
  return (
    <div position="static" className="mb-4 shadow-lg">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {/* <div className='flex justify-between p-4 pb-0 '> */}
      <Image src={forilogo} alt="Fori Logo" width={120} height={120} />
    {/* </div> */}
        </Typography>
        <Link href="/" passHref>
          <Button color="inherit">All Customers</Button>
        </Link>
        <Link href="/group/1" passHref>
          <Button color="inherit">Group 1</Button>
        </Link>
        <Link href="/Customer/1" passHref>
          <Button color="inherit">Customer 1</Button>
        </Link>
      </Toolbar>
    </div>
  )
}