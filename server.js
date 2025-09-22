// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Middleware to handle JSON and CORS
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection Code ---
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database!'))
    .catch(err => console.error('Connection error', err.stack));

// Function to create the scores table if it doesn't exist
async function createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS scores (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            score INT NOT NULL
        );
    `;
    try {
        await client.query(query);
        console.log('Scores table created or already exists.');
    } catch (err) {
        console.error('Error creating scores table:', err.stack);
    }
}

createTable();

// --- API Endpoints ---
app.post('/submit-score', async (req, res) => {
    const { name, email, score } = req.body;
    
    if (name && email && typeof score === 'number') {
        try {
            const query = 'INSERT INTO scores (name, email, score) VALUES ($1, $2, $3) RETURNING *';
            const values = [name, email, score];
            const result = await client.query(query, values);
            console.log('New score inserted into database:', result.rows[0]);
            res.status(201).send({ message: 'Score submitted successfully!' });
        } catch (err) {
            console.error('Error inserting score:', err.stack);
            res.status(500).send({ message: 'Failed to submit score to database.' });
        }
    } else {
        res.status(400).send({ message: 'Invalid data.' });
    }
});

app.get('/high-scores', async (req, res) => {
    try {
        const query = 'SELECT name, email, score FROM scores ORDER BY score DESC LIMIT 100';
        const result = await client.query(query);
        res.status(200).send(result.rows);
    } catch (err) {
        console.error('Error fetching scores:', err.stack);
        res.status(500).send({ message: 'Failed to fetch scores.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});