import React from 'react'
import "@/reset.css"
import { ThemeProvider } from '@mui/material'
import { theme } from '@/components/themes'

export default function App({ Component, pageProps }) {
  return (<>
    <ThemeProvider theme={theme}>
      {/* Every page gets rendered as this Component */}
      <Component {...pageProps} />
    </ThemeProvider>
  </>)
}
