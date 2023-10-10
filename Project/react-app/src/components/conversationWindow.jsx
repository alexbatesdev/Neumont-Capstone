import React, { useEffect, useState, useRef } from "react";
// import common tags from material ui
import { Card, Typography, Box, Button, TextField } from "@mui/material";
import Head from "next/head";
import { useTheme } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";


const trimMessages = (messages) => {
    let newMessages = [];
    messages.forEach(message => {
        newMessages.push({
            role: message.role,
            content: message.content,
        })
    });
    return newMessages;
}

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
        if (event.key === "Enter" && !event.shiftKey) {
            handleSendMessage();
        }
    };

    // Refactor so the messageHistory state is stored in the parent component
    // This component should still be the one making api calls and updating the state 💭
    const handleSendMessage = () => {
        if (messageField.length == 0) {
            return;
        }
        const message = {
            role: "user",
            content: messageField,
            model: modelIsGPT4 ? "gpt-4-0613" : "gpt-3.5-turbo-0613"
        };

        // We store the new message state in a variable so we can immediately use the new state
        // Even though the new state is not yet set (setMessages is async)
        let newMessages;
        // Update messages state (should automatically cause rerender and visual update)
        setMessages((prevMessages) => {
            newMessages = [...prevMessages, message];
            return [...prevMessages, message]
        });

        // Clear message field
        setMessageField("");

        let function_call = "auto"

        // Check if message is a command
        if (messageField[0] == "/") {
            const command = messageField.split(" ")[0].substring(1).toLowerCase();
            const command_args = messageField.split(" ").slice(1);
            const command_prompt = messageField.slice(1);
            if (command == "clear") {
                setMessages([]);
                return;
            } else if (command == "preimport") {
                if (command_args.length == 0) {
                    return;
                } else if (command_args[0] == "add") {
                    // Set a contextual state variable to include the preimport code
                    console.log("adding: " + command_args.slice(1).join(" "));
                } else if (command_args[0] == "remove") {
                    // Set a contextual state variable to remove the preimport code
                    console.log("removing: " + command_args.slice(1).join(" "));
                } else if (command_args[0] == "clear") {
                    // Set a contextual state variable to clear the preimport code
                    console.log("clearing");
                } else if (command_args[0] == "list") {
                    // Return a list of the preimport code entries
                    console.log("listing");
                }
                return;
            } else if (command == "refactor") {
                // Refactor a component
                // I don't know how I want to do this yet
                // I could have the user input their code
                // But I think it should probably be a filename
                // And then the backend can read the file and give it to the model
                return;
            } else if (command == "create") {
                message.content = command_prompt;
                function_call = "generate_component_code";
            }
        }

        const body = {
            messages: trimMessages(newMessages),
            preImportCode: [],
            componentToRefactor: "",
            nodePackages: [],
            model: modelIsGPT4 ? "gpt-4-0613" : "gpt-3.5-turbo-0613",
            function: function_call,
        }
        console.log(body);
        console.log(JSON.stringify(body));
        setIsLoading(true);
        // Needs a try catch block just in case 💭
        // Send message to backend
        const URL = "http://localhost:8000/prompt"
        fetch(URL, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            let content = data.agentResponse;

            const message_back = {
                role: "assistant",
                content: content,
                model: data.agentModel,
            };

            // Update messages state (should automatically cause rerender and visual update)
            setMessages((prevMessages) => {
                return [...prevMessages, message_back]
            });
            setIsLoading(false);
        });
    };

    const handleDisplayCodeSnippet = (message) => {
        const segments = [];
        const regex = /```(?:([\w-]+)\s+)?([\s\S]*?)```/g; // Modified regex to optionally capture language specification
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(message)) !== null) {

            // Add plain text leading up to the code snippet
            if (match.index > lastIndex) {
                segments.push({ type: 'text', content: message.slice(lastIndex, match.index) });
            }
            // Determine language (if specified, otherwise default to 'javascript')
            const language = match[1] || 'javascript'; // Use captured language specification or default to 'javascript'
            // Add code snippet
            segments.push({ type: 'code', content: match[2], language }); // Include language in segment
            lastIndex = regex.lastIndex;
        }

        // Add remaining plain text after the last code snippet
        if (lastIndex < message.length) {
            segments.push({ type: 'text', content: message.slice(lastIndex) });
        }

        return segments;
    }

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
                overflowX: "hidden",
                width: "calc(100% - 2rem)",
                flexGrow: 1,
            }}>
                {messages.map((message, index) => {
                    if (message.role == "assistant") {
                        let color;
                        if (message.model == "gpt-4-0613") {
                            color = theme.palette.secondary.main;
                        } else if (message.model == "gpt-3.5-turbo-0613") {
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
                                maxWidth: "calc(100% - 50px)",
                                width: "fit-content",
                                color: "black",
                                borderRadius: "10px",
                                borderBottomRightRadius: "0",
                                backgroundColor: color,
                                alignSelf: "flex-end"
                            }}>
                                {handleDisplayCodeSnippet(message.content).map((segment, index) => {
                                    switch (segment.type) {
                                        case 'text':
                                            return (
                                                <Typography key={index} variant="body1">
                                                    {segment.content}
                                                </Typography>
                                            );
                                        case 'code':
                                            return (<>
                                                <Button
                                                    variant="contained"
                                                    color="tertiary"
                                                    size="small"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(segment.content);
                                                    }}
                                                    sx={{
                                                        fontSize: "1rem",
                                                        marginBottom: "1rem",
                                                        marginTop: "1rem",
                                                        width: "fit-content",
                                                        alignSelf: "flex-end",
                                                        marginBottom: "0",
                                                    }}>
                                                    Copy
                                                </Button>
                                                <SyntaxHighlighter
                                                    key={index}
                                                    language={segment.language}
                                                    showLineNumbers
                                                    customStyle={{
                                                        borderRadius: "10px",
                                                        overflowX: "auto",
                                                        maxWidth: "calc(100% - 10px)",
                                                    }}
                                                    style={atelierCaveDark}
                                                >
                                                    {segment.content}
                                                </SyntaxHighlighter>
                                            </>);
                                        default:
                                            return null;
                                    }
                                })}
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
                                maxWidth: "calc(100% - 50px)",
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
                {isLoading && <Box sx={{
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
                    backgroundColor: modelIsGPT4 ? theme.palette.secondary.main : theme.palette.primary.main,
                    alignSelf: "flex-end"
                }}><CircularProgress color="common" /></Box>
                }
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
                <TextField sx={{ flexGrow: 1 }} multiline color="tertiary" label="Message" variant="outlined" value={messageField} onChange={handleMessageFieldChange} onKeyDown={handleKeyDown} />
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