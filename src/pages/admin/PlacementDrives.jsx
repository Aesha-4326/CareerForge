import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle,
  Trash2,
  X
} from 'lucide-react';
import { MOCK_COMPANIES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';

export default function PlacementDrives() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [driveTitle, setDriveTitle] = useState('');
  const [ctc, setCtc] = useState('');

  const loadDrives = async () => {
    if (user && user.token) {
      try {
        const res = await fetch(`${API_URL}/api/admin/drives`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok && data.drives) {
          const formatted = data.drives.map(d => ({
            id: d._id,
            name: d.companyName,
            logo: d.logo,
            industry: d.industry || "Technology",
            hiredCount: d.appliedCount || 0,
            avgPackage: d.ctc || "12 LPA",
            contactPerson: "TPO Coordinator",
            email: "tpo@careerforge.edu",
            status: d.status || "Upcoming"
          }));
          setCompanies(formatted);
        }
      } catch {
        // Fallback to mock
      }
    }
  };

  useEffect(() => {
    loadDrives();
  }, [user]);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !driveTitle.trim()) return;

    setIsSubmitting(true);
    if (user && user.token) {
      try {
        const res = await fetch(`${API_URL}/api/admin/drives`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({
            companyName: companyName.trim(),
            driveTitle: driveTitle.trim(),
            industry: industry.trim() || "Cloud & Software",
            ctc: ctc.trim() || "14 LPA",
            status: "Upcoming"
          })
        });
        if (res.ok) {
          await loadDrives();
          setShowModal(false);
          setCompanyName('');
          setIndustry('');
          setDriveTitle('');
          setCtc('');
        }
      } catch {
        // Backend offline fallback
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!user || !user.token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/drives/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      if (res.ok) {
        setCompanies(prev => prev.filter(c => c.id !== id));
      }
    } catch {
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs mb-1">
            <Building2 className="w-4 h-4" />
            <span>TPO Partner Network</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Campus Recruitment Drives & Corporate Partners</h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule upcoming company placement drives, manage eligibility criteria, and track company hiring portfolios.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Schedule New On-Campus Drive
        </button>
      </div>

      {/* Partner Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map(company => (
          <div key={company.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 p-2.5 border border-slate-700 flex items-center justify-center shrink-0">
              <img src={company.logo} alt={company.name} className="w-9 h-9 object-contain" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">{company.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {company.status}
                  </span>
                  <button 
                    onClick={() => handleDeleteDrive(company.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete Drive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400">{company.industry}</p>
              
              <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                <span>Applicants / Hired: <strong className="text-teal-400">{company.hiredCount}</strong></span>
                <span>Package (CTC): <strong className="text-indigo-400">{company.avgPackage}</strong></span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Contact: {company.contactPerson}</span>
                <span className="text-teal-400 underline cursor-pointer">{company.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-md w-full space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400" /> Schedule Campus Drive
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Company Name</label>
                <input 
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Adobe Systems"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Drive Title</label>
                <input 
                  type="text"
                  required
                  value={driveTitle}
                  onChange={(e) => setDriveTitle(e.target.value)}
                  placeholder="e.g. SDE 1 Campus Recruitment 2026"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Industry</label>
                  <input 
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Software"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Package (CTC)</label>
                  <input 
                    type="text"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    placeholder="e.g. 18 LPA"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  {isSubmitting ? "Creating Drive..." : "Create Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
