const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "student", rollNo, branch, companyName, title, accessCode } = req.body;
    const allowedRoles = ["student", "company", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid account role" });
    }

    if (role === "company" && (!process.env.RECRUITER_REGISTRATION_CODE || accessCode !== process.env.RECRUITER_REGISTRATION_CODE)) {
      return res.status(403).json({ message: "A valid recruiter registration code is required." });
    }

    if (role === "admin" && (!process.env.ADMIN_REGISTRATION_CODE || accessCode !== process.env.ADMIN_REGISTRATION_CODE)) {
      return res.status(403).json({ message: "A valid TPO admin registration code is required." });
    }

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role;

    // 4. Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
      rollNo: rollNo || (userRole === "student" ? `STU-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      branch: branch || (userRole === "student" ? "Computer Science" : undefined),
      companyName: companyName || (userRole === "company" ? "Tech Corp" : undefined),
      title: title || (userRole === "student" ? "Student" : userRole === "company" ? "HR Manager" : "TPO Admin"),
      skills: ["Java", "React.js", "JavaScript", "SQL", "Tailwind CSS"]
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        branch: user.branch,
        companyName: user.companyName,
        title: user.title,
        cgpa: user.cgpa,
        atsScore: user.atsScore,
        skills: user.skills
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error during registration"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "7d"
      }
    );

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        branch: user.branch,
        companyName: user.companyName,
        title: user.title,
        cgpa: user.cgpa,
        atsScore: user.atsScore,
        skills: user.skills || []
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login"
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};