import React from 'react';
import { Menu, Database, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '../types';

interface TopbarProps {
  user: User;
  currentPage: string;
  onOpenMobileSidebar: () => void;
  onOpenDatabaseInspector: () => void;
  onEditProfile: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  currentPage,
  onOpenMobileSidebar,
  onOpenDatabaseInspector,
  onEditProfile
}) => {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard':
        return `Welcome back, ${user.name.split(' ')[0] || user.name}`;
      case 'opportunities':
        return user.role === 'industry' ? 'Talent & Openings Directory' : 'Explore Opportunities';
      case 'assessment':
        return 'Interactive Skill Assessment';
      case 'applications':
        return user.role === 'industry' ? 'Candidate Pipeline' : 'Application Tracker';
      case 'portfolio':
        return user.role === 'admin' ? 'Student Profiles Directory' : 'Verified Digital Portfolio';
      case 'post':
        return 'Publish Industry Opportunity';
      case 'analytics':
        return 'Institution Placement & Skill Analytics';
      default:
        return 'SkillBridge Workspace';
    }
  };

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between"
    >
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="topbar-mobile-menu-btn"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
            SKILLBRIDGE • SIH PLATFORM
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-white truncate max-w-[220px] sm:max-w-md">
            {getPageTitle(currentPage)}
          </h1>
        </div>
      </div>

      {/* Right: DB Inspector Badge & User Chip */}
      <div className="flex items-center gap-3">
        {/* Live Database Sync Badge */}
        <button
          id="topbar-live-db-btn"
          onClick={onOpenDatabaseInspector}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/70 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-[11px]">Live Database Synced</span>
          <Database className="w-3.5 h-3.5 text-indigo-400 ml-0.5" />
        </button>

        {/* User Pill */}
        <div
          id="topbar-user-pill"
          onClick={onEditProfile}
          className="flex items-center gap-2.5 pl-3 pr-1.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all"
          title="Click to edit profile"
        >
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400 font-medium capitalize">{user.role}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
