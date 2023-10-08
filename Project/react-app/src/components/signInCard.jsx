import React, { useState } from "react";
// import common tags from material ui
import { Avatar, Card, CardContent, CardHeader, Typography, Box, Button, TextField } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Link from "next/link";

export const SignInCard = ({ }) => {
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
        //Variables to change: 💭
        const URL = "http://localhost:5041/auth/login";

        // Resets error in the case that this is a successful second attempt after a failed first attempt
        setError(false);
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                // If the response is 200, return the json data
                if (res.status == 200) {
                    return res.json()
                } else {
                    // Otherwise, return null and set error to true
                    setError(true);
                }
            })
            .then(data => {
                if (data == null || data.detail == "User not found") {
                    // This is reduntant if the response isn't 200, but catches the case where the response is 200 but the user is not found
                    setError(true);
                } else {
                    // If the response is 200, store the token and user in local storage
                    localStorage.setItem("token", data.access_token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                return data;
            }).then(async (data) => {
                // If a secondary fetch is needed, do it here 💭
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
            backgroundColor: theme.palette.background.paper
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
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>Sign In</Typography>
            <TextField sx={{ width: "80%", marginBottom: "1rem" }} color="tertiary" placeholder="Email" size="small" value={email} onChange={handleEmailChange} />
            <TextField sx={{ width: "80%", marginBottom: "1rem" }} color="tertiary" placeholder="Password" size="small" type="password" value={password} onChange={handlePasswordChange} />

            <Button variant="contained" sx={{ marginBottom: "1rem", width: "50%" }} color="tertiary" onClick={handleSignIn}>Sign In</Button>
            {error && <Typography variant="body1" color={"error"} sx={{ marginBottom: "1rem" }}>Invalid login credentials</Typography>}
            <Button variant="contained" color="primary" size="small" href="/sign-up">Sign Up</Button>

        </Card>
    </>)
}