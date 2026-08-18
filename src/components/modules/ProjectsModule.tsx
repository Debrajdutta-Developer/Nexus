import React from 'react';
import { Kanban, CheckCircle2, Clock, AlertTriangle, GitPullRequest } from 'lucide-react';

export const ProjectsModule: React.FC = () => {
  const tasks = [
    { id: 'NEX-801', title: 'Implement Spatial Hand Landmarker GPU delegate', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'JD' },
    { id: 'NEX-802', title: 'Optimize R3F volumetric bloom shader pass', status: 'DONE', priority: 'URGENT', assignee: 'AL' },
    { id: 'NEX-803', title: 'Synthesize binaural spatial UI hover clicks', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: 'JD' },
    { id: 'NEX-804', title: 'Zero-latency glass refraction mesh shaders', status: 'TODO', priority: 'MEDIUM', assignee: 'ST' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-cyan-50 font-mono p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
            <Kanban className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-cyan-100 uppercase tracking-wider">LINEAR SPRINT CORE</h2>
            <p className="text-xs text-cyan-400/60">CYCLE-89 // VELOCITY: 94 PTS</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-400/30 text-xs text-cyan-300">
          <GitPullRequest className="w-4 h-4" /> 12 Active PRs
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 my-4 space-y-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 rounded-xl border border-cyan-500/20 bg-slate-900/40 hover:bg-slate-900/70 hover:border-cyan-400/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-start gap-3">
              {task.status === 'DONE' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />}
              {task.status === 'IN_PROGRESS' && <Clock className="w-4 h-4 text-cyan-400 animate-spin-slow mt-0.5" />}
              {task.status === 'TODO' && <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5" />}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">{task.id}</span>
                  <span className="text-xs font-semibold text-slate-200">{task.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                  <span>PRIORITY: <strong className={task.priority === 'URGENT' ? 'text-orange-400' : 'text-cyan-300'}>{task.priority}</strong></span>
                  <span>ASSIGNEE: {task.assignee}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Progress Bar */}
      <div className="pt-3 border-t border-cyan-500/20 space-y-1">
        <div className="flex justify-between text-[11px] text-cyan-400/80">
          <span>SPRINT PROGRESS</span>
          <span>72% COMPLETE</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 w-[72%] shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
        </div>
      </div>
    </div>
  );
};
