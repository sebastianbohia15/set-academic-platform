import { useState, ReactNode } from 'react';
import {
  LayoutDashboard, Users, BookOpen, FlaskConical, Calendar,
  Megaphone, Trophy, BarChart3, Menu, X, GraduationCap,
  ChevronRight, LogOut, Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
  navigate: (page: string) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'faculty', label: 'Faculty', icon: Users },
  { id: 'programs', label: 'Programs', icon: BookOpen },
  { id: 'publications', label: 'Publications', icon: FlaskConical },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
];

export function DashboardLayout({ children, currentSection, onSectionChange, navigate }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-slate-900 flex flex-col fixed top-0 bottom-0 left-0 z-30`}
      >
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-800 ${!sidebarOpen && 'justify-center'}`}>
          <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">SET Admin</p>
              <p className="text-slate-400 text-xs truncate">Management Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  } ${!sidebarOpen && 'justify-center'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {sidebarOpen && active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-800 p-3 space-y-1">
          <button
            onClick={() => navigate('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ${!sidebarOpen && 'justify-center'}`}
            title={!sidebarOpen ? 'View Website' : undefined}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
            {sidebarOpen && <span>View Website</span>}
          </button>
          <button
            onClick={() => signOut()}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-900/40 hover:text-red-300 transition-colors ${!sidebarOpen && 'justify-center'}`}
            title={!sidebarOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
          {sidebarOpen && profile && (
            <div className="mt-2 px-3 py-2 bg-slate-800 rounded-xl">
              <p className="text-white text-xs font-medium truncate">{profile.full_name || 'Admin User'}</p>
              <p className="text-slate-400 text-xs capitalize">{profile.role}</p>
            </div>
          )}
        </div>
      </aside>

      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors mr-4"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-slate-800 font-semibold text-base capitalize">
              {navItems.find((n) => n.id === currentSection)?.label || 'Dashboard'}
            </h1>
            <p className="text-slate-400 text-xs">School of Engineering & Technology</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
