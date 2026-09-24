import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Search,
  Send,
  Sparkles,
  Users,
  X,
  XCircle
} from 'lucide-react';
import React, { useState } from 'react';
import { API_URL } from '../../utils/api';

export default function ManageApplicants({ applications, setApplications }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [interviewTime, setInterviewTime] = useState("2026-08-12T10:00");
  const [interviewRound, setInterviewRound] = useState("Technical Round 1 (DSA & Systems)");
  const [toastMsg, setToastMsg] = useState(null);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('careerforge_auth_user') || '{}');
      if (savedUser.token) {
        await fetch(`${API_URL}/api/jobs/applications/${appId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${savedUser.token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
      }
    } catch {
      // Backend offline, fallback to local state
    }

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    setToastMsg(`Application status updated to '${newStatus}'!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!scheduleModalApp) return;

    const formattedDate = interviewTime.replace("T", " ");

    try {
      const savedUser = JSON.parse(localStorage.getItem('careerforge_auth_user') || '{}');
      if (savedUser.token) {
        await fetch(`${API_URL}/api/jobs/applications/${scheduleModalApp.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${savedUser.token}`
          },
          body: JSON.stringify({
            status: "Interview Scheduled",
            currentRound: interviewRound,
            nextStepDate: formattedDate
          })
        });
      }
    } catch {
      // Backend offline, fallback to local state
    }

    setApplications(prev => prev.map(a => 
      a.id === scheduleModalApp.id ? { 
        ...a, 
        status: "Interview Scheduled", 
        currentRound: interviewRound,
        nextStepDate: formattedDate
      } : a
    ));

    setToastMsg(`📅 Interview scheduled with candidate for ${formattedDate}!`);
    setScheduleModalApp(null);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold text-xs flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-purple-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-semibold text-xs mb-1">
            <Users className="w-4 h-4" />
            <span>AI Resume ATS Candidate Screening</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Candidate Screening & Application Reviews</h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate candidate ATS scores, view parsed skill trees, shortlist top performers, and schedule technical rounds.
          </p>
        </div>
      </div>

      {/* Candidates Table Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Candidate Name</th>
                <th className="p-3.5">Target Position</th>
                <th className="p-3.5">AI ATS Match Score</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
                        AV
                      </div>
                      <div>
                        <span className="font-bold text-white block">Aesha Narola</span>
                        <span className="text-[10px] text-slate-400">CS2026-084 • CGPA: 8.85</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-medium text-slate-200">
                    {app.title}
                  </td>

                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px]">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> {app.matchScore}% Score
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      app.status === 'Shortlisted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      app.status === 'Interview Scheduled' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setSelectedCandidate(app)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      View Resume
                    </button>

                    <button
                      onClick={() => setScheduleModalApp(app)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Schedule Interview
                    </button>

                    <button
                      onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-semibold"
                    >
                      Shortlist ✓
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Candidate Resume Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Aesha Narola - Candidate Profile</h3>
                <p className="text-xs text-slate-400">Roll No: CS2026-084 • Branch: Computer Science & Engineering • CGPA: 8.85</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">Verified Core Skills</h4>
              <p className="text-slate-300 font-medium leading-relaxed">
                Java, Spring Boot, React.js, MySQL, JavaScript, Data Structures & Algorithms, REST APIs, Microservices, Git, Tailwind CSS
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">Recent Capstone Projects</h4>
              <p className="text-white font-bold">1. Smart Placement Portal (React, Node.js, MongoDB)</p>
              <p className="text-slate-400">Centralized campus placement web application with real-time AI resume parsing engine.</p>

              <p className="text-white font-bold pt-1">2. Microservices E-Commerce API (Java, Spring Boot, Redis)</p>
              <p className="text-slate-400">High-throughput RESTful services with Spring Security OAuth2 integration.</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedCandidate(null)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleScheduleInterview} className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Schedule Technical Interview
              </h3>
              <button type="button" onClick={() => setScheduleModalApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Interview Round Type</label>
              <input
                type="text"
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Date & Time (IST)</label>
              <input
                type="datetime-local"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button type="button" onClick={() => setScheduleModalApp(null)} className="px-4 py-2 text-xs font-semibold text-slate-400">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md">
                Confirm & Send Invite
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
