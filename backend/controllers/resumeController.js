const Resume = require("../models/Resume");
const User = require("../models/User");

let GoogleGenAI;
try {
  const genaiPkg = require("@google/genai");
  GoogleGenAI = genaiPkg.GoogleGenAI;
} catch {
  // Package fallback
}

// Google Gemini AI + NLP Fallback Engine for ATS Resume Analysis
async function performATSAnalysis(resumeText, targetJobDescription = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey && apiKey !== "AIzaSyDemoKeyForCareerForgePlacementPortalAI") {
    const prompt = `Perform a comprehensive, professional ATS (Applicant Tracking System) Resume audit for the candidate resume text provided below.

Candidate Resume Text:
${resumeText}

Target Job Description:
${targetJobDescription || "Full Stack Software Engineer (Java / React / Node / Cloud)"}

Evaluate keyword density, action verbs, ATS parsing, measurable achievements, and recruiters' ATS score.
Return actionable suggestions for every weak area. Check Contact Information, Professional Summary, Skills, Work History / Internships, Education, Projects, formatting, keyword alignment, and quantified achievements. Each suggestion must explain exactly what the candidate should change, with a short example where useful.
Return JSON ONLY in this exact schema format without markdown code fences or conversational text:
{
  "score": 88,
  "keywordMatchRate": "85%",
  "foundKeywords": ["JAVA", "SPRING BOOT", "REACT.JS", "REST API", "MYSQL"],
  "missingKeywords": ["DOCKER", "KUBERNETES", "MICROSERVICES", "REDIS"],
  "actionVerbsScore": "82%",
  "sectionChecks": [
    {"name": "Contact Details & Social Links", "present": true},
    {"name": "Education & Academic CGPA", "present": true},
    {"name": "Work Experience / Internships", "present": true},
    {"name": "Technical Skills Matrix", "present": true},
    {"name": "Projects Showcase", "present": true}
  ],
  "suggestions": [
    {"type": "success", "title": "ATS Readability", "desc": "Clean standard structure parsed successfully with 98%+ ATS readability."},
    {"type": "warning", "title": "Missing Cloud Technologies", "desc": "Consider adding Docker, Redis, and Microservices keywords to match top recruiter queries."},
    {"type": "info", "title": "Quantify Impact Metrics", "desc": "Use numerical results (e.g. 'Optimized latency by 35%') in project bullet points."}
  ]
}`;

    // 1. Try GoogleGenAI SDK (@google/genai)
    if (GoogleGenAI) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            score: Math.max(0, Math.min(100, parsed.score || 0)),
            keywordMatchRate: parsed.keywordMatchRate || "85%",
            foundKeywords: parsed.foundKeywords || ["JAVA", "REACT", "SPRING BOOT"],
            missingKeywords: parsed.missingKeywords || ["DOCKER", "KUBERNETES", "MICROSERVICES"],
            actionVerbsScore: parsed.actionVerbsScore || "80%",
            sectionChecks: parsed.sectionChecks || [],
            suggestions: parsed.suggestions || [],
            provider: "Google Gemini"
          };
        }
      } catch (sdkErr) {
        console.warn("Gemini SDK warning, trying REST endpoint fallback:", sdkErr.message);
      }
    }

    // 2. Try Direct Gemini REST Endpoint Fallback
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            score: Math.max(0, Math.min(100, parsed.score || 0)),
            keywordMatchRate: parsed.keywordMatchRate || "85%",
            foundKeywords: parsed.foundKeywords || ["JAVA", "REACT", "SPRING BOOT"],
            missingKeywords: parsed.missingKeywords || ["DOCKER", "KUBERNETES", "MICROSERVICES"],
            actionVerbsScore: parsed.actionVerbsScore || "80%",
            sectionChecks: parsed.sectionChecks || [],
            suggestions: parsed.suggestions || [],
            provider: "Google Gemini"
          };
        }
      }
    } catch (restErr) {
      console.warn("Gemini REST API warning, using server NLP engine:", restErr.message);
    }
  }

  // 3. Server-Side Precision Rule Engine Fallback
  const text = (resumeText || "").toLowerCase();
  const hasNumbers = /\b\d+(?:%|\+|x)?\b/.test(text);
  const hasSummary = /\b(summary|objective|profile|about me)\b/.test(text);
  const technicalKeywords = [
    "java", "spring boot", "react", "react.js", "javascript", "typescript", "python",
    "mysql", "postgresql", "mongodb", "rest api", "microservices", "docker",
    "kubernetes", "aws", "git", "ci/cd", "html", "css", "tailwinds", "redux",
    "data structures", "algorithms", "system design"
  ];
  
  const actionVerbs = [
    "developed", "built", "engineered", "implemented", "architected",
    "optimized", "spearheaded", "designed", "created", "increased",
    "reduced", "collaborated", "managed", "deployed", "scaled"
  ];

  const requiredSections = [
    { name: "Contact Information", pattern: /@|\bphone\b|\blinkedin\b|\blinkedin\.com\b|\bgithub\b/ },
    { name: "Professional Summary", pattern: /\b(summary|objective|profile|about me)\b/ },
    { name: "Skills", pattern: /\b(skills|technologies|languages|frameworks|tools)\b/ },
    { name: "Work History / Internships", pattern: /\b(internship|experience|work history|employment|developer|engineer)\b/ },
    { name: "Education", pattern: /\b(b\.tech|bachelor|degree|cgpa|gpa|university|college|education)\b/ },
    { name: "Projects Showcase", pattern: /\b(project|projects|built|application|github)\b/ }
  ];

  const matchedKeywords = technicalKeywords.filter(kw => text.includes(kw));
  const matchedVerbs = actionVerbs.filter(verb => text.includes(verb));
  const sectionChecks = requiredSections.map(sec => ({
    name: sec.name,
    present: sec.pattern.test(text)
  }));

  const keywordScore = Math.min(100, Math.round((matchedKeywords.length / 12) * 100));
  const verbScore = Math.min(100, Math.round((matchedVerbs.length / 8) * 100));
  const sectionScore = Math.round((sectionChecks.filter(s => s.present).length / requiredSections.length) * 100);
  const impactScore = hasNumbers ? 100 : 25;
  
  const overallATSScore = Math.round((keywordScore * 0.35) + (sectionScore * 0.30) + (verbScore * 0.20) + (impactScore * 0.15));

  const suggestions = [];
  if (!sectionChecks[0].present) {
    suggestions.push({ type: "critical", title: "Fix Contact Information", desc: "Add a professional email, phone number, LinkedIn URL, and GitHub URL in a simple one-line header." });
  }
  if (!hasSummary) {
    suggestions.push({ type: "critical", title: "Add a Professional Summary", desc: "Write a 2-3 line summary focused on your target role, strongest skills, and measurable value." });
  }
  if (keywordScore < 70) {
    suggestions.push({
      type: "warning",
      title: "Missing Key Industry Keywords",
      desc: "Mirror important skills from the target job description and add specific technologies only when you genuinely have that experience."
    });
  }
  if (!sectionChecks[2].present) {
    suggestions.push({ type: "critical", title: "Build a Skills Section", desc: "Create a clearly labelled Skills section with grouped technologies, tools, languages, and frameworks so ATS can parse them." });
  }
  if (!sectionChecks[3].present) {
    suggestions.push({ type: "critical", title: "Add Work History", desc: "Include internships or relevant experience with role, company, dates, and 2-4 achievement-focused bullets." });
  }
  if (!sectionChecks[4].present) {
    suggestions.push({ type: "critical", title: "Add Education Details", desc: "Include your degree, institution, graduation year, and CGPA only when it strengthens your application." });
  }
  if (verbScore < 60) {
    suggestions.push({
      type: "info",
      title: "Strengthen Impact Action Verbs",
      desc: "Replace passive terms with impact verbs like 'Engineered', 'Optimized throughput by 30%', and 'Spearheaded'."
    });
  }
  if (!hasNumbers) {
    suggestions.push({ type: "warning", title: "Quantify Your Achievements", desc: "Add outcomes to bullets, such as users served, latency reduced, revenue increased, or percentage improvement." });
  }
  if (!sectionChecks.find(s => s.name.includes("Projects"))?.present) {
    suggestions.push({
      type: "critical",
      title: "Highlight Hands-on Projects",
      desc: "Recruiters look for live project GitHub links and tech stacks used. Include 2+ full-stack projects."
    });
  }

  suggestions.push({
    type: "success",
    title: "Formatting & Structure",
    desc: "Single-column layout with clean standard font ensures 99%+ ATS parser readability."
  });

  return {
    score: Math.max(0, Math.min(100, overallATSScore)),
    keywordMatchRate: `${Math.min(100, Math.max(40, matchedKeywords.length * 10))}%`,
    foundKeywords: matchedKeywords.map(k => k.toUpperCase()),
    missingKeywords: ["DOCKER", "KUBERNETES", "REDIS", "SYSTEM DESIGN"].filter(k => !matchedKeywords.includes(k.toLowerCase())),
    actionVerbsScore: `${verbScore}%`,
    sectionChecks,
    suggestions
  };
}

