import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  X,
  Send,
  Users,
  Award
} from 'lucide-react';
import { calculateJobMatch } from '../../utils/aiServices';

export default function JobSearch({ student, jobs, applications, setApplications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All'); // All, Job, Internship
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [appliedSuccessMsg, setAppliedSuccessMsg] = useState(null);

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesRole = selectedRole === 'All' || job.roleCategory === selectedRole;
    return matchesSearch && matchesType && matchesRole;
  });

  const handleApplyJob = async (job) => {
    const isAlreadyApplied = applications.some(a => a.jobId === job.id);
    if (isAlreadyApplied) {
      setAppliedSuccessMsg(`You have already applied for ${job.title} at ${job.company}!`);
      setTimeout(() => setAppliedSuccessMsg(null), 3000);
      return;
    }

    const matchScore = calculateJobMatch(student.skills, job.skillsRequired);

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      company: job.company,
      title: job.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Applied",
      currentRound: "Resume Screening",
      nextStepDate: "Under Review",
      matchScore: matchScore,
      location: job.location
    };

    try {
      const savedUser = JSON.parse(localStorage.getItem('careerforge_auth_user') || '{}');
      if (savedUser.token) {
        await fetch("http://localhost:5000/api/jobs/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${savedUser.token}`
          },
          body: JSON.stringify({ jobId: job.id, matchScore })
        });
      }
    } catch {
      // Backend offline, fallback to local state
    }

    setApplications([newApp, ...applications]);
    setAppliedSuccessMsg(`🎉 Successfully applied for ${job.title} at ${job.company}! Recruiter will review your ATS score.`);
    setSelectedJobModal(null);
    setTimeout(() => setAppliedSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {appliedSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{appliedSuccessMsg}</span>
          </div>
          <button onClick={() => setAppliedSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Job Recommendation Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Campus Placement & Internship Opportunities</h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore verified corporate placement drives. AI scores each posting against your verified skills.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl text-xs text-indigo-300">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Active Profile Skills: <strong>{student.skills.length} Skills</strong></span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="flex-1 flex items-center bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 focus-within:border-indigo-500">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, company, or tech stack (e.g. Java, React, Google)..."
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          {/* Role Category Selector */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900/80 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Role Categories</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Java Developer">Java Developer</option>
          </select>

          {/* Type Selector Pills */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
            {['All', 'Job', 'Internship'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedType === t ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'All' ? 'All Opportunities' : t + 's'}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Jobs Listing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map(job => {
          const matchPercent = calculateJobMatch(student.skills, job.skillsRequired);
          const isApplied = applications.some(a => a.jobId === job.id);

          return (
            <div key={job.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 p-2 border border-slate-700 flex items-center justify-center shrink-0">
                      <img src={job.logo} alt={job.company} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm hover:text-indigo-400 transition-colors">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.company} • <span className="text-slate-300 font-medium">{job.location}</span></p>
                    </div>
                  </div>

                  {/* AI Match Badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    matchPercent >= 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    matchPercent >= 70 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {matchPercent}% Skill Match
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Job Key Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="bg-slate-900 text-indigo-400 font-semibold px-2.5 py-1 rounded-lg border border-slate-800">
                    {job.ctc || job.stipend}
                  </span>
                  <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                    Min CGPA: {job.minCgpa}
                  </span>
                  <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                    {job.workMode}
                  </span>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.skillsRequired.map((skill, i) => {
                    const isMatched = student.skills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        isMatched 
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-medium' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isMatched ? `✓ ${skill}` : skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Apply by {job.deadline}
                </span>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedJobModal(job)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleApplyJob(job)}
                    disabled={isApplied}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                      isApplied 
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : '1-Click Apply'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detailed Job Modal */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-xl bg-slate-800 p-2.5 border border-slate-700 flex items-center justify-center">
                  <img src={selectedJobModal.logo} alt={selectedJobModal.company} className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedJobModal.title}</h2>
                  <p className="text-xs text-slate-400">{selectedJobModal.company} • {selectedJobModal.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedJobModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Package / Stipend</span>
                <span className="font-bold text-indigo-400">{selectedJobModal.ctc || selectedJobModal.stipend}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Eligibility CGPA</span>
                <span className="font-bold text-white">{selectedJobModal.minCgpa}+ CGPA</span>
              </div>
              <div>
                <span className="text-slate-500 block">Work Mode</span>
                <span className="font-bold text-white">{selectedJobModal.workMode}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">Job Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedJobModal.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Selection Process Rounds</h4>
              <div className="space-y-1.5">
                {selectedJobModal.rounds.map((round, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs p-2 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{round}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button onClick={() => setSelectedJobModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
                Close
              </button>
              <button 
                onClick={() => handleApplyJob(selectedJobModal)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Application With ATS Resume
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
