import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Compass, 
  Code, 
  Kanban, 
  Award, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Building, 
  Calendar
} from 'lucide-react';

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
    { id: 'drives-mgmt', label: 'Drive Management', icon: Calendar },
    { id: 'companies-mgmt', label: 'Partner Companies', icon: Building }
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
      <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-61px)] p-4 hidden md:block shrink-0">
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
