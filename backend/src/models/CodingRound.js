const mongoose = require('mongoose');

const codingRoundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeLimit: {
        type: Number, // in minutes
        default: 60
    },
    questions: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true
        },
        topic: { type: String, required: true }, // e.g., "Arrays", "DP"
        starterCode: { type: String, required: true },
        language: { 
            type: String, 
            default: 'javascript' 
        },
        testCases: [{
            input: String,
            expectedOutput: String,
            isHidden: { type: Boolean, default: false }
        }]
    }],
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        startTime: Date,
        submitTime: Date,
        score: { type: Number, default: 0 },
        // Track status of each question for the user
        questionStatus: [{
            questionId: mongoose.Schema.Types.ObjectId, // implicitly the _id of the question subdoc
            status: { 
                type: String, 
                enum: ['Pending', 'Passed', 'Failed'], 
                default: 'Pending' 
            },
            code: String // Last submitted code
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('CodingRound', codingRoundSchema);
