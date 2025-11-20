// Score.js - Defines what a single high score looks like

const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    score: { 
        type: Number, 
        required: true 
    }
});

// The model creates a collection named 'scores' in your database
const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
