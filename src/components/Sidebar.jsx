import {
  Award,
  BarChart3,
  Briefcase,
  Calendar,
  Code,
  Compass,
  FileText,
  Kanban,
  LayoutDashboard,
  PlusCircle,
  Users
} from 'lucide-react';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
  const { user } = useAuth();
  const activeRole = user?.role || 'student';
  
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume', label: 'AI Resume & ATS', icon: FileText, badge: 'AI' },
    { id: 'jobs', label: 'Jobs & Internships', icon: Briefcase },
    { id: 'guidance', label: 'AI Career Guidance', icon: Compass, badge: 'AI' },
    { id: 'dsa', label: 'DSA & Coding Hub', icon: Code },
    { id: 'tracker', label: 'Application Tracker', icon: Kanban },
    { id: 'skills', label: 'Skills & Badges', icon: Award }
  ];

  const companyNavItems = [
    { id: 'company-dashboard', label: 'Recruiter Overview', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post Job / Internship', icon: PlusCircle },
    { id: 'applicants', label: 'Manage Candidates', icon: Users }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Placement Analytics', icon: BarChart3 },
    { id: 'student-mgmt', label: 'Manage Students', icon: Users },
    { id: 'drives-mgmt', label: 'Drive Management', icon: Calendar }
  ];

  const navItems = activeRole === 'student' 
    ? studentNavItems 
    : activeRole === 'company' 
    ? companyNavItems 
    : adminNavItems;

  const renderNavList = () => (
    <div className="space-y-1.5">
      <div className="mb-4 px-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {activeRole === 'student' ? 'Student Workspace' : activeRole === 'company' ? 'Recruiter Suite' : 'TPO Admin Portal'}
        </h3>
      </div>
      <nav className="space-y-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                isActive
                  ? 'bg-slate-800/80 text-white border-blue-500 shadow-md shadow-blue-500/10 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-[61px] h-[calc(100vh-61px)] w-64 glass-panel border-r border-slate-800/80 p-4 hidden md:block shrink-0 self-start overflow-y-auto">
        {renderNavList()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
          ></div>
          <div className="relative flex-1 max-w-xs w-full glass-panel border-r border-slate-800 p-4 z-10 flex flex-col justify-between">
            {renderNavList()}
          </div>
        </div>
      )}
    </>
  );
}
