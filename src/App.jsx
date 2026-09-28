import { AuthProvider, useAuth } from './context/AuthContext';
import { INITIAL_APPLICATIONS, INITIAL_JOBS, INITIAL_STUDENT_PROFILE } from './data/mockData';
import React, { Suspense, lazy, useEffect, useState } from 'react';

import { API_URL } from './utils/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Data & Utils






const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ResumeAnalyzer = lazy(() => import('./pages/student/ResumeAnalyzer'));
const JobSearch = lazy(() => import('./pages/student/JobSearch'));
const CareerGuidance = lazy(() => import('./pages/student/CareerGuidance'));
const DsaPractice = lazy(() => import('./pages/student/DsaPractice'));
const ApplicationTracker = lazy(() => import('./pages/student/ApplicationTracker'));
const SkillsCertifications = lazy(() => import('./pages/student/SkillsCertifications'));
const CompanyDashboard = lazy(() => import('./pages/company/CompanyDashboard'));
const PostJob = lazy(() => import('./pages/company/PostJob'));
const ManageApplicants = lazy(() => import('./pages/company/ManageApplicants'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement'));
const PlacementDrives = lazy(() => import('./pages/admin/PlacementDrives'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
        Loading workspace…
      </div>
    </div>
  );
}

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
        const isRecruiter = user?.role === 'company';
        const endpoint = isRecruiter ? `${API_URL}/api/jobs/mine` : `${API_URL}/api/jobs`;
        const res = await fetch(endpoint, user?.token ? {
          headers: { Authorization: `Bearer ${user.token}` }
        } : undefined);
        const data = await res.json();
        if (res.ok && Array.isArray(data.jobs)) {
          setJobs(data.jobs.map((job) => ({ ...job, id: job._id || job.id })));
        }
      } catch {
        if (user?.role === 'company') setJobs([]);
      }
    }
    loadBackendData();
  }, [user?.role, user?.token]);

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
          setApplications(data.applications.map((application) => ({
            ...application,
            id: application._id || application.id,
            jobId: String(application.jobId)
          })));
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
      if (!['admin-dashboard', 'student-mgmt', 'drives-mgmt'].includes(activeTab)) {
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
            const res = await fetch(`${API_URL}/api/student/profile`, {
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
          course: user.course || prev.course,
          branch: user.branch || prev.branch
        }));
      }
    }
    fetchStudentProfile();
  }, [user]);

  // If user is not authenticated, render the Auth login/register page
  if (!isAuthenticated) {
    return <Suspense fallback={<PageLoader />}><AuthPage /></Suspense>;
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
          <Suspense fallback={<PageLoader />}>{renderContent()}</Suspense>
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
