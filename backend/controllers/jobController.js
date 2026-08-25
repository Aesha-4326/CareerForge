const Job = require("../models/Job");
const Application = require("../models/Application");

// 1. Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// 2. Create new job
const createJob = async (req, res) => {
  try {
    const { title, company, type, roleCategory, location, workMode, ctc, stipend, minCgpa, allowedBranches, skillsRequired, deadline, description, rounds } = req.body;

    if (!title || !company || !location || !description || !deadline) {
      return res.status(400).json({ message: "Please provide all required job fields." });
    }

    const job = await Job.create({
      title,
      company,
      type: type || "Job",
      roleCategory: roleCategory || "Full Stack Developer",
      location,
      workMode: workMode || "Hybrid",
      ctc,
      stipend,
      minCgpa: minCgpa ? Number(minCgpa) : 6.0,
      allowedBranches: allowedBranches || ["CSE", "IT"],
      skillsRequired: skillsRequired || ["Java", "React"],
      deadline,
      description,
      rounds: rounds || ["Technical Interview"],
      postedBy: req.user ? req.user.userId : null
    });

    res.status(201).json({ success: true, message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job posting" });
  }
};

// 3. Apply to job
const applyJob = async (req, res) => {
  try {
    const { jobId, matchScore } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Increment applicants count
    job.applicantsCount += 1;
    await job.save();

    const application = await Application.create({
      jobId: job._id,
      studentId: req.user.userId,
      studentName: req.user.name || "Student Candidate",
      company: job.company,
      title: job.title,
      status: "Applied",
      currentRound: "Resume Screening",
      matchScore: matchScore || 85,
      location: job.location
    });

    res.status(201).json({ success: true, message: "Application submitted successfully!", application });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

// 4. Get applications for current student or company
const getApplications = async (req, res) => {
  try {
    let applications;
    if (req.user.role === "student") {
      applications = await Application.find({ studentId: req.user.userId }).sort({ createdAt: -1 });
    } else if (req.user.role === "company") {
      const companyJobs = await Job.find({ postedBy: req.user.userId }).select("_id");
      applications = await Application.find({ jobId: { $in: companyJobs.map(job => job._id) } }).sort({ createdAt: -1 });
    } else if (req.user.role === "admin") {
      applications = await Application.find().sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: "Access denied for this role" });
    }
    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// 5. Update application status (Recruiter/Admin action)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentRound, nextStepDate } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.user.role === "company") {
      const job = await Job.findOne({ _id: application.jobId, postedBy: req.user.userId });
      if (!job) {
        return res.status(403).json({ message: "You can only update applications for your own jobs" });
      }
    }

    if (status) application.status = status;
    if (currentRound) application.currentRound = currentRound;
    if (nextStepDate) application.nextStepDate = nextStepDate;

    await application.save();
    res.status(200).json({ success: true, message: "Application updated", application });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

module.exports = {
  getJobs,
  createJob,
  applyJob,
  getApplications,
  updateApplicationStatus
};
