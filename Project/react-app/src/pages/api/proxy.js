// Start of code written by an AI assistant
import axios from 'axios';

export default async function handler(req, res) {
    //Me modification
    const url = req.query.url;

    try {
        const response = await axios({
            method: req.method,
            // Me modification
            url: url,
            data: req.body,
            headers: req.headers,
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in proxy endpoint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// End of code written by an AI assistant