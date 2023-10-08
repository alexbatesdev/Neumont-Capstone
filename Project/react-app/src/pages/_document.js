import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

import { theme } from '@/components/theme'
import { ThemeProvider } from '@mui/material'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
