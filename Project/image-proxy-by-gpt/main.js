// Start of assistant generated code
const express = require('express');
const axios = require('axios');

const app = express();

// Start of assistant generated code
app.get('/proxy-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;  // Get the image URL from the query parameter

        // Validate the URL (basic validation, you might want to add more checks)
        if (!imageUrl || !imageUrl.startsWith('http')) {
            return res.status(400).send('Invalid URL');
        }

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Determine the content type (this is a basic example, you might want to improve this)
        let contentType = 'image';
        if (imageUrl.endsWith('.svg')) {
            contentType = 'image/svg+xml';
        } else if (imageUrl.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        }

        res.set('Content-Type', contentType);
        res.set('Cross-Origin-Embedder-Policy', 'require-corp');
        res.set('Cross-Origin-Opener-Policy', 'same-origin');
        // Start of my code
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        // End of my code
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch image');
    }
});
// End of assistant generated code

app.listen(3001, () => {
    console.log('Proxy server running on http://localhost:3001');
});
// End of assistant generated code