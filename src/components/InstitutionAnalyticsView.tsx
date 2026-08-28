import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  BarChart3,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { InstitutionStats, SkillDemandItem } from '../types';

export const InstitutionAnalyticsView: React.FC = () => {
  const [stats, setStats] = useState<InstitutionStats | null>(null);
  const [skillDemand, setSkillDemand] = useState<SkillDemandItem[]>([]);
  const [activity, setActivity] = useState<Array<{ id: string; text: string; time: string; type: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getInstitutionAnalytics();
        setStats(res.stats);
        setSkillDemand(res.skillDemand);
        setActivity(res.recentActivity);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const barColors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#06b6d4', '#10b981'];

  return (
    <div id="analytics-view-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>REAL-TIME AGGREGATION ENGINE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Institution & Placement Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics computed directly across live student profiles, active recruiter postings, and verified placements.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mapped Student Profiles</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats?.students ?? '...'}</div>
            <div className="text-[10px] text-indigo-400 font-semibold mt-0.5">Database verified</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Open Positions</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats?.activeOpportunities ?? '...'}</div>
            <div className="text-[10px] text-violet-400 font-semibold mt-0.5">Across tech industry</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Tracked Applications</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats?.applications ?? '...'}</div>
            <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Active candidates</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Placement Selections</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{stats?.selected ?? '...'}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Confirmed hires</div>
          </div>
        </div>
      </div>

      {/* Chart Section: Industry Skill Demand */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Industry Skill Demand Index
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Most requested technical competencies synthesized from active job specifications.
          </p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={skillDemand}
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="skill"
                type="category"
                stroke="#94a3b8"
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
                width={140}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff'
                }}
                formatter={(val: any) => [`${val} postings demand`, 'Skill Demand Score']}
              />
              <Bar dataKey="demand" radius={[0, 8, 8, 0]}>
                {skillDemand.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Real-time Activity Feed */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Live Platform Transactions & Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Audit log of real-time actions changing the database state.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
          {activity.map((item) => (
            <div key={item.id} className="py-3 flex items-start gap-3 text-xs">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 mt-0.5 ${
                item.type === 'users' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                item.type === 'opportunities' ? 'bg-violet-950 text-violet-300 border border-violet-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {item.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 font-medium">{item.text}</p>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.time).toLocaleTimeString()}
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
