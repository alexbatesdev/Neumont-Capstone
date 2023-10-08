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
    const [messageHistory, setMessageHistory] = useState([]);

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
