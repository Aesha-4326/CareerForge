const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");
const { createSecureToken, hashToken } = require("../utils/tokens");

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const createAuthToken = (user) => jwt.sign(
  { userId: user._id, role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "student", rollNo, course, branch, companyName, title, accessCode } = req.body;
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

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userRole = role;

    // 4. Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
      rollNo: rollNo || (userRole === "student" ? `STU-${Math.floor(1000 + Math.random() * 9000)}` : undefined),
      course: course || (userRole === "student" ? "B.Tech" : undefined),
      branch: branch || (userRole === "student" ? "Computer Science" : undefined),
      companyName: companyName || (userRole === "company" ? "Tech Corp" : undefined),
      title: title || (userRole === "student" ? "Student" : userRole === "company" ? "HR Manager" : "TPO Admin"),
      skills: ["Java", "React.js", "JavaScript", "SQL", "Tailwind CSS"]
    });

    const verification = createSecureToken();
    user.emailVerificationTokenHash = verification.hash;
    user.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verificationUrl = `${clientUrl()}/?verifyEmail=${verification.token}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your CareerForge email",
      text: `Welcome to CareerForge. Verify your email within 24 hours: ${verificationUrl}`
    });

    const token = createAuthToken(user);

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
        course: user.course,
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

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated. Contact your placement office." });
    }

    const token = createAuthToken(user);

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
        course: user.course,
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

const requestPasswordReset = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = email ? await User.findOne({ email }) : null;

    if (user) {
      const reset = createSecureToken();
      user.passwordResetTokenHash = reset.hash;
      user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Reset your CareerForge password",
        text: `Use this link within one hour to reset your password: ${clientUrl()}/?resetPassword=${reset.token}`
      });
    }

    res.status(200).json({ message: "If an account exists for that email, a reset link has been sent." });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ message: "Unable to process the reset request." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ message: "A valid reset token and an 8-character password are required." });
    }

    const user = await User.findOne({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpiresAt: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: "This reset link is invalid or has expired." });

    user.password = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Unable to reset the password." });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const user = token && await User.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpiresAt: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: "This verification link is invalid or has expired." });

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Unable to verify email." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail
};
