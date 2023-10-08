import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { SignInCard } from '@/components/signInCard'

export default function SignIn() {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>Sign In</title>
                <meta name="description" content="Sign In Page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <style>
                {`
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
            </style>
            <main style={{
                // backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    // top: "50%",
                    // left: "50%",
                    // transform: "translate(-50%, -50%)",
                    width: '250vw',
                    height: '250vh',
                    zIndex: -1,
                    backgroundImage: 'url(/spiderweb.svg)',
                    backgroundSize: '110vw',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: theme.palette.background.default,
                    animation: 'rotate 120s infinite linear',
                }}></div>
                <SignInCard />
            </main>
        </>
    )
}
