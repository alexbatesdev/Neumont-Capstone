import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Typography, useTheme } from '@mui/material'
import Link from 'next/link'
import { SignInCard } from '@/components/signInCard'

export function OneComponentTemplate({ children, title }) {
    const theme = useTheme();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={title + " Page"} />
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

                <Typography variant="h5"
                    onClick={() => { window.history.back() }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = theme.palette.divider.secondary }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = theme.palette.background.paper }}
                    sx={{
                        fontWeight: "bold",
                        position: 'absolute',
                        left: "50px",
                        top: "25px",
                        width: '100px',
                        height: '50px',
                        padding: '10px',
                        backgroundColor: theme.palette.background.paper,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: theme.shape.borderRadius,
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        fontFamily: 'Roboto',
                    }}>
                    Back
                </Typography>
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
                {children}
            </main>
        </>
    )
}
