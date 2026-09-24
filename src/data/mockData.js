export const INITIAL_STUDENT_PROFILE = {
  name: "Aesha Narola",
  email: "aeshanarola@gmail.com",
  rollNo: "CS2026-084",
  course: "B.Tech",
  branch: "Information Technology",
  year: "4th Year (2026 Batch)",
  cgpa: 8.85,
  backlogs: 0,
  phone: "+91 98765 43210",
  location: "Surat, India",
  github: "github.com/profilename",
  linkedin: "linkedin.com/in/profilename",
  atsScore: 88,
  skills: [
    "Java", "Spring Boot", "React.js", "MySQL", "JavaScript", 
    "Data Structures & Algorithms", "Git", "REST APIs", "Tailwind CSS"
  ],
  certifications: [
    { title: "AWS Certified Developer Associate", issuer: "Amazon Web Services", date: "Jan 2026", badge: "AWS" },
    { title: "Meta Front-End Developer Professional", issuer: "Meta (Coursera)", date: "Nov 2025", badge: "Meta" },
    { title: "Oracle Certified Professional: Java SE 17", issuer: "Oracle", date: "Aug 2025", badge: "Oracle" }
  ],
  projects: [
    {
      title: "Smart Placement Portal",
      tech: "React, Node.js, MongoDB",
      description: "Centralized campus placement web application with AI resume parsing.",
      link: "github.com/profilename/placement-portal"
    },
    {
      title: "Microservices E-Commerce API",
      tech: "Java, Spring Boot, Docker, Redis",
      description: "High-throughput RESTful services for order processing and inventory management.",
      link: "github.com/profilename/spring-ecommerce"
    }
  ]
};

export const INITIAL_JOBS = [
  {
    id: "job-101",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    title: "Software Engineer - University Graduate",
    type: "Job",
    roleCategory: "Full Stack Developer",
    location: "Bangalore / Hyderabad",
    workMode: "Hybrid",
    ctc: "₹24.5 LPA",
    stipend: null,
    minCgpa: 8.0,
    allowedBranches: ["CSE", "IT", "ECE"],
    skillsRequired: ["Java", "Data Structures & Algorithms", "C++", "System Design"],
    postedDate: "2026-08-01",
    deadline: "2026-08-15",
    applicantsCount: 142,
    description: "Join Google's Core Infrastructure engineering team. You will build highly scalable global distributed systems, collaborate with cross-functional teams, and solve complex computational challenges.",
    rounds: ["Online Assessment (DSA)", "Technical Interview I", "Technical Interview II", "Googliness & Leadership"]
  },
  {
    id: "job-102",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo_%282012%29.svg",
    title: "Software Development Engineer (SDE-1)",
    type: "Job",
    roleCategory: "Backend Developer",
    location: "Hyderabad",
    workMode: "On-site",
    ctc: "₹22.0 LPA",
    stipend: null,
    minCgpa: 7.5,
    allowedBranches: ["CSE", "IT", "ECE", "EEE"],
    skillsRequired: ["Java", "Spring Boot", "MySQL", "REST APIs", "Azure"],
    postedDate: "2026-08-02",
    deadline: "2026-08-18",
    applicantsCount: 189,
    description: "Architect backend APIs, enterprise cloud microservices, and high-availability database engines for Azure cloud services.",
    rounds: ["Coding Round (LeetCode Medium)", "System Design", "Managerial & HR"]
  },
  {
    id: "job-103",
    company: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2017.svg",
    title: "Frontend Engineering Intern",
    type: "Internship",
    roleCategory: "Frontend Developer",
    location: "Noida / Remote",
    workMode: "Remote",
    ctc: null,
    stipend: "₹85,000 / month",
    minCgpa: 7.0,
    allowedBranches: ["CSE", "IT", "ECE", "MECH"],
    skillsRequired: ["React.js", "JavaScript", "Tailwind CSS", "Redux"],
    postedDate: "2026-08-03",
    deadline: "2026-08-20",
    applicantsCount: 95,
    description: "Work on Creative Cloud web interfaces using modern React ecosystem, web workers, and WebGL components.",
    rounds: ["Frontend Coding Challenge", "UI/UX & React Deep-Dive"]
  },
  {
    id: "job-104",
    company: "Razorpay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
    title: "Full Stack Engineer Intern",
    type: "Internship",
    roleCategory: "Full Stack Developer",
    location: "Bangalore",
    workMode: "Hybrid",
    ctc: null,
    stipend: "₹65,000 / month",
    minCgpa: 7.0,
    allowedBranches: ["CSE", "IT"],
    skillsRequired: ["React.js", "Java", "Spring Boot", "MySQL", "REST APIs"],
    postedDate: "2026-08-04",
    deadline: "2026-08-22",
    applicantsCount: 110,
    description: "Build next-generation fintech checkout experiences and merchant onboarding dashboards with real-time analytics.",
    rounds: ["Take-home Fullstack Assignment", "Technical Discussion", "Founder's Round"]
  },
  {
    id: "job-105",
    company: "Zomato",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
    title: "Backend Engineer - Java/Golang",
    type: "Job",
    roleCategory: "Java Developer",
    location: "Gurugram",
    workMode: "On-site",
    ctc: "₹18.0 LPA",
    stipend: null,
    minCgpa: 6.5,
    allowedBranches: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    skillsRequired: ["Java", "Spring Boot", "MySQL", "Redis", "Kafka"],
    postedDate: "2026-08-05",
    deadline: "2026-08-25",
    applicantsCount: 78,
    description: "Power high-volume real-time delivery routing and transactional engines servicing millions of daily orders.",
    rounds: ["Online Assessment", "Data Structures Round", "Low Level Design (LLD)"]
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    jobId: "job-102",
    company: "Microsoft",
    title: "Software Development Engineer (SDE-1)",
    appliedDate: "2026-08-03",
    status: "Shortlisted", // Applied, Shortlisted, Interview Scheduled, Offer Received, Rejected
    currentRound: "Technical Interview I",
    nextStepDate: "2026-08-10 (10:00 AM IST)",
    matchScore: 92,
    location: "Hyderabad"
  },
  {
    id: "app-2",
    jobId: "job-104",
    company: "Razorpay",
    title: "Full Stack Engineer Intern",
    appliedDate: "2026-08-04",
    status: "Interview Scheduled",
    currentRound: "Technical Discussion",
    nextStepDate: "2026-08-08 (02:30 PM IST)",
    matchScore: 88,
    location: "Bangalore"
  },
  {
    id: "app-3",
    jobId: "job-101",
    company: "Google",
    title: "Software Engineer - University Graduate",
    appliedDate: "2026-08-02",
    status: "Applied",
    currentRound: "Resume Screening",
    nextStepDate: "Awaiting Schedule",
    matchScore: 86,
    location: "Bangalore / Hyderabad"
  }
];

