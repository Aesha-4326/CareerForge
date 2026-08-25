import { AuthProvider, useAuth } from './context/AuthContext';
// Data & Utils
import { INITIAL_APPLICATIONS, INITIAL_JOBS, INITIAL_STUDENT_PROFILE } from './data/mockData';
import React, { useEffect, useState } from 'react';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicationTracker from './pages/student/ApplicationTracker';
import AuthPage from './pages/auth/AuthPage';
import CareerGuidance from './pages/student/CareerGuidance';
// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import DsaPractice from './pages/student/DsaPractice';
import JobSearch from './pages/student/JobSearch';
import ManageApplicants from './pages/company/ManageApplicants';
import Navbar from './components/Navbar';
import PlacementDrives from './pages/admin/PlacementDrives';
import PostJob from './pages/company/PostJob';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import Sidebar from './components/Sidebar';
import SkillsCertifications from './pages/student/SkillsCertifications';
// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentManagement from './pages/admin/StudentManagement';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function MainContent() {
  const { user, isAuthenticated } = useAuth();
  
  // Application State
  const [student, setStudent] = useState(INITIAL_STUDENT_PROFILE);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge-theme') || 'light');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('careerforge-theme', theme);
  }, [theme]);

  // Fetch jobs from backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch(`${API_URL}/api/jobs`);
        const data = await res.json();
        if (res.ok && data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      } catch {
        // Backend offline, keep local initial jobs
      }
    }
    loadBackendData();
  }, []);

  // Always replace shared demo applications with the server-scoped list.
  useEffect(() => {
    let isCurrentUser = true;
    setApplications([]);

    async function loadApplications() {
      if (!user?.token) return;

      try {
        const res = await fetch(`${API_URL}/api/jobs/applications`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (isCurrentUser && res.ok && Array.isArray(data.applications)) {
          setApplications(data.applications);
        }
      } catch {
        // Keep the list empty when the scoped API is unavailable.
      }
    }

    loadApplications();
    return () => {
      isCurrentUser = false;
    };
  }, [user]);

  // Sync active default tab whenever logged in user's role changes
  useEffect(() => {
    if (user?.role === 'student') {
      if (!['dashboard', 'resume', 'jobs', 'guidance', 'dsa', 'tracker', 'skills'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (user?.role === 'company') {
      if (!['company-dashboard', 'post-job', 'applicants'].includes(activeTab)) {
        setActiveTab('company-dashboard');
      }
    } else if (user?.role === 'admin') {
      if (!['admin-dashboard', 'student-mgmt', 'drives-mgmt', 'companies-mgmt'].includes(activeTab)) {
        setActiveTab('admin-dashboard');
      }
    }
  }, [user?.role, activeTab]);

  // Personalize student profile data with logged-in user details if user is a student
  useEffect(() => {
    async function fetchStudentProfile() {
      if (user && user.role === 'student') {
        if (user.token) {
          try {
            const res = await fetch("http://localhost:5000/api/student/profile", {
              headers: { "Authorization": `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok && data.student) {
              setStudent(data.student);
              return;
            }
          } catch {
            // Fallback to local profile merge
          }
        }
        setStudent(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          rollNo: user.rollNo || prev.rollNo,
          branch: user.branch || prev.branch
        }));
      }
    }
    fetchStudentProfile();
  }, [user]);

  // If user is not authenticated, render the Auth login/register page
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const activeRole = user.role;

  const renderContent = () => {
    // Role-Based Access Boundaries
    if (activeRole === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard student={student} jobs={jobs} applications={applications} setActiveTab={setActiveTab} />;
        case 'resume':
          return <ResumeAnalyzer student={student} setStudent={setStudent} />;
        case 'jobs':
          return <JobSearch student={student} jobs={jobs} applications={applications} setApplications={setApplications} />;
        case 'guidance':
          return <CareerGuidance student={student} />;
        case 'dsa':
          return <DsaPractice />;
        case 'tracker':
          return <ApplicationTracker applications={applications} />;
        case 'skills':
          return <SkillsCertifications student={student} setStudent={setStudent} />;
        default:
          return <StudentDashboard student={student} jobs={jobs} applications={applications} setActiveTab={setActiveTab} />;
      }
    } else if (activeRole === 'company') {
      switch (activeTab) {
        case 'company-dashboard':
          return <CompanyDashboard jobs={jobs} applications={applications} setActiveTab={setActiveTab} />;
        case 'post-job':
          return <PostJob jobs={jobs} setJobs={setJobs} setActiveTab={setActiveTab} />;
        case 'applicants':
          return <ManageApplicants applications={applications} setApplications={setApplications} />;
        default:
          return <CompanyDashboard jobs={jobs} applications={applications} setActiveTab={setActiveTab} />;
      }
    } else if (activeRole === 'admin') {
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminDashboard />;
        case 'student-mgmt':
          return <StudentManagement />;
        case 'drives-mgmt':
        case 'companies-mgmt':
          return <PlacementDrives />;
        default:
          return <AdminDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col selection:bg-[var(--primary)] selection:text-white">
      {/* Navigation Header */}
      <Navbar 
        unreadNotifications={unreadNotifications} 
        setUnreadNotifications={setUnreadNotifications} 
        theme={theme}
        setTheme={setTheme}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Protected Dynamic Main Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
