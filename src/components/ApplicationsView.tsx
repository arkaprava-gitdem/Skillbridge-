import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ChevronRight,
  Database
} from 'lucide-react';
import { User, Application } from '../types';
import { api } from '../services/api';

interface ApplicationsViewProps {
  user: User;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getApplications();
      setApplications(res.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      await api.updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: status as Application['status'] } : a))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const isRecruiter = user.role === 'industry' || user.role === 'admin';

  return (
    <div id="applications-view-content" className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {isRecruiter ? 'Candidate Applications Pipeline' : 'My Application Tracker'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRecruiter
              ? 'Review candidates, evaluate skill match compatibility, and update candidate statuses in database.'
              : 'Follow every submitted application, interview status, and review milestones.'}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Total Database Applications: {applications.length}</span>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
          <div>Loading application records from database...</div>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-slate-400 space-y-2">
          <FileCheck2 className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">
            {isRecruiter ? 'No candidates have applied yet' : 'No applications submitted yet'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRecruiter
              ? 'Post more opportunities to attract candidates from universities.'
              : 'Explore open opportunities to submit your first application.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80">
          {applications.map((app) => (
            <div
              key={app.id}
              id={`app-row-${app.id}`}
              className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
            >
              {/* Left Column: Details */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {app.opportunity?.company ? app.opportunity.company.charAt(0) : 'O'}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">{app.opportunity?.title || 'Opportunity'}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {app.opportunity?.type || 'Internship'}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.opportunity?.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {app.opportunity?.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Applied: {app.appliedOn}
                    </span>
                  </div>

                  {isRecruiter && (
                    <div className="mt-2 text-xs text-slate-300 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Applicant: <strong className="text-white">{app.userName}</strong> ({app.userEmail}) - {app.userCollege || 'Student'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Status & Controls */}
              <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'Selected'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : app.status === 'Shortlisted'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : app.status === 'Under Review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : app.status === 'Rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {app.status}
                </span>

                {/* Recruiter Status Updater */}
                {isRecruiter && (
                  <select
                    id={`status-select-${app.id}`}
                    value={app.status}
                    disabled={updatingId === app.id}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg outline-none focus:border-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