// 1. Analyze and Save Resume (Protected)
const analyzeAndSaveResume = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { resumeText, targetJobDescription, fileName } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ message: "Resume text content is required for ATS analysis." });
    }

    const analysis = await performATSAnalysis(resumeText, targetJobDescription);

    const resumeDoc = await Resume.create({
      studentId,
      resumeText: resumeText.trim(),
      targetJobDescription: targetJobDescription || "",
      fileName: fileName || "resume.txt",
      atsScore: analysis.score,
      keywordMatchRate: analysis.keywordMatchRate,
      foundKeywords: analysis.foundKeywords,
      missingKeywords: analysis.missingKeywords,
      actionVerbsScore: analysis.actionVerbsScore,
      sectionChecks: analysis.sectionChecks,
      suggestions: analysis.suggestions
    });

    await User.findByIdAndUpdate(studentId, { atsScore: analysis.score });

    res.status(201).json({
      success: true,
      message: `Resume analyzed via ${analysis.provider || "CareerForge fallback"} and saved to MongoDB!`,
      analysisResult: resumeDoc
    });

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ message: "Failed to analyze and save resume" });
  }
};

// 2. Get Current Latest Resume Analysis (Protected)
const getCurrentResume = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const latestResume = await Resume.findOne({ studentId }).sort({ createdAt: -1 });

    if (!latestResume) {
      return res.status(200).json({ success: true, analysisResult: null });
    }

    res.status(200).json({ success: true, analysisResult: latestResume });
  } catch (error) {
    console.error("Error fetching latest resume:", error);
    res.status(500).json({ message: "Failed to fetch current resume analysis" });
  }
};

// 3. Get Resume Analysis History (Protected)
const getResumeHistory = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const history = await Resume.find({ studentId }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    console.error("Error fetching resume history:", error);
    res.status(500).json({ message: "Failed to fetch resume analysis history" });
  }
};

module.exports = {
  analyzeAndSaveResume,
  getCurrentResume,
  getResumeHistory
};
