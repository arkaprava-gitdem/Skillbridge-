import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { User, Opportunity } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface OpportunitiesViewProps {
  user: User;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ user }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.getOpportunities(query, typeFilter);
      setOpportunities(res.opportunities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [query, typeFilter]);

  const handleApply = async (op: Opportunity) => {
    setApplyingId(op.id);
    setMessage(null);
    try {
      const res = await api.applyOpportunity(op.id);
      setAppliedIds((prev) => new Set([...prev, op.id]));
      setMessage(`Application for "${op.title}" at ${op.company} saved in database!`);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch (_) {}
    } catch (err: any) {
      setMessage(err.message || 'Could not submit application.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div id="opportunities-view-content" className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {user.role === 'industry' ? 'Platform Opportunities & Talent Market' : 'Opportunities Directory'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover internships, jobs, workshops, and faculty development programs with skill compatibility mapping.
          </p>
        </div>

        {/* Database Status Notice */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Opportunities: {opportunities.length}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-opportunities-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, company, skills (e.g. React, Python, Docker)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            id="filter-type-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Job">Full-time Job</option>
            <option value="Workshop">Workshop</option>
            <option value="Faculty FDP">Faculty FDP</option>
          </select>
        </div>
      </div>

      {/* Success banner */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-emerald-400 hover:text-emerald-300 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Opportunities Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
          <div>Fetching opportunities from database...</div>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-slate-400 space-y-2">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No opportunities match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your keywords or clearing the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((op) => {
            const isApplied = appliedIds.has(op.id);
            return (
              <article
                key={op.id}
                id={`op-card-${op.id}`}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-slate-950/50"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        op.type === 'Internship'
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : op.type === 'Job'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : op.type === 'Workshop'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
                      }`}
                    >
                      {op.type}
                    </span>
                    <span className="text-[11px] text-slate-500">{op.posted}</span>
                  </div>

                  {/* Title & Company */}
                  <h3 className="font-extrabold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {op.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{op.company}</span>
                  </div>

                  {/* Location & Mode */}
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {op.location}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-300">{op.mode}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {op.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {op.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Match Score */}
                  {op.matchScore != null && (
                    <div className="mt-3.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Skill Match Compatibility
                      </span>
                      <span className="font-extrabold text-indigo-400">{op.matchScore}%</span>
                    </div>
                  )}
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Stipend / Package</span>
                    <span className="text-xs font-bold text-white">{op.stipend}</span>
                  </div>

                  <button
                    id={`apply-btn-${op.id}`}
                    onClick={() => handleApply(op)}
                    disabled={isApplied || applyingId === op.id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : applyingId === op.id ? 'Submitting...' : 'Apply Now'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
