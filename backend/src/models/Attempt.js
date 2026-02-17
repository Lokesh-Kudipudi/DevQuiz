const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedOption: String,
        isCorrect: Boolean
    }]
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
