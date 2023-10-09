import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material'
import { ConversationWindow } from '@/components/conversationWindow'
import ClickCounter from '@/components/clicker'
// import MessageComponent from '@/components/chatBox'
import MyGridComponent from '@/components/devPanels'
import BMOComponent from '@/components/BMO'
import { useState } from 'react'

export default function Home() {
    let sample_snippet_2 = "Blah blah blah some natural text is cool \
    \n```javascript \
    \nimport React from 'react'; \
    \nimport { Box, Typography } from '@mui/material'; \
    \n \
    \nexport const SampleComponent = () => { \
    \n    return ( \
    \n        <Box sx={{ \
    \n            display: 'flex', \
    \n            flexDirection: 'column', \
    \n            justifyContent: 'flex-start', \
    \n            alignItems: 'flex-start', \
    \n            width: '100%', \
    \n            height: '100%', \
    \n        }}> \
    \n            <Typography variant='h1'> \
    \n                Hello World! \
    \n            </Typography> \
    \n        </Box> \
    \n    ); \
    \n} \
    \n``` \
    \nBlah blah blah some natural text is cool \
    "

    const [messageHistory, setMessageHistory] = useState([{
        role: "assistant",
        content: sample_snippet_2,
        model: "gpt-4-0613",
    }]);



    return (
        <>
            <MyGridComponent>
                {/* Remember to refactor Conversation Window to have the state kept track of up here 💭*/}
                <ConversationWindow messages={messageHistory} setMessages={setMessageHistory} />
                <BMOComponent />
                <ConversationWindow messages={messageHistory} setMessages={setMessageHistory} />
            </MyGridComponent>
        </>
    )
}
