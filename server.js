// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to handle JSON and CORS
app.use(cors());
app.use(bodyParser.json());

// In-memory array to store scores
// For a simple example, this is fine. For a real app, you'd use a database.
let highScores = [];

// API Endpoint to submit a new score
app.post('/submit-score', (req, res) => {
    const { name, email, score } = req.body;
    
    if (name && email && typeof score === 'number') {
        highScores.push({ name, email, score });
        // Sort scores in descending order
        highScores.sort((a, b) => b.score - a.score);
        // Keep only the top 10 scores
        highScores = highScores.slice(0, 10);
        
        console.log('New score submitted:', { name, email, score });
        res.status(201).send({ message: 'Score submitted successfully!' });
    } else {
        res.status(400).send({ message: 'Invalid data.' });
    }
});

// API Endpoint to get the top scores
app.get('/high-scores', (req, res) => {
    res.status(200).send(highScores);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});