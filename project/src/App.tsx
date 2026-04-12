import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/public/HomePage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { FacultyPage } from './pages/public/FacultyPage';
import { ResearchPage } from './pages/public/ResearchPage';
import { EventsPage } from './pages/public/EventsPage';
import { AchievementsPage } from './pages/public/AchievementsPage';
import { LabsPage } from './pages/public/LabsPage';
import { DepartmentsPage } from './pages/public/DepartmentsPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';

function useHashRouter() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || 'home');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.slice(1) || 'home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { route, navigate };
}

const PUBLIC_PAGES = ['home', 'about', 'programs', 'faculty', 'research', 'events', 'achievements', 'labs', 'departments'];

function AppInner() {
  const { route, navigate } = useHashRouter();
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading SET Portal...</p>
        </div>
      </div>
    );
  }

  if (route === 'login') {
    return <LoginPage navigate={navigate} />;
  }

  if (route === 'dashboard') {
    if (!profile || !['admin', 'faculty'].includes(profile.role)) {
      return <LoginPage navigate={navigate} />;
    }
    return <DashboardPage navigate={navigate} />;
  }

  const isPublicPage = PUBLIC_PAGES.includes(route);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={route} navigate={navigate} />
      <main className="flex-1 pt-16 lg:pt-20">
        {route === 'home' && <HomePage navigate={navigate} />}
        {route === 'about' && <AboutPage navigate={navigate} />}
        {route === 'programs' && <ProgramsPage />}
        {route === 'faculty' && <FacultyPage navigate={navigate} />}
        {route === 'research' && <ResearchPage />}
        {route === 'events' && <EventsPage />}
        {route === 'achievements' && <AchievementsPage />}
        {route === 'labs' && <LabsPage />}
        {route === 'departments' && <DepartmentsPage navigate={navigate} />}
        {!isPublicPage && route !== 'home' && (
          <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
              <p className="text-slate-600 mb-6">Page not found</p>
              <button
                onClick={() => navigate('home')}
                className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
