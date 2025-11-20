
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const Score = require('./Score'); 
const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DATABASE_URL; 
app.use(cors());
app.use(express.json());
mongoose.connect(DB_URI)
  .then(() => {
    console.log('✅ MongoDB successfully connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection FAILED:', err);
    // CRITICAL: Exit the process if DB connection fails to stop the crash loop
    process.exit(1); 
  });
app.post('/submit-score', async (req, res) => {
    try {
        const { name, email, score } = req.body;
        const newScore = new Score({ name, email, score });
        await newScore.save();
        console.log(`Score saved for ${name}`);
        res.status(201).send('Score recorded successfully.');
    } catch (error) {
        console.error('Error recording score:', error);
        res.status(500).send('Error recording score.');
    }
});
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
app.get('/', (req, res) => {
    res.send('Server is running and ready for MongoDB!');
});
