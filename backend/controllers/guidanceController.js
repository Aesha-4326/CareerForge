const Roadmap = require("../models/Roadmap");
const User = require("../models/User");

let GoogleGenAI;
try {
  const genaiPkg = require("@google/genai");
  GoogleGenAI = genaiPkg.GoogleGenAI;
} catch {
  // Package fallback
}

// Google Gemini AI Career Guidance & Roadmap Synthesis Engine
async function synthesizeCareerRoadmap(targetGoal, studentSkills = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey && apiKey !== "AIzaSyDemoKeyForCareerForgePlacementPortalAI") {
    const prompt = `Synthesize an AI Career Guidance & 3-Phase Personalized Learning Roadmap for a student pursuing: "${targetGoal}".
Current Student Technical Skills: ${studentSkills.join(", ") || "Java, React, SQL"}.

Return JSON ONLY in this exact schema format without markdown code fences or conversational text:
{
  "targetRole": "Java Full Stack Developer",
  "matchPercentage": 88,
  "missingSkills": ["Docker", "Kubernetes", "Redis", "Microservices", "System Design"],
  "roadmapTimeline": [
    {
      "phase": "Phase 1: Core Engineering Foundations (Weeks 1-3)",
      "focus": "Backend Concurrency & Relational Architectures",
      "topics": ["Java Multithreading & Executors", "Spring Security with JWT", "PostgreSQL Indexing & Optimization"]
    },
    {
      "phase": "Phase 2: Microservices & Cloud Containers (Weeks 4-6)",
      "focus": "Distributed Systems & Event-Driven Services",
      "topics": ["Docker Containerization", "Redis Pub/Sub & Caching", "Kafka Event Streaming"]
    },
    {
      "phase": "Phase 3: Production Portfolio & CI/CD (Weeks 7-8)",
      "focus": "Capstone Projects & Technical Interviews",
      "topics": ["Build E-Commerce Microservices", "CI/CD via GitHub Actions", "System Design Mock Interviews"]
    }
  ],
  "recommendedProjects": [
    {
      "title": "Real-time Collaborative Whiteboard",
      "tech": "React, Node.js, WebSockets, Redis",
      "desc": "Interactive canvas supporting multiple simultaneous users with low latency state synchronization."
    },
    {
      "title": "Microservices Payment Gateway Integration",
      "tech": "Java, Spring Boot, PostgreSQL, Kafka",
      "desc": "Event-driven architecture with idempotency checks, retry handlers, and Webhook dispatchers."
    }
  ],
  "dsaFocusTopics": ["Sliding Window & Two Pointers", "Graph Traversal (BFS / DFS)", "Dynamic Programming", "Priority Queue & Heaps"],
  "interviewPrepTips": ["Articulate thought process out loud before coding.", "Review SOLID design principles.", "Prepare STAR-format behavioral responses."]
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
            targetRole: parsed.targetRole || "Full Stack Software Engineer",
            matchPercentage: Math.max(50, Math.min(99, parsed.matchPercentage || 85)),
            missingSkills: parsed.missingSkills || ["Docker", "Kubernetes", "Redis"],
            roadmapTimeline: parsed.roadmapTimeline || [],
            recommendedProjects: parsed.recommendedProjects || [],
            dsaFocusTopics: parsed.dsaFocusTopics || [],
            interviewPrepTips: parsed.interviewPrepTips || [],
            provider: "Google Gemini"
          };
        }
      } catch (sdkErr) {
        console.warn("Gemini SDK warning, trying REST endpoint fallback:", sdkErr.message);
      }
    }

    // 2. Direct Gemini REST Endpoint Fallback
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
            targetRole: parsed.targetRole || "Full Stack Software Engineer",
            matchPercentage: Math.max(50, Math.min(99, parsed.matchPercentage || 85)),
            missingSkills: parsed.missingSkills || ["Docker", "Kubernetes", "Redis"],
            roadmapTimeline: parsed.roadmapTimeline || [],
            recommendedProjects: parsed.recommendedProjects || [],
            dsaFocusTopics: parsed.dsaFocusTopics || [],
            interviewPrepTips: parsed.interviewPrepTips || [],
            provider: "Google Gemini"
          };
        }
      }
    } catch (restErr) {
      console.warn("Gemini REST API warning, using guidance fallback:", restErr.message);
    }
  }

  // 3. Server Guidance Rule Engine Fallback
  const goal = (targetGoal || "").toLowerCase();
  let roleTitle = "Java Full Stack Developer";
  let matchPercentage = 88;
  let missingSkills = ["Docker", "Kubernetes", "Redis Caching", "Microservices Architecture", "System Design"];
  let roadmapTimeline = [
    { phase: "Phase 1: Core Mastery (Weeks 1 - 3)", focus: "Strengthen Backend & System Fundamentals", topics: ["Java Multithreading & Concurrency", "Spring Security with JWT", "Relational Database Indexing & Query Tuning"] },
    { phase: "Phase 2: Distributed Architecture (Weeks 4 - 6)", focus: "Microservices & Cloud Technologies", topics: ["Docker Containerization", "Redis Caching & Pub/Sub", "REST API Gateway & Service Discovery"] },
    { phase: "Phase 3: Portfolio & Production (Weeks 7 - 8)", focus: "Capstone Project & Interview Preparation", topics: ["Build E-Commerce Microservices", "CI/CD with GitHub Actions", "System Design Mock Interviews"] }
  ];
  let recommendedProjects = [
    { title: "Real-time Collaborative Whiteboard", tech: "React, Node.js, WebSockets, Redis", desc: "Build a collaborative app with real-time state synchronization and authentication." },
    { title: "Microservices Payment Gateway", tech: "Java, Spring Boot, PostgreSQL, Kafka", desc: "Create an event-driven payment service with retries, idempotency, and webhooks." }
  ];
  let dsaFocusTopics = ["Sliding Window & Two Pointers", "Graph Traversal (BFS / DFS)", "Dynamic Programming", "Heap & Priority Queue"];
  let interviewPrepTips = ["Explain your thought process while coding.", "Review SOLID principles and API design.", "Prepare STAR stories with measurable results."];
  
  if (goal.includes("data") || goal.includes("ai") || goal.includes("machine")) {
    roleTitle = "AI / Data Science Engineer";
    matchPercentage = 78;
    missingSkills = ["Python", "PyTorch", "Pandas", "Scikit-Learn", "Feature Engineering", "MLOps"];
    roadmapTimeline = [
      { phase: "Phase 1: Python & Data Foundations (Weeks 1 - 3)", focus: "Prepare and Understand Data", topics: ["Python for Data Science", "NumPy and Pandas", "SQL, Statistics and Data Cleaning"] },
      { phase: "Phase 2: Machine Learning (Weeks 4 - 6)", focus: "Train and Evaluate Models", topics: ["Scikit-Learn Pipelines", "Feature Engineering", "Model Evaluation and Cross-Validation"] },
      { phase: "Phase 3: Deep Learning & Deployment (Weeks 7 - 8)", focus: "Build a Production AI Project", topics: ["PyTorch Neural Networks", "FastAPI Model Serving", "Docker and MLOps Monitoring"] }
    ];
    recommendedProjects = [
      { title: "End-to-End Customer Churn Predictor", tech: "Python, Pandas, Scikit-Learn, FastAPI", desc: "Clean a real dataset, train a model, explain predictions, and deploy an inference API." },
      { title: "Image Classification Service", tech: "Python, PyTorch, FastAPI, Docker", desc: "Train a computer vision model and expose predictions through a documented API." }
    ];
    dsaFocusTopics = ["Arrays, Hash Maps & Two Pointers", "Trees and Graph Traversal", "Probability and Statistics", "Matrix Operations"];
    interviewPrepTips = ["Explain bias, variance, and model trade-offs.", "Discuss data leakage and evaluation metrics.", "Prepare one ML project story from data to deployment."];
  } else if (goal.includes("front") || goal.includes("react") || goal.includes("ui")) {
    roleTitle = "Senior Frontend Engineer (React/Next.js)";
    matchPercentage = 92;
    missingSkills = ["TypeScript", "Next.js 14", "Zustand / Redux Toolkit", "Web Performance Optimization", "Jest & Cypress"];
    roadmapTimeline = [
      { phase: "Phase 1: Modern Frontend Core (Weeks 1 - 3)", focus: "Build Accessible React Interfaces", topics: ["TypeScript for React", "Component Architecture", "Accessibility and Responsive CSS"] },
      { phase: "Phase 2: Product Engineering (Weeks 4 - 6)", focus: "State, APIs and Performance", topics: ["Next.js Routing and SSR", "State Management", "Web Performance and Testing"] },
      { phase: "Phase 3: Production Portfolio (Weeks 7 - 8)", focus: "Ship a Polished Application", topics: ["Build a SaaS Dashboard", "Cypress End-to-End Tests", "Deploy with CI/CD"] }
    ];
    recommendedProjects = [
      { title: "Analytics SaaS Dashboard", tech: "React, TypeScript, Next.js, Recharts", desc: "Build a responsive dashboard with filters, loading states, accessible charts, and authentication." },
      { title: "Collaborative Task Manager", tech: "Next.js, Zustand, WebSockets, PostgreSQL", desc: "Create a multi-user task board with optimistic updates and real-time collaboration." }
    ];
    dsaFocusTopics = ["Arrays and Hash Maps", "Recursion and Trees", "Sorting and Searching", "Time and Space Complexity"];
    interviewPrepTips = ["Explain component and state boundaries.", "Discuss accessibility and performance decisions.", "Prepare examples of testing and responsive design."];
  } else if (goal.includes("cloud") || goal.includes("devops")) {
    roleTitle = "Cloud & DevOps Engineer";
    matchPercentage = 72;
    missingSkills = ["AWS CloudFormation", "Terraform", "Docker & K8s", "Jenkins / GitHub Actions", "Prometheus & Grafana"];
    roadmapTimeline = [
      { phase: "Phase 1: Linux & Cloud Basics (Weeks 1 - 3)", focus: "Operate Reliable Infrastructure", topics: ["Linux and Networking", "AWS IAM, EC2 and S3", "Shell Scripting and Git"] },
      { phase: "Phase 2: Containers & Infrastructure (Weeks 4 - 6)", focus: "Automate Environments", topics: ["Docker Images and Networks", "Kubernetes Deployments", "Terraform Infrastructure as Code"] },
      { phase: "Phase 3: Observability & Delivery (Weeks 7 - 8)", focus: "Run Production Systems", topics: ["GitHub Actions CI/CD", "Prometheus and Grafana", "Incident Response and Monitoring"] }
    ];
    recommendedProjects = [
      { title: "Production CI/CD Platform", tech: "AWS, Terraform, Docker, GitHub Actions", desc: "Provision infrastructure and deploy a containerized application through automated environments." },
      { title: "Kubernetes Observability Stack", tech: "Kubernetes, Prometheus, Grafana", desc: "Deploy services with health checks, dashboards, alerts, and a documented runbook." }
    ];
    dsaFocusTopics = ["Arrays and Hash Maps", "Graphs and Dependency Ordering", "Queues and Scheduling", "Complexity Analysis"];
    interviewPrepTips = ["Explain deployment and rollback strategies.", "Discuss availability, scaling, and security.", "Prepare an incident response example with root cause analysis."];
  }

  return {
    targetRole: roleTitle,
    matchPercentage,
    missingSkills,
    roadmapTimeline,
    recommendedProjects,
    dsaFocusTopics,
    interviewPrepTips
  };
}

async function answerCareerQuestion(question, studentSkills = [], targetGoal = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = `You are CareerForge's evidence-based career mentor. Answer the student's question accurately and practically.
Question: ${question}
Current career goal: ${targetGoal || "Not specified"}
Current skills: ${studentSkills.join(", ") || "Not specified"}

Rules:
- Identify the field or technology being discussed before answering.
- Explain uncertainty or version-dependent details instead of inventing facts.
- Prefer official documentation, standard industry practice, and clearly labelled assumptions.
- Give a direct answer first, then concise explanation, practical next steps, and useful resources.
- If the question is not career/learning related, politely say this assistant focuses on career, education, skills, projects, interviews, and learning plans.
- Return JSON only: {"answer":"...","field":"...","nextSteps":["..."],"resources":["..."]}`;

  if (apiKey && apiKey !== "AIzaSyDemoKeyForCareerForgePlacementPortalAI" && GoogleGenAI) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ model, contents: prompt });
      const match = (response.text || "").match(/\{[\s\S]*\}/);
      if (match) return { ...JSON.parse(match[0]), provider: "Google Gemini" };
    } catch (error) {
      console.warn("Gemini career answer warning:", error.message);
    }
  }

  const normalizedQuestion = question.toLowerCase();
  if ((normalizedQuestion.includes("react") && normalizedQuestion.includes("angular")) || normalizedQuestion.includes("react vs angular")) {
    return {
      field: "React vs Angular",
      answer: "React is a JavaScript library focused on UI and lets you choose supporting libraries. Angular is a complete TypeScript framework with built-in routing, forms, dependency injection, and a structured project architecture. Choose React for flexible product teams and gradual adoption; choose Angular for large applications that benefit from strong conventions and built-in tooling. Neither is universally better.",
      nextSteps: ["Learn JavaScript or TypeScript fundamentals first.", "Build the same small CRUD app in both frameworks.", "For React, learn components, hooks, routing, state, testing, and performance.", "For Angular, learn components, services, RxJS, routing, forms, and dependency injection.", "Choose based on your target job postings and build two portfolio projects in the selected stack."],
      resources: ["https://react.dev/learn", "https://angular.dev/overview", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
      provider: "CareerForge knowledge base"
    };
  }

  if (normalizedQuestion.includes("python") && (normalizedQuestion.includes("learn") || normalizedQuestion.includes("start") || normalizedQuestion.includes("career"))) {
    return {
      field: "Python",
      answer: "Python is a strong starting language for web development, automation, data analysis, and AI. Start with syntax, functions, collections, modules, exceptions, file handling, and object-oriented programming before moving to a specialization.",
      nextSteps: ["Weeks 1-2: syntax, functions, lists, dictionaries, modules, and exceptions.", "Weeks 3-4: OOP, testing with pytest, virtual environments, Git, and REST APIs.", "Then choose one path: FastAPI/Django for web, Pandas/SQL for data, or NumPy/PyTorch for AI.", "Build one practical project and deploy it instead of only following tutorials."],
      resources: ["https://docs.python.org/3/tutorial/", "https://packaging.python.org/en/latest/tutorials/installing-packages/", "https://pytest.org/"],
      provider: "CareerForge knowledge base"
    };
  }

  const field = question.match(/python|java|javascript|react|angular|node|sql|cloud|aws|azure|devops|data science|machine learning|ai|cyber security|testing|ui|ux|product/i)?.[0] || "career planning";
  const isComparison = /\b(vs\.?|versus|difference between|compare)\b/i.test(question);
  const asksHow = /\b(how|roadmap|steps|learn|start|begin)\b/i.test(question);
  const asksWhether = /\b(is|should|worth|good|future|scope|career)\b/i.test(question);
  const asksInterview = /\b(interview|resume|cv|job|hire|hiring)\b/i.test(question);

  let answer = `${field} can be a useful direction, but the right answer depends on your target role, current level, and the kind of work you want to do.`;
  let nextSteps = [
    `Define the ${field} role you want and compare its requirements across 5-10 current job postings.`,
    `Learn the fundamentals of ${field}, then build one small project that demonstrates them.`,
    "Review the project, explain your decisions, and document what you would improve next."
  ];
  let resources = [`Official ${field} documentation`, `A beginner-to-intermediate ${field} project`, "Current job descriptions for your target role"];

  if (isComparison) {
    answer = `A useful comparison of ${field} options should consider learning curve, common job requirements, ecosystem maturity, and the kind of products you want to build. There is no universally best choice; use the role you are targeting and the available opportunities as the deciding factors.`;
    nextSteps = ["Name the two technologies or roles you want compared.", "Build the same small feature in both options.", "Choose the one that matches more of your target job postings and interests."];
  } else if (asksHow) {
    answer = `To learn ${field} effectively, start with its core concepts rather than jumping between tools. Follow a short sequence of fundamentals, guided practice, testing, and one complete project. That gives you evidence of skill instead of only course completion.`;
    nextSteps = [`Weeks 1-2: learn the syntax, core concepts, and standard tooling for ${field}.`, `Weeks 3-4: build a small guided project and add tests, Git history, and documentation.`, `After that: choose a specialization, deploy a project, and compare your gaps with current job descriptions.`];
    resources = [`Official ${field} getting-started guide`, `A hands-on ${field} project with tests`, "Documentation for the specialization you choose"];
  } else if (asksInterview) {
    answer = `For ${field} roles, interview preparation should connect fundamentals to practical decisions. Be ready to explain a project, discuss trade-offs, debug a small problem, and show how you learn unfamiliar tools.`;
    nextSteps = [`Prepare a concise walkthrough of your strongest ${field} project.`, "Practice fundamentals, debugging, and one system or design problem each week.", "Match your resume keywords to the job description without claiming skills you cannot demonstrate."];
  } else if (asksWhether) {
    answer = `${field} can be a good career choice when it matches the work you enjoy and the roles available in your market. Check demand, entry-level requirements, realistic learning time, and whether you can build projects that demonstrate the skill before committing fully.`;
    nextSteps = ["Read recent entry-level and internship postings for this field.", "Speak with practitioners or review real project repositories.", `Build a small ${field} project over 2-4 weeks and reassess your interest.`];
  }

  return {
    field,
    answer,
    nextSteps,
    resources,
    provider: "CareerForge knowledge base"
  };
}

// 1. Generate & Save Roadmap (Protected)
const generateRoadmapPreview = async (req, res) => {
  try {
    const { targetGoal, currentSkills = [] } = req.body;

    if (!targetGoal || !targetGoal.trim()) {
      return res.status(400).json({ message: "Please specify a valid career goal prompt." });
    }

    const roadmap = await synthesizeCareerRoadmap(targetGoal.trim(), currentSkills);
    res.status(200).json({
      success: true,
      message: `Roadmap generated via ${roadmap.provider || "CareerForge fallback"}.`,
      roadmap: { ...roadmap, currentSkills }
    });
  } catch (error) {
    console.error("Error generating roadmap preview:", error);
    res.status(500).json({ message: "Failed to generate AI career roadmap preview" });
  }
};

const answerCareerQuestionPreview = async (req, res) => {
  try {
    const { question, currentSkills = [], targetGoal = "" } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Please enter a career or learning question." });
    }
    const answer = await answerCareerQuestion(question.trim(), currentSkills, targetGoal);
    res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("Error answering career question:", error);
    res.status(500).json({ message: "Failed to answer career question" });
  }
};

const answerCareerQuestionAuthenticated = async (req, res) => {
  try {
    const { question, targetGoal = "" } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Please enter a career or learning question." });
    }
    const student = await User.findById(req.user.userId).select("skills");
    const answer = await answerCareerQuestion(question.trim(), student?.skills || [], targetGoal);
    res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("Error answering authenticated career question:", error);
    res.status(500).json({ message: "Failed to answer career question" });
  }
};

const generateAndSaveRoadmap = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { targetGoal } = req.body;

    if (!targetGoal || !targetGoal.trim()) {
      return res.status(400).json({ message: "Please specify a valid career goal prompt." });
    }

    const student = await User.findById(studentId);
    const studentSkills = student ? (student.skills || []) : [];

    const synthesis = await synthesizeCareerRoadmap(targetGoal, studentSkills);

    const roadmapDoc = await Roadmap.create({
      studentId,
      targetGoal: targetGoal.trim(),
      targetRole: synthesis.targetRole,
      matchPercentage: synthesis.matchPercentage,
      currentSkills: studentSkills,
      missingSkills: synthesis.missingSkills,
      roadmapTimeline: synthesis.roadmapTimeline,
      recommendedProjects: synthesis.recommendedProjects,
      dsaFocusTopics: synthesis.dsaFocusTopics,
      interviewPrepTips: synthesis.interviewPrepTips
    });

    res.status(201).json({
      success: true,
      message: `AI Career Roadmap generated via ${synthesis.provider || "CareerForge fallback"} and saved to MongoDB!`,
      roadmap: roadmapDoc
    });

  } catch (error) {
    console.error("Error generating career roadmap:", error);
    res.status(500).json({ message: "Failed to generate AI career roadmap" });
  }
};

// 2. Get Latest Persisted Roadmap (Protected)
const getLatestRoadmap = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const latestRoadmap = await Roadmap.findOne({ studentId }).sort({ createdAt: -1 });

    if (!latestRoadmap) {
      return res.status(200).json({ success: true, roadmap: null });
    }

    res.status(200).json({ success: true, roadmap: latestRoadmap });
  } catch (error) {
    console.error("Error fetching latest roadmap:", error);
    res.status(500).json({ message: "Failed to fetch latest career roadmap" });
  }
};

// 3. Get Roadmap History (Protected)
const getRoadmapHistory = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const history = await Roadmap.find({ studentId }).sort({ createdAt: -1 }).limit(10);

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    console.error("Error fetching roadmap history:", error);
    res.status(500).json({ message: "Failed to fetch career roadmap history" });
  }
};

module.exports = {
  generateRoadmapPreview,
  answerCareerQuestionPreview,
  answerCareerQuestionAuthenticated,
  generateAndSaveRoadmap,
  getLatestRoadmap,
  getRoadmapHistory
};
