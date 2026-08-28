import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  UserCheck2,
  FolderGit2,
  PlusCircle,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronRight,
  Shield,
  X,
  Database
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  currentPage: string;
  onSelectPage: (page: string) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenDatabaseInspector: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentPage,
  onSelectPage,
  onLogout,
  mobileOpen,
  onCloseMobile,
  onOpenDatabaseInspector
}) => {
  // Navigation mapping according to role
  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'opportunities', label: 'Opportunities', icon: Compass },
          { id: 'assessment', label: 'Skill Assessment', icon: UserCheck2 },
          { id: 'applications', label: 'My Applications', icon: FileCheck2 },
          { id: 'portfolio', label: 'Digital Portfolio', icon: FolderGit2 }
        ];
      case 'industry':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'opportunities', label: 'Talent & Openings', icon: Compass },
          { id: 'post', label: 'Post Opportunity', icon: PlusCircle },
          { id: 'applications', label: 'Candidate Pipeline', icon: FileCheck2 }
        ];
      case 'faculty':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'opportunities', label: 'Industry Programs', icon: Compass },
          { id: 'analytics', label: 'Curriculum Analytics', icon: BarChart3 }
        ];
      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'opportunities', label: 'All Opportunities', icon: Compass },
          { id: 'analytics', label: 'Institution Analytics', icon: BarChart3 },
          { id: 'portfolio', label: 'Student Directory', icon: FolderGit2 }
        ];
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Aside Shell */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Mini Profile */}
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm font-extrabold text-white tracking-tight block">SkillBridge</strong>
                <span className="text-[11px] text-slate-400 font-medium">Academia × Industry</span>
              </div>
            </div>

            <button
              id="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Mini Profile Card */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400 truncate">
                {user.college || user.company || user.email}
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              WORKSPACE NAVIGATION
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white/80' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Live DB Quick Trigger */}
          <button
            id="sidebar-db-inspector-btn"
            onClick={onOpenDatabaseInspector}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all text-xs font-medium"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Database</span>
            </div>
            <Database className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {/* Secure note */}
          <div className="px-3 py-2 text-[11px] text-slate-500 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Role: {user.role.toUpperCase()} Workspace</span>
          </div>

          {/* Sign Out Button */}
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
