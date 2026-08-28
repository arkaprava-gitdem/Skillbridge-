import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Award,
  FolderGit2,
  CheckCircle2,
  Building2,
  MapPin,
  Flame,
  Zap,
  Target
} from 'lucide-react';
import { User, Opportunity } from '../types';
import { api } from '../services/api';

interface StudentDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onNavigate }) => {
  const [recommendations, setRecommendations] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await api.getRecommendations();
        if (res && res.recommendations && res.recommendations.length > 0) {
          setRecommendations(res.recommendations);
        } else {
          const opps = await api.getOpportunities();
          setRecommendations(opps.opportunities.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load recommendations, falling back to opportunities:', err);
        try {
          const opps = await api.getOpportunities();
          setRecommendations(opps.opportunities.slice(0, 6));
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [user]);

  const handleApply = async (op: Opportunity) => {
    setApplyingId(op.id);
    try {
      await api.applyOpportunity(op.id);
      setAppliedIds((prev) => new Set([...prev, op.id]));
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  // Calculate overall readiness score
  const scores = user.skillScores || {};
  const scoreValues = Object.values(scores) as number[];
  const averageReadiness = scoreValues.length > 0
    ? Math.round(scoreValues.reduce((a, b) => a + Number(b), 0) / scoreValues.length)
    : 72;

  return (
    <div id="student-dashboard-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Readiness Card */}
      <section
        id="hero-readiness-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 sm:p-9 shadow-2xl"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>CAREER READINESS INDEX</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Your profile is <span className="text-indigo-400 font-black">{averageReadiness}%</span> aligned with current industry opportunities.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete your self-assessment module and record newly acquired competencies to boost your matching algorithm score across top recruiters.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="improve-profile-btn"
                onClick={() => onNavigate('assessment')}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Take Skill Assessment</span>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                id="explore-all-ops-btn"
                onClick={() => onNavigate('opportunities')}
                className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Opportunities</span>
              </button>
            </div>
          </div>

          {/* Readiness Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-sm self-start md:self-auto shrink-0 min-w-[160px]">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${averageReadiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-white">{averageReadiness}%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fit Score</span>
              </div>
            </div>
            <span className="text-[11px] text-indigo-300 font-bold mt-2">Verified Profile</span>
          </div>
        </div>
      </section>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Readiness Index</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{averageReadiness}%</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Top 15% tier</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Recommended Matches</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{recommendations.length} Active</div>
            <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">Updated live</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Certifications</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{user.certifications?.length || 1}</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Verified credentials</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Portfolio Projects</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{user.projects?.length || 1}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Git connected</div>
          </div>
        </div>
      </div>

      {/* Recommended Opportunities Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Recommended For You
            </h3>
            <p className="text-xs text-slate-400">Opportunities dynamically ranked by skill compatibility against your profile.</p>
          </div>

          <button
            id="view-all-recommendations-btn"
            onClick={() => onNavigate('opportunities')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.slice(0, 3).map((op) => {
            const isApplied = appliedIds.has(op.id);
            return (
              <article
                key={op.id}
                id={`rec-card-${op.id}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {op.type}
                    </span>
                    <span className="text-[11px] text-slate-500">{op.posted}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white line-clamp-1">{op.title}</h4>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{op.company}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {op.description}
                  </p>

                  {/* Skills badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {op.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium">
                        {s}
                      </span>
                    ))}
                    {op.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400">
                        +{op.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">{op.stipend}</span>
                  </div>

                  <button
                    id={`quick-apply-btn-${op.id}`}
                    onClick={() => handleApply(op)}
                    disabled={isApplied || applyingId === op.id}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : applyingId === op.id ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Skill Snapshot Panel */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Skill Snapshot</h3>
          <p className="text-xs text-slate-400">Current technical strengths and areas identified for improvement.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {Object.entries(scores).map(([skillName, score]) => (
            <div key={skillName} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 capitalize">{skillName.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-mono font-bold text-indigo-400">{score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
