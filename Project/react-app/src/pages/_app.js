import React from 'react'
import "@/reset.css"
import { ThemeProvider } from '@mui/material'
import { theme } from '@/thatOneStuffFolderUsuallyCalledUtils/themes'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (<>
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        {/* Every page gets rendered as this Component */}
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  </>)
}
