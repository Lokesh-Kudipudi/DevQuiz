require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const Group = require("../models/Group");
const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if demo user exists
    let demoUser = await User.findOne({ email: "demo@devquiz.com" });
    if (!demoUser) {
      demoUser = await User.create({
        name: "Demo User",
        email: "demo@devquiz.com",
        password: "demopassword123",
        authProvider: "local",
        isDemo: true,
        totalScore: 150,
        googleId: "demo_google_id",
      });
      console.log("Demo user created");
    } else {
      console.log("Demo user already exists");
    }

    let otherUser = await User.findOne({ email: "other@devquiz.com" });
    if (!otherUser) {
      otherUser = await User.create({
        name: "Alice Coder",
        email: "other@devquiz.com",
        password: "password123",
        authProvider: "local",
        totalScore: 200,
        googleId: "other_google_id",
      });
      console.log("Other user created");
    }

    // Check if demo group exists
    let demoGroup = await Group.findOne({ inviteCode: "DEMO123" });
    if (!demoGroup) {
      demoGroup = await Group.create({
        name: "Demo Group",
        description: "A group for demonstration purposes",
        inviteCode: "DEMO123",
        creator: otherUser._id,
        members: [otherUser._id, demoUser._id],
      });

      // Add to users
      demoUser.joinedGroups.push(demoGroup._id);
      await demoUser.save();
      otherUser.joinedGroups.push(demoGroup._id);
      otherUser.createdGroups.push(demoGroup._id);
      await otherUser.save();

      console.log("Demo group created");
    } else {
      console.log("Demo group already exists");
    }

    // Check if demo quiz exists
    let demoQuiz = await Quiz.findOne({ title: "JavaScript Basics Demo" });
    if (!demoQuiz) {
      demoQuiz = await Quiz.create({
        title: "JavaScript Basics Demo",
        topic: "JavaScript",
        difficulty: "Easy",
        creator: otherUser._id,
        group: demoGroup._id,
        questions: [
          {
            question: "What is the typeof null in JavaScript?",
            options: ["object", "null", "undefined", "string"],
            correctAnswer: "object",
            explanation:
              'In JavaScript, typeof null is "object" due to a historical bug.',
          },
          {
            question: "Which company developed JavaScript?",
            options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
            correctAnswer: "Netscape",
            explanation:
              "JavaScript was created by Brendan Eich at Netscape in 1995.",
          },
        ],
      });

      demoGroup.quizzes.push(demoQuiz._id);
      await demoGroup.save();
      console.log("Demo quiz created");
    } else {
      console.log("Demo quiz already exists");
    }

    // Create some sample attempts (scoreboard)
    let attempt = await Attempt.findOne({
      user: demoUser._id,
      quiz: demoQuiz._id,
    });
    if (!attempt) {
      await Attempt.create({
        user: demoUser._id,
        quiz: demoQuiz._id,
        score: 1,
        answers: [
          { questionIndex: 0, selectedOption: "object", isCorrect: true },
          { questionIndex: 1, selectedOption: "Oracle", isCorrect: false },
        ],
      });
      console.log("Demo attempt created");
    }

    let otherAttempt = await Attempt.findOne({
      user: otherUser._id,
      quiz: demoQuiz._id,
    });
    if (!otherAttempt) {
      await Attempt.create({
        user: otherUser._id,
        quiz: demoQuiz._id,
        score: 2,
        answers: [
          { questionIndex: 0, selectedOption: "object", isCorrect: true },
          { questionIndex: 1, selectedOption: "Netscape", isCorrect: true },
        ],
      });
      console.log("Other attempt created");
    }

    console.log("Seeding completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
