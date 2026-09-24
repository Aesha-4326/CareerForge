const mongoose = require("mongoose");

const dsaSubmissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problemId: {
      type: String,
      required: true
    },
    problemTitle: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy"
    },
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    timeComplexity: {
      type: String,
      default: "Not specified"
    },
    spaceComplexity: {
      type: String,
      default: "Not specified"
    },
    status: {
      type: String,
      enum: ["Submitted", "Passed", "Failed"],
      required: true
    },
    testsPassed: {
      type: Number,
      default: 0
    },
    totalTests: {
      type: Number,
      default: 3
    },
    executionTimeMs: {
      type: Number,
      default: 15
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("DsaSubmission", dsaSubmissionSchema);
