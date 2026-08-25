const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: "Jan 2026" },
  badge: { type: String, default: "Certified" }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tech: { type: String },
  description: { type: String },
  link: { type: String }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student"
    },
    rollNo: {
      type: String,
      default: "CS2026-084"
    },
    branch: {
      type: String,
      default: "Information Technology"
    },
    year: {
      type: String,
      default: "4th Year (2026 Batch)"
    },
    cgpa: {
      type: Number,
      default: 8.85
    },
    backlogs: {
      type: Number,
      default: 0
    },
    phone: {
      type: String,
      default: "+91 98765 43210"
    },
    location: {
      type: String,
      default: "Surat, India"
    },
    github: {
      type: String,
      default: "github.com/profilename"
    },
    linkedin: {
      type: String,
      default: "linkedin.com/in/profilename"
    },
    companyName: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    atsScore: {
      type: Number,
      default: 88
    },
    skills: [{
      type: String
    }],
    certifications: [certificationSchema],
    projects: [projectSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);