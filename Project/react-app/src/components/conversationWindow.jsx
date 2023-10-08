import React, { useEffect, useState, useRef } from "react";
// import common tags from material ui
import { Card, Typography, Box, Button, TextField } from "@mui/material";
import Head from "next/head";
import { useTheme } from '@mui/material/styles';

// Refactor so the messageHistory state is stored in the parent component
// This component should still be the one making api calls and updating the state (with the parent component passing down the state and the function to update it as props) 💭
export const ConversationWindow = ({ messages, setMessages }) => {
    const [messageField, setMessageField] = useState("");
    // const [messages, setMessages] = useState([]);
    const messageBoxRef = useRef(null);
    const theme = useTheme();
    // Will use later while waiting for api response 💭
    const [isLoading, setIsLoading] = useState(false);
    const [modelIsGPT4, setModelIsGPT4] = useState(false); //True if GPT-4, False if GPT-3.5 Turbo

    const handleMessageFieldChange = (event) => {
        setMessageField(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    // Refactor so the messageHistory state is stored in the parent component
    // This component should still be the one making api calls and updating the state 💭
    const handleSendMessage = () => {
        const message = {
            role: "user",
            content: messageField,
            model: modelIsGPT4 ? "GPT-4" : "GPT-3.5 Turbo"
        };

        // Update messages state (should automatically cause rerender and visual update)
        setMessages((prevMessages) => {
            return [...prevMessages, message]
        });

        // Clear message field
        setMessageField("");

        // Send message to backend
        // Entirely untested and unmodified to match my needs
        // fetch("/api/chat", {
        //     method: "POST",
        //     body: JSON.stringify(message),
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // }).then((response) => {
        //     return response.json();
        // }).then((data) => {
        const message_back = {
            role: "assistant",
            content: "data.content", // Get the response from the api call 💭
            model: modelIsGPT4 ? "GPT-4" : "GPT-3.5 Turbo" // Add model to the response 💭
        };

        // Update messages state (should automatically cause rerender and visual update)
        setMessages((prevMessages) => {
            return [...prevMessages, message_back]
        });
        // });

        console.log(messages)
    };


    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    console.log(theme)
    return (<>
        <Head>
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css'></link>
        </Head>
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
        }}>
            <Box sx={{
                width: "calc(100% - 2rem)",
                borderBottom: `2px solid ${theme.palette.divider.default}`,
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
            }}>
                <Box sx={{
                    width: 56,
                    height: 56,
                    aspectRatio: "1/1",
                    display: "inline-block",
                    borderRadius: "50px",
                    marginRight: "1rem",
                    backgroundColor: "grey",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg)",
                    filter: modelIsGPT4 ? "invert(1) brightness(1.3) contrast(3) hue-rotate(275deg) brightness(1.2)" : "invert(1) brightness(1.3) contrast(1.3) hue-rotate(171deg) brightness(1.2)",
                }}> </Box>
                <Typography variant="h5" sx={{ display: "inline-block", color: theme.palette.text.primary }}>
                    GPT - Chat
                </Typography>
                <Button
                    variant="contained"
                    color={modelIsGPT4 ? "secondary" : "primary"}
                    onClick={() => { setModelIsGPT4(!modelIsGPT4) }}
                    sx={{
                        fontSize: "1.5rem",
                        marginLeft: "auto",
                        width: "150px",
                        color: "black"
                    }}>
                    {modelIsGPT4 ? "GPT-4" : "GPT-3.5"}
                </Button>
            </Box>
            <Box ref={messageBoxRef} sx={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                overflowY: "auto",
                width: "calc(100% - 2rem)",
                flexGrow: 1,
            }}>
                {messages.map((message, index) => {
                    if (message.role == "assistant") {
                        let color;
                        if (message.model == "GPT-4") {
                            color = theme.palette.secondary.main;
                        } else if (message.model == "GPT-3.5 Turbo") {
                            color = theme.palette.primary.main;
                        }
                        return (<Box key={index + "GPT"} sx={{
                            alignSelf: "flex-start",
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                        }}>
                            <Box key={index} sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                marginTop: "8px",
                                padding: "10px",
                                maxWidth: "300px",
                                width: "fit-content",
                                color: "black",
                                borderRadius: "10px",
                                borderBottomRightRadius: "0",
                                backgroundColor: color,
                                alignSelf: "flex-end"
                            }}>
                                <Typography variant="body1">
                                    {message.content}
                                </Typography>
                            </Box>
                        </Box>
                        )
                    }
                    if (message.role == "user") {
                        return (<Box key={index + "user"} sx={{
                            alignSelf: "flex-start",
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            alignItems: "flex-end",
                        }}>
                            <Box key={index} sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                marginTop: "8px",
                                padding: "10px",
                                maxWidth: "300px",
                                width: "fit-content",
                                color: "white",
                                borderRadius: "10px",
                                borderBottomLeftRadius: "0",
                                backgroundColor: theme.palette.tertiary.main,
                            }}>
                                <Typography variant="body1">
                                    {message.content}
                                </Typography>
                            </Box>
                        </Box>
                        )
                    }
                })}
            </Box>
            <Box sx={{
                width: "calc(100% - 2rem)",
                borderTop: `2px solid ${theme.palette.divider.default}`,
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
            }}>
                <TextField sx={{ flexGrow: 1 }} color="tertiary" label="Message" variant="outlined" value={messageField} onChange={handleMessageFieldChange} onKeyDown={handleKeyDown} />
                <Button variant="contained" color="tertiary" onClick={handleSendMessage} sx={{
                    fontSize: "2rem",
                    marginLeft: "1rem",
                }}>
                    <i className="fi fi-br-caret-right" style={{ height: "45px" }}></i>
                </Button>
            </Box>
        </Box >
    </>);
}