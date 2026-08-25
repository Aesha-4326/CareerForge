const User = require("../models/User");

// 1. Get Student Profile (Protected)
const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access restricted to student accounts only" });
    }

    // Default fallback skills & certifications if newly registered and empty
    const skills = (user.skills && user.skills.length > 0) 
      ? user.skills 
      : ["Java", "Spring Boot", "React.js", "MySQL", "JavaScript", "Data Structures & Algorithms", "Git", "REST APIs", "Tailwind CSS"];

    const certifications = (user.certifications && user.certifications.length > 0)
      ? user.certifications
      : [
          { title: "AWS Certified Developer Associate", issuer: "Amazon Web Services", date: "Jan 2026", badge: "AWS" },
          { title: "Meta Front-End Developer Professional", issuer: "Meta (Coursera)", date: "Nov 2025", badge: "Meta" },
          { title: "Oracle Certified Professional: Java SE 17", issuer: "Oracle", date: "Aug 2025", badge: "Oracle" }
        ];

    const projects = (user.projects && user.projects.length > 0)
      ? user.projects
      : [
          { title: "Smart Placement Portal", tech: "React, Node.js, MongoDB", description: "Centralized campus placement web application with AI resume parsing.", link: "github.com/profilename/placement-portal" },
          { title: "Microservices E-Commerce API", tech: "Java, Spring Boot, Docker, Redis", description: "High-throughput RESTful services for order processing and inventory management.", link: "github.com/profilename/spring-ecommerce" }
        ];

    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo || "CS2026-084",
      branch: user.branch || "Information Technology",
      year: user.year || "4th Year (2026 Batch)",
      cgpa: user.cgpa || 8.85,
      backlogs: user.backlogs || 0,
      phone: user.phone || "+91 98765 43210",
      location: user.location || "Surat, India",
      github: user.github || "github.com/profilename",
      linkedin: user.linkedin || "linkedin.com/in/profilename",
      atsScore: user.atsScore || 88,
      skills,
      certifications,
      projects
    };

    res.status(200).json({ success: true, student: profile });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error fetching student profile" });
  }
};

// 2. Update Student Profile (Protected)
const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      name, 
      rollNo, 
      branch, 
      year, 
      cgpa, 
      backlogs, 
      phone, 
      location, 
      github, 
      linkedin, 
      atsScore, 
      skills, 
      certifications, 
      projects 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Student account not found" });
    }

    if (name) user.name = name;
    if (rollNo) user.rollNo = rollNo;
    if (branch) user.branch = branch;
    if (year) user.year = year;
    if (cgpa !== undefined) user.cgpa = Number(cgpa);
    if (backlogs !== undefined) user.backlogs = Number(backlogs);
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (atsScore !== undefined) user.atsScore = Number(atsScore);
    if (skills) user.skills = skills;
    if (certifications) user.certifications = certifications;
    if (projects) user.projects = projects;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully in MongoDB!",
      student: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        backlogs: user.backlogs,
        phone: user.phone,
        location: user.location,
        github: user.github,
        linkedin: user.linkedin,
        atsScore: user.atsScore,
        skills: user.skills,
        certifications: user.certifications,
        projects: user.projects
      }
    });

  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Server error updating student profile" });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile
};
