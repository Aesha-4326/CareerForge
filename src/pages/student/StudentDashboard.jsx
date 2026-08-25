import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight,
  Flame,
  FileCheck,
  Zap,
  Target
} from 'lucide-react';

export default function StudentDashboard({ student, jobs, applications, setActiveTab }) {
  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Placement Drive 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="solid-accent">{student.name}</span>! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Computer Science & Engineering • Roll No: {student.rollNo} • CGPA: {student.cgpa}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-400">DSA Daily Streak</p>
              <p className="text-base font-bold text-white">12 Days 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ATS Score Card */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI ATS Score</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{student.atsScore}%</span>
            <span className="text-xs text-emerald-400 font-medium">Ready for Top MNCs</span>
          </div>
          <button 
            onClick={() => setActiveTab('resume')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            Optimize Resume <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Applications Sent */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Applications Tracked</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{applications.length}</span>
            <span className="text-xs text-indigo-400 font-medium">Active Pipelines</span>
          </div>
          <button 
            onClick={() => setActiveTab('tracker')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            View Pipeline <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Next Interview */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming Interview</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-sm font-bold text-white truncate">Microsoft - SDE-1</p>
            <p className="text-xs text-slate-400 mt-0.5">Aug 10, 10:00 AM</p>
          </div>
          <span className="mt-3 inline-block text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
            Technical Round 1
          </span>
        </div>

        {/* Career Readiness Index */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Placement Readiness</span>
            <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">92%</span>
            <span className="text-xs text-pink-400 font-medium">Top 5% Student</span>
          </div>
          <button 
            onClick={() => setActiveTab('guidance')}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            AI Guidance <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Main Grid: AI Job Recommendations & Recent Application Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Recommended Jobs For You
            </h3>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Explore All <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map(job => (
              <div key={job.id} className="glass-card p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-2 border border-slate-700 flex items-center justify-center shrink-0">
                    <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-100 text-sm hover:text-indigo-400 transition-colors">{job.title}</h4>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        92% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-slate-300">{job.company}</span> • <span>{job.location}</span> • <span className="text-indigo-400 font-medium">{job.ctc || job.stipend}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {job.skillsRequired.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('jobs')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
                >
                  Quick Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Application Status & Quick DSA */}
        <div className="space-y-6">
          
          {/* Status Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Active Applications Tracker
            </h3>
            
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{app.company}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      app.status === 'Shortlisted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      app.status === 'Interview Scheduled' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{app.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick DSA Challenge */}
          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-2">
              <Zap className="w-4 h-4" />
              <span>Problem of the Day</span>
            </div>
            <h4 className="text-sm font-bold text-white">146. LRU Cache</h4>
            <p className="text-xs text-slate-400 mt-1">Design a data structure that supports get and put operations in O(1) time complexity.</p>
            
            <button 
              onClick={() => setActiveTab('dsa')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              Solve in Coding Hub
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
