import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Award, 
  Download, 
  GraduationCap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { PLACEMENT_STATS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(PLACEMENT_STATS);
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'];

  useEffect(() => {
    async function loadAdminStats() {
      if (user && user.token) {
        try {
          const res = await fetch("http://localhost:5000/api/admin/analytics", {
            headers: { "Authorization": `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok && data.stats) {
            setStats(data.stats);
          }
        } catch {
          // Fallback to static stats
        }
      }
    }
    loadAdminStats();
  }, [user]);

  return (
    <div className="space-y-6">
      
      {/* TPO Executive Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Training & Placement Office (TPO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Campus Placement Analytics & Executive Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            2026 Batch • Total Enrolled: 450 Students • Overall Placement Index: 81.7%
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0">
          <Download className="w-4 h-4" /> Export TPO Official Report (PDF)
        </button>
      </div>

      {/* TPO KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Placed Students</span>
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{PLACEMENT_STATS.placedStudents} / {PLACEMENT_STATS.totalStudents}</span>
            <span className="text-xs text-teal-400 font-bold">{PLACEMENT_STATS.placementPercentage}% Placed</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Highest Salary Package</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{PLACEMENT_STATS.highestPackage}</span>
            <span className="text-xs text-purple-400 font-bold">Google Core</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Average Salary Package</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{PLACEMENT_STATS.averagePackage}</span>
            <span className="text-xs text-indigo-400 font-bold">+18.4% vs 2025</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Drives Conducted</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{PLACEMENT_STATS.drivesCompleted} Companies</span>
            <span className="text-xs text-amber-400 font-bold">6 Upcoming</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department-wise Placement % Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" /> Department-Wise Placement Rate (%)
            </h3>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLACEMENT_STATS.departmentBreakdown}>
                <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package Distribution Chart (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" /> Salary Package Distribution
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLACEMENT_STATS.packageRanges}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ range, count }) => `${range} (${count})`}
                  labelLine={false}
                >
                  {PLACEMENT_STATS.packageRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
