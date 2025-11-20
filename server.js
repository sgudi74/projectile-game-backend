// 1. IMPORTS & SETUP
const express = require('express');
const mongoose = require('mongoose'); ⬅️ NEW!
const cors = require('cors'); // If you are using CORS
const Score = require('./Score'); ⬅️ NEW! (The model you created in Step 2)

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URL; // Gets the URL you set on Render

// Middleware
app.use(cors());
app.use(express.json());


// 2. MONGO DB CONNECTION (REPLACES YOUR OLD DB CONNECTION CODE)
mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ MongoDB successfully connected!');
    
    // START THE SERVER ONLY AFTER THE DB CONNECTION IS SUCCESSFUL
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED:', err);
    // CRITICAL: Exit the process if DB connection fails to stop the crash loop
    process.exit(1); 
  });


// 3. API ROUTES (REPLACES YOUR OLD POSTGRESQL ROUTES)

// Route to submit a new score (Frontend calls this with POST)
app.post('/submit-score', async (req, res) => {
    try {
        const { name, email, score } = req.body;
        
        // Use Mongoose to create and save the new score
        const newScore = new Score({ name, email, score });
        await newScore.save();
        
        console.log(`Score saved for ${name}`);
        res.status(201).send('Score recorded successfully.');
    } catch (error) {
        console.error('Error recording score:', error);
        res.status(500).send('Error recording score.');
    }
});

// Route to fetch high scores (Frontend calls this with GET)
app.get('/high-scores', async (req, res) => {
    try {
        // Use Mongoose to find, sort by score descending (-1), and limit to 10
        const highScores = await Score.find()
            .sort({ score: -1 }) 
            .limit(10);        
            
        res.json(highScores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json([]); // Return empty list on failure
    }
});

// Basic check route (optional)
app.get('/', (req, res) => {
    res.send('Server is running and ready for MongoDB!');
});
