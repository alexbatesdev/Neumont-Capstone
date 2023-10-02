import React from 'react';
import { useState, useEffect } from 'react';

export const MessageComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        const responses = ['Hello!', 'Wow!', 'Interesting...', 'I see.', 'Cool story bro.', 'What a surprise.', 'Intriguing...'];
        const randomResponseIndex = Math.floor(Math.random() * responses.length);
        const newMessage = { content: input, isResponse: false };
        const newResponse = { content: responses[randomResponseIndex], isResponse: true };
        setMessages([...messages, newMessage, newResponse]);
        setInput('');
    }

    const handleChange = (event = 'event',) => {
        setInput(event.target.value);
    }

    const handleKeyPress = (event = 'event',) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    return (<>
        <div style={{ width: '60%', margin: '0 auto', backgroundColor: '#f3f3f3', padding: '1em', borderRadius: '5px', minHeight: '400px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {messages.map((message, index) => {
                    return (
                        <li key={index} style={{ backgroundColor: message.isResponse ? '#ddf' : '#ffd', padding: '1em', borderRadius: '5px', margin: '1em 0' }}>
                            {message.content}
                        </li>
                    );
                })}
            </ul>
            <input
                style={{ width: '100%', padding: '1em', boxSizing: 'border-box' }}
                value={input}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder='Type a message and press enter' />
        </div>
    </>);
}

export default MessageComponent;