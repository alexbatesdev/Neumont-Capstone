import React from 'react'

import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierCaveDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { CodeSnippetButtonBar } from './CodeSnippetButtonBar';
import { useEditorContext } from '@/contexts/editor-context';

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

export const Message = ({ message, index }) => {
    const theme = useTheme();

    let color = "white";
    if (message.model == "gpt-4-0613") {
        color = "#8d7eff";
    } else if (message.model == "gpt-3.5-turbo-0613") {
        color = "#45b288";
    }

    const messageWrapperStyle = {
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "flex-end",
        justifyContent: message.role == "assistant" ? "flex-end" : "flex-start",
    }

    const messageBubbleStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: "8px",
        padding: "10px",
        maxWidth: "calc(100% - 50px)",
        width: "fit-content",
        color: message.role == "assistant" ? "black" : "white",
        borderRadius: "10px",
        borderBottomRightRadius: message.role == "user" ? "10px" : "0",
        borderBottomLeftRadius: message.role == "assistant" ? "10px" : "0",
        backgroundColor: message.role == "assistant" ? color : theme.palette.tertiary.main,
        alignSelf: message.role == "assistant" ? "flex-end" : "flex-start",
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.6)",
    }

    const SyntaxHighlighterStyle = {
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        overflowX: "auto",
        maxWidth: "calc(100% - 16px)",
        marginTop: "0",
    }

    return (
        <Box key={index + "GPT"} sx={messageWrapperStyle}>
            <Box key={index} sx={messageBubbleStyle}>
                {handleDisplayCodeSnippet(message.content).map((segment, index) => {
                    switch (segment.type) {
                        case 'text':
                            return (
                                <Typography key={index} variant="body1">
                                    {segment.content}
                                </Typography>
                            );
                        case 'code':
                            return (<React.Fragment key={index}>
                                <CodeSnippetButtonBar segment={segment} />
                                <SyntaxHighlighter
                                    language={segment.language}
                                    showLineNumbers
                                    customStyle={SyntaxHighlighterStyle}
                                    style={atelierCaveDark}
                                >
                                    {segment.content}
                                </SyntaxHighlighter>
                            </React.Fragment>);
                        default:
                            return null;
                    }
                })}
            </Box>
        </Box>
    )
}