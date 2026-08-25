require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const guidanceRoutes = require("./routes/guidanceRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/guidance", guidanceRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CareerForge Backend is running successfully!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerForge server running on http://localhost:${PORT}`);
});