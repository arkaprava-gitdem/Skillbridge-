import React, { useState } from 'react';
import {
  FolderGit2,
  Award,
  CheckCircle2,
  ExternalLink,
  Plus,
  Edit3,
  Sparkles,
  School,
  Building2,
  Mail,
  Phone,
  MapPin,
  Database
} from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface PortfolioViewProps {
  user: User;
  onEditProfile: () => void;
  onUserUpdated: (user: User) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ user, onEditProfile, onUserUpdated }) => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);

  // Project form states
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('React, Node.js, TypeScript');
  const [projectLink, setProjectLink] = useState('');

  // Cert form states
  const [certTitle, setCertTitle] = useState('');

  const [saving, setSaving] = useState(false);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setSaving(true);
    try {
      const newProject = {
        id: 'proj-' + Date.now(),
        title: projectTitle.trim(),
        description: projectDesc.trim() || 'Software engineering portfolio project.',
        tech: projectTech.split(',').map((t) => t.trim()).filter(Boolean),
        link: projectLink.trim() || undefined
      };

      const updatedProjects = [...(user.projects || []), newProject];
      const res = await api.updateProfile({ projects: updatedProjects });
      onUserUpdated(res.user);

      setProjectTitle('');
      setProjectDesc('');
      setProjectLink('');
      setShowAddProject(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      } catch (_) {}
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;

    setSaving(true);
    try {
      const updatedCerts = [...(user.certifications || []), certTitle.trim()];
      const res = await api.updateProfile({ certifications: updatedCerts });
      onUserUpdated(res.user);

      setCertTitle('');
      setShowAddCert(false);
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      } catch (_) {}
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="portfolio-view-content" className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Portfolio Header Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>VERIFIED DIGITAL PORTFOLIO • PERSISTED IN DB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{user.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-indigo-300">{user.college || user.company || 'Student Member'}</span>
              <span>•</span>
              <span className="capitalize">{user.role}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {user.location || 'India'}
              </span>
            </div>
          </div>
        </div>

        <button
          id="edit-portfolio-btn"
          onClick={onEditProfile}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-indigo-400" />
          <span>Edit Profile Details</span>
        </button>
      </section>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Panel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Core Competencies & Skills
            </h3>
            <button
              onClick={onEditProfile}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            >
              Update
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(user.skills || []).map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>{s}</span>
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              </span>
            ))}
          </div>
        </div>

        {/* Certifications Panel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Verified Certifications
            </h3>
            <button
              id="add-cert-toggle-btn"
              onClick={() => setShowAddCert(!showAddCert)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Cert
            </button>
          </div>

          {showAddCert && (
            <form onSubmit={handleAddCert} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <input
                type="text"
                required
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="e.g. AWS Certified Developer Associate"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white"
                >
                  Save in DB
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {(user.certifications || []).map((c) => (
              <div
                key={c}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-slate-200">{c}</span>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Projects Showcase Panel (Wide) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Featured Projects & Evidence
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Showcase verified engineering artifacts and capstones.</p>
            </div>

            <button
              id="add-project-toggle-btn"
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Add Project Inline Form */}
          {showAddProject && (
            <form onSubmit={handleAddProject} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">New Project Entry</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project Title (e.g. Distributed Cache Engine)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="Technologies (e.g. Go, Redis, Docker)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
              <textarea
                rows={2}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Brief summary of implementation, architecture, and impact..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  Save Project in Database
                </button>
              </div>
            </form>
          )}

          {/* Project list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(user.projects || []).map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-white">{proj.title}</h4>
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap gap-1">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
