const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  phase: { type: String, required: true },
  focus: { type: String, required: true },
  topics: [{ type: String }]
});

const projectRecommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tech: { type: String, required: true },
  desc: { type: String, required: true }
});

const roadmapSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    targetGoal: {
      type: String,
      required: true
    },
    targetRole: {
      type: String,
      required: true
    },
    matchPercentage: {
      type: Number,
      default: 85
    },
    currentSkills: [{
      type: String
    }],
    missingSkills: [{
      type: String
    }],
    roadmapTimeline: [phaseSchema],
    recommendedProjects: [projectRecommendationSchema],
    dsaFocusTopics: [{
      type: String
    }],
    interviewPrepTips: [{
      type: String
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
