import React from "react";
import { useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";

const IndexTopBar = () => {
    const theme = useTheme();
    const session = useSession();
    const router = useRouter();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            width: 'calc(100% - 4rem)',
            height: '60px',
            position: 'absolute',
            top: 0,
        }}>
            <div>
                <style>
                    {`
          @keyframes rotate-text {
            0% { transform: rotateY(0deg); }
            25% { transform: rotateY(90deg); }
            50% { transform: rotateY(180deg); }
            75% { transform: rotateY(270deg); }
            100% { transform: rotateY(360deg); }
          }
                `}
                </style>
                <Typography variant='h2' style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    marginLeft: '1rem',

                }}>
                    Web
                    <span style={{
                        color: theme.palette.primary.main,
                    }}>
                        <span style={{
                            display: "inline-block",
                            animation: "rotate-text 8s infinite",
                            transformOrigin: "50% 50%",
                        }}>
                            bi
                        </span>
                        e
                    </span>
                </Typography>
            </div>
            <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.text.primary,
                // fontSize: '2rem',
                gap: '2rem',
            }}>
                <Typography variant='body2'
                    onClick={() => window.location.href = "#TechStack"}
                    sx={{
                        color: theme.palette.text.primary,
                        cursor: 'pointer',
                        transition: '0.2s ease-in-out',
                        "&:hover": {
                            color: theme.palette.primary.main
                        }
                    }}>
                    Tech Stack
                </Typography>

                <Typography variant='body2'
                    onClick={() => window.location.href = "#Templates"}
                    sx={{
                        color: theme.palette.text.primary,
                        cursor: 'pointer',
                        transition: '0.2s ease-in-out',
                        "&:hover": {
                            color: theme.palette.primary.main
                        }
                    }}>
                    Templates
                </Typography>

                <Typography variant='body2'
                    onClick={() => window.location.href = "/editor/326ebf85-b329-41da-ad85-a1365e719273"}
                    sx={{
                        color: theme.palette.text.primary,
                        cursor: 'pointer',
                        transition: '0.2s ease-in-out',
                        "&:hover": {
                            color: theme.palette.primary.main
                        }
                    }}>
                    Try the demo
                </Typography>
            </div>
            <div>
                <Button
                    variant='filled'
                    color='primary'
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        marginRight: '1rem',
                    }}
                    onClick={() => router.push(session.status == "authenticated" ? "/dashboard" : "/access")}>
                    {session.status == "authenticated" ? "Dashboard" : "Sign In"}
                </Button>
            </div>
        </div>
    )
}

export default IndexTopBar;