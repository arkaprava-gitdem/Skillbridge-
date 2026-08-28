import React from 'react';
import {
  Building2,
  Users,
  Briefcase,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { User } from '../types';

interface IndustryDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({ user, onNavigate }) => {
  return (
    <div id="industry-dashboard-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Workspace Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 sm:p-9 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold mb-4">
              <Building2 className="w-4 h-4 text-violet-400" />
              <span>INDUSTRY RECRUITMENT WORKSPACE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Find and recruit verified student talent for <span className="text-violet-400">{user.company || 'your organization'}</span>.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Publish structured opportunities with skill requirements and let SkillBridge surface compatible candidates with verifiable portfolios.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="industry-post-op-btn"
                onClick={() => onNavigate('post')}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Opportunity</span>
              </button>

              <button
                id="industry-pipeline-btn"
                onClick={() => onNavigate('applications')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>View Candidate Pipeline</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shrink-0">
            <Briefcase className="w-20 h-20 text-violet-400/60" />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Open Positions</div>
            <div className="text-xl font-extrabold text-white mt-0.5">5 Published</div>
            <div className="text-[10px] text-violet-400 font-semibold mt-0.5">Across roles & internships</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mapped Student Pool</div>
            <div className="text-xl font-extrabold text-white mt-0.5">1,240+</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Assessed candidates</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Applications Received</div>
            <div className="text-xl font-extrabold text-white mt-0.5">42 Candidates</div>
            <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">Ready for review</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Match Accuracy</div>
            <div className="text-xl font-extrabold text-white mt-0.5">94.2%</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">AI skill alignment</div>
          </div>
        </div>
      </div>
    </div>
  );
};
