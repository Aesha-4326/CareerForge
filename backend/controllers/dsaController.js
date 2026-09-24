const DsaSubmission = require("../models/DsaSubmission");
const DsaProgress = require("../models/DsaProgress");

const languageIds = { javascript: 63, python: 71, java: 62 };

const runCode = async (req, res) => {
  try {
    const { code, language, stdin = "" } = req.body;
    const languageId = languageIds[language];
    if (!code || !languageId) return res.status(400).json({ message: "Code and a supported language are required." });
    if (!process.env.JUDGE0_URL) {
      return res.status(503).json({ message: "Code execution is not configured. Add JUDGE0_URL to backend/.env." });
    }

    const headers = { "Content-Type": "application/json" };
    if (process.env.JUDGE0_API_KEY) headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
    const response = await fetch(`${process.env.JUDGE0_URL.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({ source_code: code, language_id: languageId, stdin })
    });
    const result = await response.json();
    if (!response.ok) return res.status(502).json({ message: result.error || "Code runner rejected the submission." });

    res.status(200).json({
      success: true,
      result: {
        status: result.status?.description || "Completed",
        stdout: result.stdout || "",
        stderr: result.stderr || result.compile_output || "",
        time: result.time || "-",
        memory: result.memory ? `${result.memory} KB` : "-"
      }
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({ message: "Unable to run code right now." });
  }
};

// Helper to calculate streak
function calculateStreak(lastDate, currentStreak) {
  if (!lastDate) return 1;
  const now = new Date();
  const last = new Date(lastDate);

  // Normalize dates to midnight for comparison
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate());

  const diffMs = nowMidnight - lastMidnight;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Submitted today, maintain existing streak
    return currentStreak || 1;
  } else if (diffDays === 1) {
    // Submitted yesterday, increment streak
    return (currentStreak || 1) + 1;
  } else {
    // Streak broken, reset to 1
    return 1;
  }
}

// 1. Submit DSA Solution (Protected)
const submitSolution = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const {
      problemId,
      problemTitle,
      difficulty,
      language,
      code,
      timeComplexity,
      spaceComplexity,
      status,
      testsPassed,
      totalTests,
      executionTimeMs
    } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ message: "Problem ID and Code are required." });
    }

    // Save submission record
    const submission = await DsaSubmission.create({
      studentId,
      problemId,
      problemTitle: problemTitle || "DSA Coding Problem",
      difficulty: difficulty || "Easy",
      language: language || "javascript",
      code,
      timeComplexity: timeComplexity || "Not specified",
      spaceComplexity: spaceComplexity || "Not specified",
      status: status || "Submitted",
      testsPassed: testsPassed !== undefined ? testsPassed : 3,
      totalTests: totalTests !== undefined ? totalTests : 3,
      executionTimeMs: executionTimeMs || 15
    });

    let progress = await DsaProgress.findOne({ studentId });
    if (!progress) {
      progress = new DsaProgress({
        studentId,
        solvedProblemIds: [],
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        currentStreak: 1,
        lastSubmittedDate: new Date(),
        totalPoints: 0
      });
    }

    // Update streak on any submission
    const newStreak = calculateStreak(progress.lastSubmittedDate, progress.currentStreak);
    progress.currentStreak = newStreak;
    progress.lastSubmittedDate = new Date();

    // If solution passed, update solved counts if not solved before
    if (status === "Passed") {
      const alreadySolved = progress.solvedProblemIds.includes(problemId);
      if (!alreadySolved) {
        progress.solvedProblemIds.push(problemId);
        progress.totalSolved += 1;
        
        const diff = (difficulty || "Easy").toLowerCase();
        if (diff === "easy") {
          progress.easySolved += 1;
          progress.totalPoints += 10;
        } else if (diff === "medium") {
          progress.mediumSolved += 1;
          progress.totalPoints += 20;
        } else if (diff === "hard") {
          progress.hardSolved += 1;
          progress.totalPoints += 30;
        }
      }
    }

    await progress.save();

    res.status(201).json({
      success: true,
      message: status === "Passed" ? "Solution passed and progress was updated." : "Practice submission saved.",
      submission,
      progress
    });

  } catch (error) {
    console.error("Error saving DSA submission:", error);
    res.status(500).json({ message: "Failed to save submission" });
  }
};

// 2. Get Student DSA Stats & Progress (Protected)
const getDsaStats = async (req, res) => {
  try {
    const studentId = req.user.userId;
    let progress = await DsaProgress.findOne({ studentId });

    if (!progress) {
      progress = {
        studentId,
        solvedProblemIds: [],
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        currentStreak: 0,
        totalPoints: 0
      };
    }

    res.status(200).json({ success: true, progress });
  } catch (error) {
    console.error("Error fetching DSA stats:", error);
    res.status(500).json({ message: "Failed to fetch DSA statistics" });
  }
};

// 3. Get Submission History (Protected)
const getSubmissionHistory = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const history = await DsaSubmission.find({ studentId }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    console.error("Error fetching submission history:", error);
    res.status(500).json({ message: "Failed to fetch submission history" });
  }
};

module.exports = {
  runCode,
  submitSolution,
  getDsaStats,
  getSubmissionHistory
};
