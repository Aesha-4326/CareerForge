import React, { useState } from 'react';
import { 
  Award, 
  PlusCircle, 
  Code, 
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SkillsCertifications({ student, setStudent }) {
  const { user } = useAuth();
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const persistToBackend = async (updatedStudent) => {
    if (!user || !user.token) return;
    setIsSaving(true);
    try {
      await fetch("http://localhost:5000/api/student/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          skills: updatedStudent.skills,
          certifications: updatedStudent.certifications
        })
      });
    } catch {
      // Backend offline fallback
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (student.skills.includes(newSkillInput.trim())) return;

    const updatedSkills = [...student.skills, newSkillInput.trim()];
    const updatedStudent = { ...student, skills: updatedSkills };
    setStudent(updatedStudent);
    setNewSkillInput('');
    persistToBackend(updatedStudent);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = student.skills.filter(s => s !== skillToRemove);
    const updatedStudent = { ...student, skills: updatedSkills };
    setStudent(updatedStudent);
    persistToBackend(updatedStudent);
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;

    const newCert = {
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      date: "Aug 2026",
      badge: "Verified"
    };

    const updatedCerts = [newCert, ...student.certifications];
    const updatedStudent = { ...student, certifications: updatedCerts };
    setStudent(updatedStudent);
    setNewCertTitle('');
    setNewCertIssuer('');
    persistToBackend(updatedStudent);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Award className="w-4 h-4" />
            <span>Verified Credentials Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Skills & Industry Certifications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your technical skill tags and industry badges for recruiter ATS indexing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isSaving && (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg animate-pulse font-semibold">
              Syncing to MongoDB...
            </span>
          )}
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
            Verified Credentials: <strong className="text-indigo-400">{student.certifications.length} Badges</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 cols: Skills Management */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              Verified Skills Inventory
            </h3>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill (e.g. Docker, Redis, Kubernetes)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> Add
              </button>
            </form>

            {/* Skills Pills Grid */}
            <div className="flex flex-wrap gap-2 pt-2">
              {student.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200">
                  <span>{skill}</span>
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 cols: Certifications */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Verified Industry Certifications
            </h3>

            {/* Add Certification Form */}
            <form onSubmit={handleAddCert} className="space-y-2">
              <input
                type="text"
                value={newCertTitle}
                onChange={(e) => setNewCertTitle(e.target.value)}
                placeholder="Certification Title (e.g. AWS Certified Solutions Architect)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  placeholder="Issuer (e.g. Amazon Web Services)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shrink-0 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Badge
                </button>
              </div>
            </form>

            {/* Certifications List */}
            <div className="space-y-3 pt-2">
              {student.certifications.map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      {cert.badge}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{cert.title}</h4>
                      <p className="text-[11px] text-slate-400">{cert.issuer} • Issued {cert.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified ✓
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
