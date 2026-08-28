import React, { useEffect, useState } from 'react';
import { User } from './types';
import { api } from './services/api';
import { AuthPage } from './components/AuthPage';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { IndustryDashboard } from './components/IndustryDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OpportunitiesView } from './components/OpportunitiesView';
import { AssessmentView } from './components/AssessmentView';
import { ApplicationsView } from './components/ApplicationsView';
import { PortfolioView } from './components/PortfolioView';
import { PostOpportunityView } from './components/PostOpportunityView';
import { InstitutionAnalyticsView } from './components/InstitutionAnalyticsView';
import { DatabaseModal } from './components/DatabaseModal';
import { EditProfileModal } from './components/EditProfileModal';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('skillbridge_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getCurrentUser();
        setUser(res.user);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        api.logout();
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (authUser: User, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('skillbridge_token', authToken);
    setToken(authToken);
    setUser(authUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setToken(null);
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Initializing SkillBridge Database...
        </p>
      </div>
    );
  }

  // If user is not authenticated, show modern AuthPage (no demo credentials, live DB registration & login)
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onOpenDatabaseInspector={() => setDbModalOpen(true)}
        />
        <DatabaseModal
          isOpen={dbModalOpen}
          onClose={() => setDbModalOpen(false)}
        />
      </div>
    );
  }

  // Render role-based active page view
  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (user.role === 'student') {
          return <StudentDashboard user={user} onNavigate={setCurrentPage} />;
        }
        if (user.role === 'industry') {
          return <IndustryDashboard user={user} onNavigate={setCurrentPage} />;
        }
        if (user.role === 'faculty') {
          return <FacultyDashboard user={user} onNavigate={setCurrentPage} />;
        }
        return (
          <AdminDashboard
            user={user}
            onNavigate={setCurrentPage}
            onOpenDatabaseInspector={() => setDbModalOpen(true)}
          />
        );

      case 'opportunities':
        return <OpportunitiesView user={user} />;

      case 'assessment':
        return <AssessmentView user={user} onUserUpdated={handleUserUpdated} />;

      case 'applications':
        return <ApplicationsView user={user} />;

      case 'portfolio':
        return (
          <PortfolioView
            user={user}
            onEditProfile={() => setEditProfileOpen(true)}
            onUserUpdated={handleUserUpdated}
          />
        );

      case 'post':
        return (
          <PostOpportunityView
            user={user}
            onOpportunityCreated={() => setCurrentPage('opportunities')}
          />
        );

      case 'analytics':
        return <InstitutionAnalyticsView />;

      default:
        return <StudentDashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenDatabaseInspector={() => setDbModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Topbar */}
        <Topbar
          user={user}
          currentPage={currentPage}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenDatabaseInspector={() => setDbModalOpen(true)}
          onEditProfile={() => setEditProfileOpen(true)}
        />

        {/* Dynamic Page Workspace Content */}
        <main className="flex-1 pb-16 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Live Database Inspector Modal */}
      <DatabaseModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
      />

      {/* Edit Profile & Database Record Modal */}
      <EditProfileModal
        user={user}
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default App;
