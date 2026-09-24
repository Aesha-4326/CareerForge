import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  GraduationCap
} from 'lucide-react';
import { MOCK_STUDENT_ROSTER } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';

export default function StudentManagement() {
  const { user } = useAuth();
  const [students, setStudents] = useState(MOCK_STUDENT_ROSTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    async function loadStudents() {
      if (user && user.token) {
        try {
          const res = await fetch(`${API_URL}/api/admin/students`, {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && data.students) {
            setStudents(data.students);
          }
        } catch {
          // Fallback to mock roster
        }
      }
    }
    loadStudents();
  }, [user]);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'All' || s.branch === selectedBranch;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>TPO Student Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Student Placement Status Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor student placement progress, track offers received, and export official CSV reports.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold text-xs flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Export CSV Roster
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="bg-transparent text-xs text-slate-200 focus:outline-none w-full"
          />
        </div>

        <select 
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="All">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
        </select>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="In Process">In Process</option>
          <option value="Unplaced">Unplaced</option>
        </select>
      </div>

      {/* Roster Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Roll No & Student</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">CGPA</th>
                <th className="p-3.5">Placement Status</th>
                <th className="p-3.5">Recruiting Company</th>
                <th className="p-3.5">Offered Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    {student.name} <span className="text-[10px] text-slate-400 font-normal block">{student.rollNo}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-300">{student.branch}</td>
                  <td className="p-3.5 font-bold text-indigo-400">{student.cgpa}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      student.status === 'Placed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      student.status === 'In Process' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">{student.company}</td>
                  <td className="p-3.5 font-bold text-teal-400">{student.package}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
