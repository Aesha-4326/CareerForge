const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null
    },
    studentName: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview Scheduled", "Offer Received", "Rejected"],
      default: "Applied"
    },
    currentRound: {
      type: String,
      default: "Resume Screening"
    },
    nextStepDate: {
      type: String,
      default: "Awaiting Schedule"
    },
    matchScore: {
      type: Number,
      default: 85
    },
    location: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
