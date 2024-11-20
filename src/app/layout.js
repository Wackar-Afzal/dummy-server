import { Inter } from 'next/font/google'
import theme from '../lib/Theme'
import Navigation from '../components/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Banking Dashboard',
  description: 'Analytics for banking transactions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Navigation />
          <main className="container mx-auto p-4">
            {children}
          </main>
      </body>
    </html>
  )
}
