import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Building2, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Send,
  Zap
} from 'lucide-react';
import { API_URL } from '../../utils/api';

export default function PostJob({ jobs, setJobs, setActiveTab }) {
  const [formData, setFormData] = useState({
    title: 'Backend Software Engineer',
    type: 'Job',
    roleCategory: 'Backend Developer',
    location: 'Bangalore / Remote',
    workMode: 'Hybrid',
    ctc: '₹20.0 LPA',
    stipend: '',
    minCgpa: 7.5,
    skillsRequired: 'Java, Spring Boot, MySQL, REST APIs, Microservices',
    deadline: '2026-08-30',
    description: 'We are seeking a high-performing Backend Software Engineer to build scalable microservices and APIs.'
  });

  const [successToast, setSuccessToast] = useState(false);

  const handleEnhanceWithAI = () => {
    setFormData(prev => ({
      ...prev,
      description: `${prev.description}\n\nKey Responsibilities:\n• Architect low-latency RESTful APIs using Spring Boot and Java 17.\n• Optimize MySQL database indexing and cache layers using Redis.\n• Implement microservice security with OAuth2 & JWT tokens.`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newJob = {
      id: `job-${Date.now()}`,
      company: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      title: formData.title,
      type: formData.type,
      roleCategory: formData.roleCategory,
      location: formData.location,
      workMode: formData.workMode,
      ctc: formData.ctc,
      stipend: formData.stipend,
      minCgpa: parseFloat(formData.minCgpa),
      allowedBranches: ["CSE", "IT", "ECE"],
      skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
      postedDate: new Date().toISOString().split('T')[0],
      deadline: formData.deadline,
      applicantsCount: 0,
      description: formData.description,
      rounds: ["Online Coding Test", "Technical Interview I", "HR Round"]
    };

    try {
      const savedUser = JSON.parse(localStorage.getItem('careerforge_auth_user') || '{}');
      if (savedUser.token) {
        await fetch(`${API_URL}/api/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${savedUser.token}`
          },
          body: JSON.stringify(newJob)
        });
      }
    } catch {
      // Backend offline, fallback to local state
    }

    setJobs([newJob, ...jobs]);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setActiveTab('company-dashboard');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>🎉 Placement Drive Posting Published Successfully! Redirecting to Recruiter Overview...</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs mb-1">
            <Building2 className="w-4 h-4" />
            <span>Recruiter Job Creation Wizard</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Post New Job or Internship Drive</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish opening criteria for eligible campus students. AI will index your listing and match qualified profiles.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Job / Internship Title</label>
            <input 
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Opportunity Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Job">Full Time Job</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Location</label>
            <input 
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">CTC / Stipend Package</label>
            <input 
              type="text"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              placeholder="e.g. ₹20.0 LPA or ₹60,000 / month"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Minimum CGPA Requirement</label>
            <input 
              type="number"
              step="0.1"
              value={formData.minCgpa}
              onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Application Deadline</label>
            <input 
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">Required Skills (Comma separated)</label>
          <input 
            type="text"
            value={formData.skillsRequired}
            onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
            placeholder="Java, Spring Boot, MySQL, REST APIs"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">Detailed Job Description</label>
            <button 
              type="button" 
              onClick={handleEnhanceWithAI}
              className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Enhance JD with AI
            </button>
          </div>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
          ></textarea>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Publish Placement Drive Posting
          </button>
        </div>

      </form>

    </div>
  );
}
