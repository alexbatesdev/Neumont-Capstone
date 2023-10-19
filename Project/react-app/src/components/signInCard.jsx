import React, { useState } from "react";

import Link from "next/link";

import { Card, Typography, Button, TextField } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { signIn, useSession } from "next-auth/react";


export const SignInCard = ({ }) => {
    const session = useSession();

    if (session.data) {
        window.location.href = "/dashboard";
    }


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const theme = useTheme();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignIn = async () => {
        const signInResponse = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });
    }

    const handleOAuthSignIn = async () => {
        const signInResponse = await signIn("google");
    }

    const outerCardStyle = {
        width: "300px",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "5px",
    }

    const textFieldStyle = { width: "80%", marginBottom: "1rem" }

    return (<>
        <Card sx={outerCardStyle}>
            <Link href="/" style={{
                textDecoration: "none",
                color: theme.palette.text.primary
            }}>
                <Typography variant="h4" sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    cursor: "pointer",
                }}>Webbie</Typography>
            </Link>
            <Typography variant="h5"
                sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem"
                }}
            >
                Sign In
            </Typography>
            <TextField
                sx={textFieldStyle}
                color="tertiary"
                placeholder="Email"
                size="small"
                value={email}
                onChange={handleEmailChange}
            />
            <TextField
                sx={textFieldStyle}
                color="tertiary"
                placeholder="Password"
                size="small"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />

            <Button
                variant="contained"
                sx={{
                    marginBottom: "1rem",
                    width: "50%",
                    borderRadius: "5px"
                }}
                color="tertiary"
                onClick={handleSignIn}
            >
                Sign In
            </Button>
            <Button
                variant="contained"
                sx={{
                    marginBottom: "1rem",
                    width: "50%",
                    borderRadius: "5px"
                }}
                color="tertiary"
                onClick={handleOAuthSignIn}
            >
                Sign In with Google
            </Button>
            {error && <Typography variant="body1" color={"error"} sx={{ marginBottom: "1rem" }}>Invalid login credentials</Typography>}
            <Button
                variant="contained"
                color="primary"
                size="small"
                href="/sign-up"
                sx={{
                    borderRadius: "5px"
                }}
            >
                Sign Up
            </Button>

        </Card>
    </>)
}