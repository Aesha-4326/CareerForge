const DsaSubmission = require("../models/DsaSubmission");
const DsaProgress = require("../models/DsaProgress");

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
      status: status || "Passed",
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
      message: status === "Passed" ? "Solution Passed! Progress saved to MongoDB." : "Submission recorded.",
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
  submitSolution,
  getDsaStats,
  getSubmissionHistory
};
