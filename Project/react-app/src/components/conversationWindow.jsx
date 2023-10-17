import React, { useEffect, useState, useRef, useContext } from "react";
// import common tags from material ui
import { Card, Typography, Box, Button, TextField } from "@mui/material";
import Head from "next/head";
import { useTheme } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
import { Message } from "./message";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { EditorContext, useEditorContext } from "@/contexts/editor-context";

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
export const ConversationWindow = () => {
    const { messageHistory, setMessageHistory } = useEditorContext();
    // const [messageHistory, setMessageHistory] = useState([
    //     {
    //         role: "assistant",
    //         content: "Hello, I'm GPT-3.5 Turbo. How can I help you today?",
    //         model: "gpt-3.5-turbo-0613"
    //     },
    //     {
    //         role: "user",
    //         content: "I want to create a peepohpoo.",
    //     }
    // ]);
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
        setMessageHistory((prevMessages) => {
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
                setMessageHistory([]);
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
        return;

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
            setMessageHistory((prevMessages) => {
                return [...prevMessages, message_back]
            });
            setIsLoading(false);
        });
    };

    const scrollToBottom = () => {
        if (messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageHistory]);

    return (<>
        {/* Might want to swap a lot of divs to Boxes for consistency 💭 */}
        <Box sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
            width: "100%",
            minWidth: "375px"
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
                    backgroundImage: "url(http://localhost:3001/proxy-image?url=https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg)",
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
                {messageHistory.map((message, index) => {
                    return (
                        <Message key={"Message-" + index} message={message} />
                    );
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
                    borderRadius: theme.shape.borderRadius,
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
                    {/* Might need to increase the size 💭 */}
                    <ArrowRightIcon />
                </Button>
            </Box>
        </Box >
    </>);
}