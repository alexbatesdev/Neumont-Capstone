import React from 'react'

import Head from 'next/head'

import { Typography, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react';


export function OneComponentTemplate({ children, title }) {
    const theme = useTheme();
    const session = useSession();

    const outerWrapperStyle = {
        color: theme.palette.text.primary,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative',
        overflow: 'hidden',
    }

    const backStyle = {
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
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.5rem',
        fontFamily: 'Roboto',
    }

    const spinningWebStyle = {
        position: 'absolute',
        width: '250vw',
        height: '250vh',
        zIndex: -1,
        backgroundImage: 'url(/spiderweb.svg)',
        backgroundSize: '110vw',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: theme.palette.background.default,
        animation: 'rotate 120s infinite linear',
    }

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
            <main style={outerWrapperStyle}>

                <Typography variant="h5"
                    onClick={() => { window.location.href = (session.data ? "/dashboard" : "/") }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = theme.palette.dragBar.default }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = theme.palette.background.paper }}
                    sx={backStyle}>
                    Back
                </Typography>
                <div style={spinningWebStyle}></div>
                {children}
            </main>
        </>
    )
}
