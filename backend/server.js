require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { secureHeaders, rateLimit } = require("./middleware/securityMiddleware");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const guidanceRoutes = require("./routes/guidanceRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((origin) => origin.trim());
app.disable("x-powered-by");
app.use(secureHeaders);
app.use(cors({ origin: allowedOrigins, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, keyPrefix: "api" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/guidance", guidanceRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

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

app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: "careerforge-api" }));
