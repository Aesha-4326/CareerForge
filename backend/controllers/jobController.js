const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Resume = require("../models/Resume");
const Company = require("../models/Company");

const normalizedBranch = (branch = "") => branch.toLowerCase().replace(/[^a-z]/g, "");
const isEligibleStudent = (student, job) => {
  const meetsCgpa = Number(student.cgpa || 0) >= Number(job.minCgpa || 0);
  const allowedBranches = job.allowedBranches || [];
  const studentBranch = normalizedBranch(student.branch);
  const acceptsBranch = allowedBranches.length === 0 || allowedBranches.some((branch) => {
    const allowed = normalizedBranch(branch);
    return allowed === studentBranch || allowed.includes(studentBranch) || studentBranch.includes(allowed);
  });
  return meetsCgpa && acceptsBranch;
};

// 1. Get all jobs
const getJobs = async (req, res) => {
  try {
    const drives = await Company.find({ status: { $ne: "Completed" } });
    for (const drive of drives) {
      if (!drive.jobId) {
        const driveJob = await Job.create({
          company: drive.companyName,
          logo: drive.logo,
          title: drive.driveTitle,
          roleCategory: drive.jobRole,
          location: "Campus Drive",
          workMode: "On-site",
          ctc: drive.ctc,
          minCgpa: drive.minCgpa,
          allowedBranches: drive.allowedBranches,
          deadline: drive.driveDate,
          description: `${drive.driveTitle} campus recruitment drive by ${drive.companyName}.`,
          rounds: drive.rounds,
          postedBy: drive.createdBy
        });
        drive.jobId = driveJob._id;
        await drive.save();
      }
    }

    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    res.status(500).json({ message: "Failed to fetch your job postings" });
  }
};

// 2. Create new job
const createJob = async (req, res) => {
  try {
    const { title, company, type, roleCategory, location, workMode, ctc, stipend, minCgpa, allowedBranches, skillsRequired, deadline, description, rounds } = req.body;

    if (!title || !company || !location || !description || !deadline) {
      return res.status(400).json({ message: "Please provide all required job fields." });
    }

    const owner = req.user ? await User.findById(req.user.userId).select("companyName name") : null;
    const ownerCompanyName = owner?.companyName || owner?.name || company;

    const job = await Job.create({
      title,
      company: ownerCompanyName,
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

    const [students, administrators] = await Promise.all([
      User.find({ role: "student", isActive: true }).select("_id branch cgpa"),
      User.find({ role: "admin", isActive: true }).select("_id")
    ]);
    const eligibleStudents = students.filter((student) => isEligibleStudent(student, job));
    const recipients = [...eligibleStudents, ...administrators];

    if (recipients.length) {
      await Notification.insertMany(recipients.map((recipient) => ({
        recipientId: recipient._id,
        title: `New opportunity: ${job.title}`,
        message: `${job.company} is hiring for ${job.title}. Apply by ${job.deadline}.`,
        type: "job",
        link: "jobs",
        jobId: job._id
      })));
    }

    res.status(201).json({ success: true, message: "Job created successfully", job, notifiedCount: recipients.length });
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

    const existingApplication = await Application.findOne({ jobId: job._id, studentId: req.user.userId });
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied for this opportunity." });
    }

    const latestResume = await Resume.findOne({ studentId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("resumeText fileName atsScore keywordMatchRate createdAt");
    if (!latestResume) {
      return res.status(400).json({ message: "Please save your resume in Resume Analyzer before applying." });
    }

    // Increment applicants count
    job.applicantsCount += 1;
    await job.save();

    const application = await Application.create({
      jobId: job._id,
      studentId: req.user.userId,
      resumeId: latestResume?._id || null,
      studentName: req.user.name || "Student Candidate",
      company: job.company,
      title: job.title,
      status: "Applied",
      currentRound: "Resume Screening",
      matchScore: matchScore || 85,
      location: job.location
    });

    const escapedCompanyName = job.company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const [administrators, companyRecruiters] = await Promise.all([
      User.find({ role: "admin", isActive: true }).select("_id"),
      User.find({
        role: "company",
        isActive: true,
        companyName: { $regex: `^${escapedCompanyName}$`, $options: "i" }
      }).select("_id")
    ]);
    const recipientIds = [
      ...(job.postedBy ? [job.postedBy] : []),
      ...companyRecruiters.map((recruiter) => recruiter._id),
      ...administrators.map((administrator) => administrator._id)
    ].filter((recipientId, index, ids) => ids.findIndex((id) => String(id) === String(recipientId)) === index);

    if (recipientIds.length) {
      await Notification.insertMany(recipientIds.map((recipientId) => ({
        recipientId,
        title: `New application for ${job.title}`,
        message: `${application.studentName} applied for ${job.title} at ${job.company}.`,
        type: "application",
        link: "applicants",
        jobId: job._id
      })));
    }

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
      applications = await Application.find({ studentId: req.user.userId }).populate("resumeId").sort({ createdAt: -1 });
    } else if (req.user.role === "company") {
      const companyJobs = await Job.find({ postedBy: req.user.userId }).select("_id");
      applications = await Application.find({ jobId: { $in: companyJobs.map(job => job._id) } })
        .populate("resumeId")
        .sort({ createdAt: -1 });
    } else if (req.user.role === "admin") {
      applications = await Application.find()
        .populate("resumeId")
        .populate("studentId", "name email rollNo branch")
        .populate("jobId", "title company location")
        .sort({ createdAt: -1 });
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
    await Notification.create({
      recipientId: application.studentId,
      title: `Application updated: ${application.title}`,
      message: `${application.company} updated your application to ${application.status}.`,
      type: "application",
      link: "tracker",
      jobId: application.jobId
    });
    res.status(200).json({ success: true, message: "Application updated", application });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

module.exports = {
  getJobs,
  getMyJobs,
  createJob,
  applyJob,
  getApplications,
  updateApplicationStatus
};
