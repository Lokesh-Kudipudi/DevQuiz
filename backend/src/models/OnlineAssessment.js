const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true }
}, { _id: true });

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    topics: { type: String, required: true },
    questionCount: { type: Number, required: true },
    timeLimit: { type: Number, required: true }, // minutes
    questions: [questionSchema]
}, { _id: false });

const sectionSubmissionSchema = new mongoose.Schema({
    sectionIndex: { type: Number, required: true },
    answers: [{ type: String }], // selected option per question (null if skipped)
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    timeTaken: { type: Number, default: 0 } // seconds
}, { _id: false });

const participantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    status: {
        type: String,
        enum: ['active', 'completed', 'terminated'],
        default: 'active'
    },
    sectionSubmissions: [sectionSubmissionSchema]
}, { _id: false });

const onlineAssessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
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
    status: {
        type: String,
        enum: ['Pending', 'Open', 'Closed'],
        default: 'Open'
    },
    sections: [sectionSchema],
    participants: [participantSchema]
}, { timestamps: true });

module.exports = mongoose.model('OnlineAssessment', onlineAssessmentSchema);
