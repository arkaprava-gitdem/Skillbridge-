import React from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Sparkles,
  Award,
  ChevronRight,
  Database
} from 'lucide-react';
import { User } from '../types';

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onOpenDatabaseInspector: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onNavigate,
  onOpenDatabaseInspector
}) => {
  return (
    <div id="admin-dashboard-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Workspace Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 sm:p-9 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>INSTITUTION & PLACEMENT CELL ADMIN</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Comprehensive placement tracking & <span className="text-amber-400">industry demand analytics</span>.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitor real-time student competencies, recruitment pipelines, and database records across campus departments.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="admin-analytics-btn"
                onClick={() => onNavigate('analytics')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Open Placement Analytics</span>
              </button>

              <button
                id="admin-db-inspector-btn"
                onClick={onOpenDatabaseInspector}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Inspect Database Engine</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shrink-0">
            <BarChart3 className="w-20 h-20 text-amber-400/60" />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mapped Student Profiles</div>
            <div className="text-xl font-extrabold text-white mt-0.5">1,842</div>
            <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Across 6 departments</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Assessment Completion</div>
            <div className="text-xl font-extrabold text-white mt-0.5">78.4%</div>
            <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">Institution average</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Industry Openings</div>
            <div className="text-xl font-extrabold text-white mt-0.5">126</div>
            <div className="text-[10px] text-violet-400 font-semibold mt-0.5">Live recruitment drives</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Placement Offers</div>
            <div className="text-xl font-extrabold text-white mt-0.5">642 Offers</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">This academic year</div>
          </div>
        </div>
      </div>

      {/* Platform Lifecycle Section */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Platform Integrated Lifecycle</h3>
          <p className="text-xs text-slate-400">Step-by-step continuous development workflow from gap assessment to final offer placement.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Assess Skills', desc: 'Baseline evaluation' },
            { step: '02', title: 'Identify Gaps', desc: 'Benchmark analysis' },
            { step: '03', title: 'Recommend Upskilling', desc: 'Targeted modules' },
            { step: '04', title: 'Match Internships', desc: 'Smart algorithms' },
            { step: '05', title: 'Track Progress', desc: 'Real-time telemetry' },
            { step: '06', title: 'Place Candidates', desc: 'Verified hiring' }
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 relative">
              <span className="text-xs font-black font-mono text-indigo-400">{item.step}</span>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
              {idx < 5 && (
                <ChevronRight className="hidden lg:block w-4 h-4 text-slate-700 absolute top-1/2 -right-2.5 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
