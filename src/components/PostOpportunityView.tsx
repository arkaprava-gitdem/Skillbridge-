import React, { useState } from 'react';
import {
  PlusCircle,
  Building2,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { User, Opportunity } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface PostOpportunityViewProps {
  user: User;
  onOpportunityCreated?: (op: Opportunity) => void;
}

export const PostOpportunityView: React.FC<PostOpportunityViewProps> = ({ user, onOpportunityCreated }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(user.company || 'Enterprise Partner');
  const [type, setType] = useState<'Internship' | 'Job' | 'Workshop' | 'Faculty FDP'>('Internship');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [mode, setMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, SQL');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !skills.trim()) {
      setError('Please fill in title, company, and required skills.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.createOpportunity({
        title: title.trim(),
        company: company.trim(),
        type,
        location: location.trim(),
        mode,
        stipend: stipend.trim(),
        skills: skillsArray,
        description: description.trim() || 'Exciting opportunity to build real-world systems with mentorship.'
      });

      setSuccess(`Opportunity "${res.opportunity.title}" published and stored in the database!`);
      if (onOpportunityCreated) {
        onOpportunityCreated(res.opportunity);
      }

      setTitle('');
      setDescription('');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (_) {}
    } catch (err: any) {
      setError(err.message || 'Failed to publish opportunity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="post-opportunity-view-content" className="p-4 sm:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-violet-400">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>INDUSTRY PUBLISHING ENGINE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Post a New Opportunity</h2>
        <p className="text-xs text-slate-400 mt-1">
          Specify technical competencies clearly so the matching engine can surface qualified candidates directly from student cohorts.
        </p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Opportunity Type</label>
            <select
              id="post-type-select"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Internship">Internship</option>
              <option value="Job">Full-Time Job</option>
              <option value="Workshop">Technical Workshop</option>
              <option value="Faculty FDP">Faculty Development Program</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Role Title</label>
            <input
              id="post-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud Security Engineering Intern"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Hiring Organization</label>
            <input
              id="post-company-input"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or Organization name"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Location / City</label>
            <input
              id="post-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hyderabad / Pune / Pan-India"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Arrangement</label>
            <select
              id="post-mode-select"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Stipend / CTC Compensation</label>
            <input
              id="post-stipend-input"
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="e.g. ₹20,000 / month or ₹8-12 LPA"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Required Technical Competencies (Comma-separated)
          </label>
          <input
            id="post-skills-input"
            type="text"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Docker, Python, REST APIs, SQL"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Role Description & Expectations</label>
          <textarea
            id="post-desc-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe team context, key responsibilities, deliverables, and learning outcomes..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none resize-y"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <button
          id="publish-opportunity-btn"
          type="submit"
          disabled={saving}
          className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Publishing to Database...</span>
            </>
          ) : (
            <>
              <span>Publish Opportunity to Live Database</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
