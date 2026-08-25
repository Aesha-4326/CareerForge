import React from 'react';
import { 
  Kanban, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function ApplicationTracker({ applications }) {
  const stages = [
    { title: 'Applied', color: 'indigo' },
    { title: 'Shortlisted', color: 'amber' },
    { title: 'Interview Scheduled', color: 'purple' },
    { title: 'Offer Received', color: 'emerald' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
            <Kanban className="w-4 h-4" />
            <span>Placement Funnel Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Application Pipeline & Interview Stages</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time status of your job and internship applications across corporate rounds.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
          Total Applications: <strong className="text-indigo-400 text-sm">{applications.length} Active</strong>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const stageApps = applications.filter(a => a.status === stage.title);
          return (
            <div key={stage.title} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 min-h-[450px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">{stage.title}</h3>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 font-bold text-[10px] flex items-center justify-center border border-slate-700">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageApps.map(app => (
                  <div key={app.id} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{app.company}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {app.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{app.title}</p>
                    
                    <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {app.location}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" /> Round: {app.currentRound}
                      </p>
                      <p className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-purple-400" /> Next: {app.nextStepDate}
                      </p>
                    </div>
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs rounded-xl border border-dashed border-slate-800">
                    No applications in this stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
