const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Job", "Internship"],
      default: "Job"
    },
    roleCategory: {
      type: String,
      default: "Software Engineer"
    },
    location: {
      type: String,
      required: true
    },
    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "Hybrid"
    },
    ctc: {
      type: String,
      default: null
    },
    stipend: {
      type: String,
      default: null
    },
    minCgpa: {
      type: Number,
      default: 6.0
    },
    allowedBranches: [{
      type: String
    }],
    skillsRequired: [{
      type: String
    }],
    postedDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
    },
    deadline: {
      type: String,
      required: true
    },
    applicantsCount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true
    },
    rounds: [{
      type: String
    }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Job", jobSchema);
