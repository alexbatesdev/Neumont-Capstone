import React, { useEffect, useState, useRef } from "react";
// import common tags from material ui
import { Card, Typography, Box, Button, TextField } from "@mui/material";
import Head from "next/head";

export const ConversationWindow = () => {
    const [messageField, setMessageField] = useState("");
    const [messages, setMessages] = useState([]);
    const messageBoxRef = useRef(null);


    const handleMessageFieldChange = (event) => {
        setMessageField(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        const message = {
            role: "user",
            content: messageField
        };

        // Update messages state (should automatically cause rerender and visual update)
        setMessages((prevMessages) => {
            return [...prevMessages, message]
        });

        // Clear message field
        setMessageField("");

        // Send message to backend
        // Entirely untested and unmodified to match my needs
        // This is from copilot, it likely needs to be modified to match the backend 😎
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
            content: "data.content"
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


    return (<>
        <Head>
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css'></link>
        </Head>
        <Box sx={{
            maxWidth: "500px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            zIndex: 1,
            backgroundColor: "white",
        }}>
            <Box sx={{
                width: "calc(100% - 2rem)",
                borderBottom: "2px solid #ebebeb",
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
            }}>
                <Box sx={{
                    width: 56,
                    height: 56,
                    display: "inline-block",
                    borderRadius: "50%",
                    marginRight: "1rem",
                    backgroundColor: "grey",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg)"
                }}> </Box>
                <Typography variant="h4" sx={{ display: "inline-block" }}>
                    ChatGPT 4 - Chat
                </Typography>
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
                                backgroundColor: "#10a37f",
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
                                backgroundColor: "#065fb2"
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
                borderTop: "2px solid #ebebeb",
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
            }}>
                <TextField sx={{ flexGrow: 1 }} label="Message" variant="outlined" value={messageField} onChange={handleMessageFieldChange} onKeyDown={handleKeyDown} />
                <Button variant="contained" onClick={handleSendMessage} sx={{
                    fontSize: "2rem",
                    marginLeft: "1rem",
                }}>
                    <i className="fi fi-br-caret-right" style={{ height: "45px" }}></i>
                </Button>
            </Box>
        </Box >
    </>);
}