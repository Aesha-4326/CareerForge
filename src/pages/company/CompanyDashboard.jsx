import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CompanyDashboard({ jobs, applications, setActiveTab }) {
  const { user } = useAuth();
  const activeJobsCount = jobs.length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length;

  return (
    <div className="space-y-6">
      
      {/* Recruiter Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs mb-1">
              <Building2 className="w-4 h-4" />
              <span>{user?.companyName || user?.name || 'Recruiter'} Recruitment Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Recruiter Dashboard & Talent Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage drive openings, screen AI ATS scores, filter candidate profiles, and schedule technical interviews.
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('post-job')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Post New Opening
          </button>
        </div>
      </div>

      {/* Recruiter KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Openings</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{activeJobsCount}</span>
            <span className="text-xs text-purple-400 font-medium">Your postings</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Applicants</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalApplicants}</span>
            <span className="text-xs text-indigo-400 font-medium">Your candidates</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shortlisted Candidates</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{shortlistedCount}</span>
            <span className="text-xs text-emerald-400 font-medium">Your pipeline</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Active Postings & Fast Applicant Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Active Campus Openings
            </h3>
          </div>

          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">{job.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {job.type} • {job.location} • <strong className="text-indigo-400">{job.ctc || job.stipend}</strong>
                  </p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                    <span>Applicants: <strong className="text-white">{job.applicantsCount}</strong></span>
                    <span>Deadline: <strong className="text-slate-300">{job.deadline}</strong></span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('applicants')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-purple-500/30 transition-colors shrink-0"
                >
                  Manage Candidates
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Today's Scheduled Interviews
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Aesha Narola (CSE)</span>
                  <span className="text-indigo-400 font-mono font-bold">10:00 AM</span>
                </div>
                <p className="text-[11px] text-slate-400">Software Engineer (SDE-1) • Technical Round 1</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Rohan Sharma (CSE)</span>
                  <span className="text-indigo-400 font-mono font-bold">02:30 PM</span>
                </div>
                <p className="text-[11px] text-slate-400">Backend Engineer • System Design Round</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