export const MOCK_COMPANIES = [
  {
    id: "comp-1",
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    industry: "Technology / Internet",
    hiredCount: 14,
    avgPackage: "₹24.0 LPA",
    status: "Approved",
    contactPerson: "Sarah Jenkins (University Recruiter)",
    email: "sarah.j@google.com"
  },
  {
    id: "comp-2",
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo_%282012%29.svg",
    industry: "Cloud & Enterprise Software",
    hiredCount: 22,
    avgPackage: "₹21.5 LPA",
    status: "Approved",
    contactPerson: "David Miller (College Hiring)",
    email: "d.miller@microsoft.com"
  },
  {
    id: "comp-3",
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_2017.svg",
    industry: "Digital Media & Cloud",
    hiredCount: 8,
    avgPackage: "₹19.0 LPA",
    status: "Approved",
    contactPerson: "Priya Sharma (Talent Acquisition)",
    email: "psharma@adobe.com"
  },
  {
    id: "comp-4",
    name: "Swiggy",
    logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    industry: "E-Commerce / FoodTech",
    hiredCount: 15,
    avgPackage: "₹16.5 LPA",
    status: "Approved",
    contactPerson: "Karan Patel (Campus Lead)",
    email: "karan.p@swiggy.in"
  }
];

export const PLACEMENT_STATS = {
  totalStudents: 450,
  placedStudents: 368,
  placementPercentage: 81.7,
  highestPackage: "₹45.0 LPA",
  averagePackage: "₹14.2 LPA",
  totalOffers: 420,
  drivesCompleted: 38,
  upcomingDrives: 6,
  departmentBreakdown: [
    { department: "CSE", total: 180, placed: 162, percentage: 90.0, avgSalary: 16.8 },
    { department: "IT", total: 120, placed: 105, percentage: 87.5, avgSalary: 15.2 },
    { department: "CE", total: 90, placed: 68, percentage: 75.5, avgSalary: 11.5 },
    { department: "ITE", total: 40, placed: 23, percentage: 57.5, avgSalary: 9.8 },
    { department: "AI/ML", total: 20, placed: 10, percentage: 50.0, avgSalary: 8.2 }
  ],
  packageRanges: [
    { range: "< 6 LPA", count: 25 },
    { range: "6 - 10 LPA", count: 85 },
    { range: "10 - 18 LPA", count: 175 },
    { range: "18 - 25 LPA", count: 65 },
    { range: "> 25 LPA", count: 18 }
  ]
};

export const MOCK_STUDENT_ROSTER = [
  { id: "S01", name: "Aesha Narola", rollNo: "23SE02IT119", branch: "IT", cgpa: 8.85, status: "In Process", company: "-", package: "-" },
  { id: "S02", name: "Rohan Sharma", rollNo: "23SE02AI101", branch: "AI/ML", cgpa: 9.2, status: "Placed", company: "Google", package: "₹24.5 LPA" },
  { id: "S03", name: "Ananya Pande", rollNo: "23SE02IT118", branch: "IT", cgpa: 8.7, status: "Placed", company: "Microsoft", package: "₹22.0 LPA" },
  { id: "S04", name: "Viram Malhotra", rollNo: "23SE02CS090", branch: "CE", cgpa: 7.9, status: "Placed", company: "Adobe", package: "₹19.0 LPA" },
  { id: "S05", name: "Sneha Dudhat", rollNo: "23SE02CSE110", branch: "CSE", cgpa: 8.4, status: "Unplaced", company: "-", package: "-" },
  { id: "S06", name: "Rahul Jariwala", rollNo: "23SE02ITE030", branch: "ITE", cgpa: 8.1, status: "In Process", company: "-", package: "-" }
];