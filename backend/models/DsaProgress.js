const mongoose = require("mongoose");

const dsaProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    solvedProblemIds: [{
      type: String
    }],
    totalSolved: {
      type: Number,
      default: 0
    },
    easySolved: {
      type: Number,
      default: 0
    },
    mediumSolved: {
      type: Number,
      default: 0
    },
    hardSolved: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 1
    },
    lastSubmittedDate: {
      type: Date,
      default: Date.now
    },
    totalPoints: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DsaProgress", dsaProgressSchema);
