const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
    },
    industry: {
      type: String,
      default: "Technology Solutions"
    },
    driveTitle: {
      type: String,
      required: true
    },
    jobRole: {
      type: String,
      default: "Software Development Engineer"
    },
    ctc: {
      type: String,
      default: "12 LPA"
    },
    minCgpa: {
      type: Number,
      default: 7.5
    },
    allowedBranches: [{
      type: String
    }],
    driveDate: {
      type: String,
      default: "Sep 20, 2026"
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming"
    },
    eligibleCount: {
      type: Number,
      default: 150
    },
    appliedCount: {
      type: Number,
      default: 68
    },
    rounds: [{
      type: String
    }],
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Company", companySchema);
