// Start of code written by an AI assistant
import axios from 'axios';

export default async function handler(req, res) {
    //Me modification
    let url = req.query.url;

    // If the last character of the url is a slash, remove it
    if (url.charAt(url.length - 1) === '/') {
        url = url.slice(0, -1);
    }

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
        res.status(500).json({
            message: 'Internal Server Error',
            url: url,
            error: error.message,
            errorStack: error.stack,
            errorObject: error,
        });
    }
}

// End of code written by an AI assistant