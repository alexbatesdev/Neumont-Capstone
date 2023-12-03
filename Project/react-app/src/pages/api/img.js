// Start of code written by an AI assistant

import axios from 'axios';

export default async function handler(req, res) {
    const url = req.query.url;

    // Validate the URL
    if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({ message: "Invalid URL" });
    }

    try {
        const response = await axios({
            method: 'GET', // Assuming image requests are GET requests
            url: url,
            responseType: 'stream'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        console.error('Error in image proxy endpoint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// End of code written by an AI assistant
