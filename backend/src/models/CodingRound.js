const mongoose = require("mongoose");

const codingRoundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Piston", "External"],
      default: "Piston",
    },
    status: {
      type: String,
      enum: ["Pending", "Live", "Completed"],
      default: "Pending",
    },
    timeLimit: {
      type: Number,
      default: 60,
    },
    startTime: Date,
    endTime: Date,
    allowSelfAttempt: {
      type: Boolean,
      default: false,
    },
    externalQuestionConfig: {
      targetQuestionCount: { type: Number, min: 1 },
      difficulties: [
        {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
        },
      ],
      topics: [{ type: String }],
    },
    questions: [
      {
        title: { type: String, required: true },
        description: { type: String }, // Optional for External
        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          required: true,
        },
        topic: { type: String }, // Optional for External if just URL
        // Piston specific
        starterCode: { type: String },
        language: {
          type: String,
          default: "javascript",
        },
        testCases: [
          {
            input: String,
            expectedOutput: String,
            isHidden: { type: Boolean, default: false },
          },
        ],
        // External specific
        platform: { type: String }, // LeetCode, CodeChef, HackerRank
        url: { type: String },
        points: { type: Number, min: 1, max: 5 },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        startTime: Date, // For Piston rounds (individual start)
        submitTime: Date,
        score: { type: Number, default: 0 },
        // Track status of each question for the user
        questionStatus: [
          {
            questionId: mongoose.Schema.Types.ObjectId,
            status: {
              type: String,
              enum: ["Pending", "Solving", "Passed", "Failed"],
              default: "Pending",
            },
            code: String, // Last submitted code (Piston)
            startTime: Date, // For External (when they clicked Start) - Original Start Time
            endTime: Date, // For External (when they clicked Done)
            timeTaken: Number, // in seconds - Final calculated time
            accumulatedTime: { type: Number, default: 0 }, // Time spent in previous sessions (seconds)
            lastStartTime: Date, // Start time of current active session
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "CodingRound",
  codingRoundSchema,
);
