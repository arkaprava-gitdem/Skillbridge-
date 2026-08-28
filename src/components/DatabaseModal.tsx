import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, X, Shield, Users, Briefcase, FileCheck, CheckCircle2, Clock } from 'lucide-react';
import { DatabaseOverview } from '../types';
import { api } from '../services/api';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<DatabaseOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getDatabaseOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to fetch DB overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOverview();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div id="database-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div id="database-modal-card" className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Live Database Inspector</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Synced
                </span>
              </div>
              <p className="text-xs text-slate-400">All user inputs immediately modify and persist in this database</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="refresh-db-btn"
              onClick={fetchOverview}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh database state"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="close-db-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Real-time stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Registered Users</div>
                <div className="text-2xl font-extrabold text-white">{data?.totalUsers ?? '...'}</div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Active Opportunities</div>
                <div className="text-2xl font-extrabold text-white">{data?.totalOpportunities ?? '...'}</div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Applications Filed</div>
                <div className="text-2xl font-extrabold text-white">{data?.totalApplications ?? '...'}</div>
              </div>
            </div>
          </div>

          {/* Database Live Audit Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Live Database Transaction & Audit Trail
              </h4>
              <span className="text-[11px] text-slate-400">
                Last modified: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Just now'}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
              {data?.recentAuditLogs && data.recentAuditLogs.length > 0 ? (
                data.recentAuditLogs.map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-start gap-3 hover:bg-slate-900/50 transition-colors">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold shrink-0 mt-0.5 ${
                      log.collection === 'users' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60' :
                      log.collection === 'opportunities' ? 'bg-violet-950 text-violet-300 border border-violet-800/60' :
                      log.collection === 'assessments' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {log.collection}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 font-medium truncate">{log.details}</p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • action: {log.action}
                      </span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-1" />
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No audit transactions recorded yet. Take an action or log in to create entries!
                </div>
              )}
            </div>
          </div>

          {/* Database Specs Note */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 text-xs text-slate-300 flex items-center gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <span className="font-semibold text-white">Full Persistence Guarantee:</span> Every login, registration, assessment change, opportunity post, or application submission writes directly to disk and is stored in the database.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            id="dismiss-db-modal-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
