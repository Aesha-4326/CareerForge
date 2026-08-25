const mongoose = require("mongoose");

const sectionCheckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  present: { type: Boolean, required: true }
});

const suggestionSchema = new mongoose.Schema({
  type: { type: String, enum: ["success", "warning", "info", "critical"], default: "info" },
  title: { type: String, required: true },
  desc: { type: String, required: true }
});

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeText: {
      type: String,
      required: true
    },
    targetJobDescription: {
      type: String,
      default: ""
    },
    fileName: {
      type: String,
      default: "resume.txt"
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    keywordMatchRate: {
      type: String,
      default: "80%"
    },
    foundKeywords: [{
      type: String
    }],
    missingKeywords: [{
      type: String
    }],
    actionVerbsScore: {
      type: String,
      default: "75%"
    },
    sectionChecks: [sectionCheckSchema],
    suggestions: [suggestionSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
