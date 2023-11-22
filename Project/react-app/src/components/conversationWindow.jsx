import React, { useEffect, useState, useRef } from "react";

import { Typography, Box, Button, TextField } from "@mui/material";
import { useTheme, createTheme } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { useMessageHistory } from "@/contexts/editor-context";
import { Message } from "./Message";
import { ThemeProvider } from "@emotion/react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

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

const modifyThemeColors = (theme, newPrimaryColor, newSecondaryColor) => {
    //console.log(theme);
    const newTheme = createTheme({
        palette: {
            ...theme.palette,
            primary: {
                ...theme.palette.primary,
                main: newPrimaryColor,
            },
            secondary: {
                ...theme.palette.secondary,
                main: newSecondaryColor,
            },
        },
    });
    return newTheme;
};


export const ConversationWindow = () => {
    const { messageHistory, setMessageHistory, conversationThreadID, setConversationThreadID } = useMessageHistory();
    const [messageField, setMessageField] = useState("");
    const messageBoxRef = useRef(null);
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [modelIsGPT4, setModelIsGPT4] = useState(false); //True if GPT-4, False if GPT-3.5 Turbo
    const session = useSession();

    const handleMessageFieldChange = (event) => {
        setMessageField(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (messageField.length == 0) {
            return;
        }

        const newMessage = {
            role: "user",
            content: messageField
        }

        const newMessageWithModel = {
            ...newMessage,
            model: modelIsGPT4 ? "gpt-4-1106-preview" : "gpt-3.5-turbo-1106"
        }

        // We store the new message state in a variable so we can immediately use the new state
        // Even though the new state is not yet set (setMessages is async)
        let newMessages;
        // Update messages state (should automatically cause rerender and visual update)
        setMessageHistory((prevMessages) => {
            newMessages = [...prevMessages, newMessageWithModel];
            return [...prevMessages, newMessageWithModel]
        });

        // Clear message field
        setMessageField("");

        let function_call = "auto"

        // Check if message is a command
        if (messageField[0] == "/") {
            const command = messageField.split(" ")[0].substring(1).toLowerCase();
            const command_args = messageField.split(" ").slice(1);
            const command_prompt = messageField.slice(1);
            if (command == "refactor") {
                // Refactor a component 💭
                // I don't know how I want to do this yet
                // I could have the user input their code
                // But I think it should probably be a filename
                // And then the backend can read the file and give it to the model
                return;
            }
        }

        // This method is absolutely horrendous
        // In another life I would figure out a solution possibly using enums
        // Anything to avoid editing strings all over the program
        const model = modelIsGPT4 ? "gpt-4-1106-preview" : "gpt-3.5-turbo-1106"


        const body = {
            message: newMessage,
            componentToRefactor: "",
            dependencies: [],
            model: model,
            function: function_call,
            api_key: session.data == "authenticated" ? session.data.user.openai_api_key : JSON.stringify("")
        }
        //console.log(body);
        //console.log(JSON.stringify(body));
        setIsLoading(true);

        // Send message to backend
        const URL = "http://localhost:8000/prompt/" + conversationThreadID
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
            let content = data.data[0].content[0].text.value;

            const message_back = {
                role: "assistant",
                content: content,
                model: model,
            };

            // Update messages state (should automatically cause rerender and visual update)
            setMessageHistory((prevMessages) => {
                return [...prevMessages, message_back]
            });
            setIsLoading(false);
        }).catch((error) => {

            console.log(error);

            const message_back = {
                role: "assistant",
                content: "An error occured, please try again.",
                model: model,
            };

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

    const wrapperStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        minWidth: "375px",
        position: "absolute",
        top: "0px",
        left: "0px",
        bottom: "0px",
        right: "0px",
    }

    const topBannerStyle = {
        width: "calc(100% - 2rem)",
        borderBottom: `2px solid ${theme.palette.dragBar.default}`,
        padding: "1rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    }

    const iconStyle = {
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
    }

    const modelToggleStyle = {
        fontSize: "1.5rem",
        marginLeft: "auto",
        width: "150px",
        color: "black",
        borderRadius: "10px",
        backgroundColor: modelIsGPT4 ? "#8d7eff" : "#45b288",
        "&:hover": {
            backgroundColor: modelIsGPT4 ? "#6556d3" : "#328d69",
        },
    }

    const messageBoxStyle = {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        overflowY: "auto",
        overflowX: "hidden",
        width: "calc(100% - 2rem)",
        flexGrow: 1,
    }

    const loadingMessageStyle = {
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
        borderBottomLeftRadius: "0",
        backgroundColor: modelIsGPT4 ? "#8d7eff" : "#45b288",
        alignSelf: "flex-start"
    }

    const bottomBarStyle = {
        width: "calc(100% - 2rem)",
        borderTop: `2px solid ${theme.palette.dragBar.default}`,
        padding: "1rem",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    }

    const submitButtonStyle = {
        marginLeft: "1rem",
        borderRadius: "10px",
        height: "calc(100%)",
        width: "50px"
    }

    return (<>
        <Box sx={wrapperStyle}>
            <Box sx={topBannerStyle}>
                <Box sx={iconStyle}> </Box>
                <Typography variant="h5"
                    sx={{
                        display: "inline-block",
                        color: theme.palette.text.primary
                    }}
                >
                    GPT - Chat
                </Typography>
                <ThemeProvider theme={() => modifyThemeColors(theme, "#45b288", "#8d7eff")} >
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (session.status == "authenticated" && session.data.user.openai_api_key != null) {
                                setModelIsGPT4(!modelIsGPT4)
                            } else {
                                toast.info("Add an OpenAI API key in your profile to use GPT-4")
                            }
                        }}
                        sx={modelToggleStyle}>
                        {modelIsGPT4 ? "GPT-4" : "GPT-3.5"}
                    </Button>
                </ThemeProvider>
            </Box>
            <Box ref={messageBoxRef} sx={messageBoxStyle}>
                {messageHistory.map((message, index) => {
                    return (
                        <Message key={"Message-" + index} message={message} />
                    );
                })}
                {isLoading && <Box sx={loadingMessageStyle}><CircularProgress color="common" /></Box>
                }
            </Box>
            <Box sx={bottomBarStyle}>
                <TextField
                    sx={{ flexGrow: 1 }}
                    multiline
                    color="tertiary"
                    label="Message"
                    variant="outlined"
                    value={messageField}
                    onChange={handleMessageFieldChange}
                    onKeyDown={handleKeyDown}
                    disabled={conversationThreadID == null}
                />
                <Button
                    variant="contained"
                    color="tertiary"
                    onClick={handleSendMessage}
                    sx={submitButtonStyle}
                    disabled={messageField.length == 0 || conversationThreadID == null}
                >
                    <ArrowRightIcon fontSize="large" />
                </Button>
            </Box>
        </Box >
    </>);
}