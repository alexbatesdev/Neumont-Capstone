import React, { useEffect } from 'react'
import "@/reset.css"
import { ThemeProvider } from '@mui/material'
import { theme } from '@/thatOneStuffFolderUsuallyCalledUtils/themes'
import { SessionProvider } from 'next-auth/react'
import { AutoSignOutContextProvider } from '@/contexts/auto-sign-out-context'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (<>
    <SessionProvider session={session}>
      <AutoSignOutContextProvider>
        <ThemeProvider theme={theme}>
          {/* Every page gets rendered as this Component */}
          <Component {...pageProps} />
        </ThemeProvider>
      </AutoSignOutContextProvider>
    </SessionProvider>
  </>)
}
