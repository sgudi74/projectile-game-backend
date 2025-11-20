// server.js - Updated for MongoDB/Mongoose

// 1. IMPORTS & SETUP
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
// 🚨 IMPORTANT: This assumes you have created the Score.js file 
//    in the same directory as server.js.
const Score = require('./Score'); 

const app = express();
const PORT = process.env.PORT || 3000;
// Fetches the MongoDB connection string from Render's environment variables
const DB_URI = process.env.DATABASE_URL; 

// Middleware
app.use(cors());
app.use(express.json());

// 2. MONGO DB CONNECTION
if (!DB_URI) {
    console.error("FATAL ERROR: DATABASE_URL not set in environment variables.");
    process.exit(1); 
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ MongoDB successfully connected!');
    
    // START THE SERVER only AFTER the database connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    // This will log the specific MongoDB connection error
    console.error('❌ MongoDB connection FAILED:', err);
    // Exit the process to signal a critical failure
    process.exit(1); 
  });


// 3. API ROUTES

// Route to submit a new score (POST)
app.post('/submit-score', async (req, res) => {
    try {
        const { name, email, score } = req.body;
        
        // Use Mongoose to create a new document
        const newScore = new Score({ name, email, score });
        await newScore.save();
        
        console.log(`Score saved for ${name}`);
        res.status(201).send('Score recorded successfully.');
    } catch (error) {
        console.error('Error recording score:', error);
        // Send a 500 (Internal Server Error) response
        res.status(500).send('Error recording score.');
    }
});

// Route to fetch high scores (GET)
app.get('/high-scores', async (req, res) => {
    try {
        // Find documents, sort by 'score' descending (-1), and limit to 10 results
        const highScores = await Score.find()
            .sort({ score: -1 }) 
            .limit(10);        
            
        res.json(highScores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        // Return an empty list on failure so the frontend doesn't crash
        res.status(500).json([]); 
    }
});

// Basic check route
app.get('/', (req, res) => {
    res.send('Projectile Game Backend is running. Status: ' + (mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'DB Disconnected'));
});
