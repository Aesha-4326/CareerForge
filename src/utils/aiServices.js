/**
 * CareerForge AI Engine Utilities
 * Simulates intelligent NLP resume parsing, job matching algorithms, and learning roadmap synthesis.
 */

// 1. AI Resume ATS Scoring & Content Analysis
export function analyzeResumeContent(resumeText, targetRole = "Full Stack Engineer") {
  const text = (resumeText || "").toLowerCase();
  const hasNumbers = /\b\d+(?:%|\+|x)?\b/.test(text);
  const hasSummary = /\b(summary|objective|profile|about me)\b/.test(text);
  
  // Keyword dictionary checks
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

  // Matches
  const matchedKeywords = technicalKeywords.filter(kw => text.includes(kw));
  const matchedVerbs = actionVerbs.filter(verb => text.includes(verb));
  const sectionChecks = requiredSections.map(sec => ({
    name: sec.name,
    present: sec.pattern.test(text)
  }));

  // Calculations
  const keywordScore = Math.min(100, Math.round((matchedKeywords.length / 12) * 100));
  const verbScore = Math.min(100, Math.round((matchedVerbs.length / 8) * 100));
  const sectionScore = Math.round((sectionChecks.filter(s => s.present).length / requiredSections.length) * 100);
  const impactScore = hasNumbers ? 100 : 25;
  
  // Final Weighted ATS Score
  const overallATSScore = Math.round((keywordScore * 0.35) + (sectionScore * 0.30) + (verbScore * 0.20) + (impactScore * 0.15));

  // Key Suggestions
  const suggestions = [];
  if (!sectionChecks[0].present) {
    suggestions.push({ type: "critical", title: "Fix Contact Information", desc: "Add a professional email, phone number, LinkedIn URL, and GitHub URL in a simple one-line header." });
  }
  if (!hasSummary) {
    suggestions.push({ type: "critical", title: "Add a Professional Summary", desc: `Write a 2-3 line summary focused on your target role${targetRole ? ` (${targetRole})` : ""}, strongest skills, and measurable value.` });
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
  if (!sectionChecks.find(s => s.name.includes("Projects")).present) {
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
    keywordMatchRate: `${Math.min(100, matchedKeywords.length * 10)}%`,
    foundKeywords: matchedKeywords.map(k => k.toUpperCase()),
    missingKeywords: ["DOCKER", "KUBERNETES", "REDIS", "SYSTEM DESIGN"].filter(k => !matchedKeywords.includes(k.toLowerCase())),
    actionVerbsScore: `${verbScore}%`,
    sectionChecks,
    suggestions
  };
}

// 2. AI Job & Role Recommendation Engine
export function calculateJobMatch(studentSkills = [], jobSkills = []) {
  if (!jobSkills || jobSkills.length === 0) return 80;
  
  const normalizedStudent = studentSkills.map(s => s.toLowerCase().trim());
  const matched = jobSkills.filter(js => 
    normalizedStudent.some(ss => ss.includes(js.toLowerCase()) || js.toLowerCase().includes(ss))
  );

  const baseRatio = matched.length / jobSkills.length;
  // Dynamic boost for overlap
  const percentage = Math.round(baseRatio * 70 + 25);
  return Math.min(99, Math.max(50, percentage));
}

// 3. AI Career Guidance & Roadmap Generator
export function generateCareerRoadmap(targetGoal = "Java Full Stack Developer", currentSkills = []) {
  const goal = targetGoal.toLowerCase();
  
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
    matchPercentage = 75;
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
    matchPercentage = 70;
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
    currentSkills,
    missingSkills,
    roadmapTimeline,
    recommendedProjects,
    dsaFocusTopics,
    interviewPrepTips
  };
}
