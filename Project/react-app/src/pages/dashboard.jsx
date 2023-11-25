import React, { useEffect } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { Button, Typography, useTheme } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'

import ProjectList from '@/components/ProjectList'
import { useRouter } from 'next/router'
import ProfileView from '@/components/ProfileView'
import TopBar from '@/components/TopBar'

export default function Home() {
    const theme = useTheme()
    const session = useSession()
    const router = useRouter()

    const [projects, setProjects] = React.useState([])

    useEffect(() => {
        console.log(session)
        if (session.data) {
            const getProjects = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/get_dashboard/${session.data.user.account_id}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${session.data.token}`,
                        "content-type": "application/json",
                    }
                })
                if (response.status !== 200) {
                    console.log(response)
                    return
                }
                const data = await response.json()
                console.log(data)
                setProjects(data)
            }
            getProjects()
        }
        if (session.status === 'unauthenticated') {
            router.push('/')
        }
    }, [session])

    return (
        <>
            <Head>
                <title>Dashboard - 🕸</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕸️</text></svg>"></link>
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
                // backgroundColor: "#FF0000",
                color: theme.palette.text.primary,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // gap: '2rem',
                position: 'relative',
                overflow: 'hidden',
                gap: '1rem',
            }}>

                <TopBar
                    alternate
                    titleText={"Dashboard"}
                    backLocation={"/"}
                >

                </TopBar>
                <div style={{
                    position: 'absolute',
                    top: "-60%",
                    // left: "-75%",
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
                <div style={{
                    width: 'calc(100% - 2rem)',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',

                }}>
                    <ProfileView />
                    <ProjectList projects={projects} setProjects={setProjects} />
                </div>



            </main>
        </>
    )
}
