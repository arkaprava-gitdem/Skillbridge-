import React from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Sparkles,
  Award,
  Compass
} from 'lucide-react';
import { User } from '../types';

interface FacultyDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onNavigate }) => {
  return (
    <div id="faculty-dashboard-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Workspace Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 p-6 sm:p-9 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>FACULTY & ACADEMICIAN PORTAL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Align classroom curricula with <span className="text-emerald-400">real-time industry benchmarks</span>.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track student cohorts, discover skill gap hotspots across engineering courses, and identify UGC/AICTE accredited FDP programs.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="faculty-analytics-btn"
                onClick={() => onNavigate('analytics')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Open Skill Analytics</span>
              </button>

              <button
                id="faculty-programs-btn"
                onClick={() => onNavigate('opportunities')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Industry FDPs</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center p-8 rounded-3xl bg-slate-950/60 border border-slate-800 shrink-0">
            <GraduationCap className="w-20 h-20 text-emerald-400/60" />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mapped Department Students</div>
            <div className="text-xl font-extrabold text-white mt-0.5">380 Students</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Assessed this semester</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Cohort Average Readiness</div>
            <div className="text-xl font-extrabold text-white mt-0.5">76.4%</div>
            <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">+8.2% from last term</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active FDP Programs</div>
            <div className="text-xl font-extrabold text-white mt-0.5">8 Available</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">AICTE / UGC approved</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Industry Linkages</div>
            <div className="text-xl font-extrabold text-white mt-0.5">14 MoUs</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Active tech partners</div>
          </div>
        </div>
      </div>
    </div>
  );
};
