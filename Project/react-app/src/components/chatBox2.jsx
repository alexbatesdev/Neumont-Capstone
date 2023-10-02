// import React from 'react';
// import { useEffect, useState, useRef } from 'react';
// import { TextField, Box, Typography } from '@mui/material';

// export const MessageComponent = () => {
//     const [messages, setMessages] = useState([]);
//     const [responseMessage, setResponseMessage] = useState('');

//     const pushMessage = (message) => {
//         setMessages((prevMessages) => [...prevMessages, { message, type: 'sent', id: Math.random() }]);
//         setResponseMessage(randomResponse());
//     }

//     const randomResponse = () => {
//         const responses = ['Hello there!', 'Good day!', 'Nice to meet you!', 'How may I help you?'];
//         return responses[Math.floor(Math.random() * responses.length)];
//     }

//     return (<>
//         <Box style={{ padding: '20px' }}>
//             <Typography variant='h4' style={{ marginBottom: '20px' }}>Chat</Typography>
//             <Box style={{ minHeight: '300px', overflowY: 'scroll', border: '1px solid purple', padding: '10px', marginBottom: '10px' }}>
//                 {messages.map((message) =>
//                     <Typography variant='body1' style={{ backgroundColor: message.type === 'sent' ? 'lightblue' : 'lightgreen', margin: '10px 0', padding: '5px', borderRadius: '10px' }}>{message.message}</Typography>
//                 )}
//                 <Typography variant='body1' style={{ backgroundColor: 'lightgreen', margin: '10px 0', padding: '5px', borderRadius: '10px' }}>{responseMessage}</Typography>
//             </Box>
//             <TextField
//                 fullWidth
//                 variant='outlined'
//                 placeholder='Type a message..'
//                 onKeyUp={(e) => {
//                     if (e.key === 'Enter' && e.target.value) {
//                         pushMessage(e.target.value);
//                         e.target.value = '';
//                     }
//                 }}
//             />
//         </Box>
//     </>);
// }

// export default MessageComponent;

