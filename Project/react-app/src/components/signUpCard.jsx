import React, { useState } from "react";

import Link from "next/link";

import { Card, Typography, Button, TextField, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useRouter } from "next/router";


export const SignUpCard = ({ }) => {
    const theme = useTheme();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignUp = () => {
        //Variables to change: 💭
        const URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL + "/register";

        if (name.length < 1) return setError("Name is required");
        if (email.length < 1) return setError("Email is required");
        if (email.indexOf("@") < 0) return setError("Email is invalid");
        if (email.indexOf(".") < 0) return setError("Email is invalid");
        // Require a password of complexity 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character 💭
        if (password.length < 1) return setError("Password is required");
        if (password.length < 8) return setError("Password must be at least 8 characters long");

        const response = fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                name,
            })
        }).then(res => res.json()).then(data => {
            console.log(data);
            if (data.redirect != null) {
                router.push(data.redirect);
            } else if (data.detail != null) {
                setError(data.detail);
            }
        })
    }

    const outerCardStyle = {
        width: "300px",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
        borderRadius: "5px",
    }

    const textFieldStyle = { width: "80%", marginBottom: "1rem" }

    return (<>
        <Box sx={outerCardStyle}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    marginBottom: "1rem"
                }}
            >
                Sign Up
            </Typography>
            {error && (<Typography variant="body1" color={"error"} sx={{ marginBottom: "1rem" }}>{error}</Typography>)}
            <TextField
                sx={textFieldStyle}
                variant="filled"
                placeholder="Name"
                size="small"
                value={name}
                onChange={handleNameChange}
            />
            <TextField
                sx={textFieldStyle}
                variant="filled"
                placeholder="Email"
                size="small"
                value={email}
                onChange={handleEmailChange}
                type="email"
            />
            <TextField
                sx={textFieldStyle}
                variant="filled"
                placeholder="Password"
                type="password"
                size="small"
                value={password}
                onChange={handlePasswordChange}
            />

            <Button
                variant="contained"
                sx={{
                    marginTop: 1,
                    width: "50%",
                    borderRadius: "5px"
                }}
                onClick={handleSignUp}
            >
                Sign Up
            </Button>
        </Box>
    </>)
}