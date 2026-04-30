const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs without googleId (email/password users)
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String, // only for email/password users
    },
    authProvider: {
      type: String,
      enum: ["google", "local"],
      default: "local",
    },
    avatar: {
      type: String,
    },
    joinedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    createdGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving (only if it was modified)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
