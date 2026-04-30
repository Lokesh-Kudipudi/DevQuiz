const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// ─── Helper: create & set JWT cookie ───
const issueTokenCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// ─── Google OAuth ───

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    issueTokenCookie(res, req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  },
);

// ─── Email / Password ───

// @desc    Register with email & password
// @route   POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.authProvider === "google") {
        return res.status(400).json({
          message:
            "This email is registered with Google. Please use Google sign-in.",
        });
      }
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
    });

    issueTokenCookie(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      avatar: user.avatar,
      joinedGroups: user.joinedGroups,
      createdGroups: user.createdGroups,
      totalScore: user.totalScore,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Login with email & password
// @route   POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if Google-only account
    if (user.authProvider === "google") {
      return res.status(400).json({
        message:
          "This email is registered with Google. Please use Google sign-in.",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    issueTokenCookie(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      avatar: user.avatar,
      joinedGroups: user.joinedGroups,
      createdGroups: user.createdGroups,
      totalScore: user.totalScore,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Login as demo user
// @route   POST /auth/demo-login
router.post("/demo-login", async (req, res) => {
  try {
    const user = await User.findOne({ email: "demo@devquiz.com" });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Demo user not found. Please run the seed script." });
    }

    issueTokenCookie(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      avatar: user.avatar,
      joinedGroups: user.joinedGroups,
      createdGroups: user.createdGroups,
      totalScore: user.totalScore,
      isDemo: user.isDemo,
    });
  } catch (err) {
    console.error("Demo login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Common ───

// @desc    Logout user
// @route   GET /auth/logout
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
});

// @desc    Get current user
// @route   GET /auth/me
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
