import React, { useState } from "react";
// import common tags from material ui
import { Avatar, Card, CardContent, CardHeader, Typography, Box, Button, TextField, useTheme } from "@mui/material";
import Link from "next/link";


export const SignUpCard = ({ }) => {
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const theme = useTheme();

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleAgeChange = (e) => {
        if (isNaN(e.target.value)) return;
        setAge(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignUp = () => {
        //Variables to change: 💭
        const URL = "http://localhost:5041/auth/register";

        if (name.length < 1) return setError("Name is required");
        if (email.length < 1) return setError("Email is required");
        if (email.indexOf("@") < 0) return setError("Email is invalid");
        if (email.indexOf(".") < 0) return setError("Email is invalid");
        // Require a password of complexity 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character 💭
        if (password.length < 1) return setError("Password is required");



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
            if (data.user != null) {
                window.location.href = "/sign-in";
            } else if (data.detail != null) {
                setError(data.detail);
            }
        })
    }

    return (<>
        <Card sx={{
            width: "300px",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
            backgroundColor: theme.palette.background.paper,
            textAlign: "center"
        }}>
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
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>Sign Up</Typography>
            {error && (<Typography variant="body1" color={"error"} sx={{ marginBottom: "1rem" }}>{error}</Typography>)}
            <TextField sx={{ width: "80%", marginBottom: "1rem" }} placeholder="Name" size="small" value={name} onChange={handleNameChange} />
            <TextField sx={{ width: "80%", marginBottom: "1rem" }} placeholder="Email" size="small" value={email} onChange={handleEmailChange} type="email" />
            <TextField sx={{ width: "80%", marginBottom: "1rem" }} placeholder="Password" type="password" size="small" value={password} onChange={handlePasswordChange} />

            <Button variant="contained" sx={{ marginTop: 1, width: "50%" }} onClick={handleSignUp}>Sign Up</Button>
            <Button variant="contained" color="tertiary" size="small" sx={{ marginTop: 1 }} href="/sign-in">Sign In</Button>
        </Card>
    </>)
}