import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, GraduationCap, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  navigate: (page: string) => void;
}

const navLinks = [
  { label: 'About', page: 'about' },
  {
    label: 'Academics',
    children: [
      { label: 'Programs & Curriculum', page: 'programs' },
      { label: 'Departments', page: 'departments' },
    ],
  },
  { label: 'Faculty', page: 'faculty' },
  { label: 'Research', page: 'research' },
  { label: 'Labs & Facilities', page: 'labs' },
  { label: 'Events', page: 'events' },
  { label: 'Achievements', page: 'achievements' },
];

export function Header({ currentPage, navigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');
  const { profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = currentPage === 'home';
  const transparent = isHome && !scrolled && !mobileOpen;

  function handleNav(page: string) {
    navigate(page);
    setMobileOpen(false);
    setDropdownOpen('');
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group"
          >
            <div className={`p-2 rounded-xl ${transparent ? 'bg-white/20' : 'bg-blue-700'} transition-colors`}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold text-sm leading-tight ${transparent ? 'text-white' : 'text-slate-900'}`}>
                KR Mangalam University
              </div>
              <div className={`text-xs ${transparent ? 'text-white/70' : 'text-slate-500'}`}>
                School of Engineering
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onMouseEnter={() => setDropdownOpen(link.label)}
                    onMouseLeave={() => setDropdownOpen('')}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      transparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {link.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdownOpen === link.label && (
                    <div
                      className="absolute top-full left-0 bg-white rounded-xl shadow-lg border border-slate-100 py-2 min-w-48 z-50"
                      onMouseEnter={() => setDropdownOpen(link.label)}
                      onMouseLeave={() => setDropdownOpen('')}
                    >
                      {link.children.map((child) => (
                        <button
                          key={child.page}
                          onClick={() => handleNav(child.page)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page!)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? transparent
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 text-blue-700'
                      : transparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {profile ? (
              <div className="flex items-center gap-2">
                {(profile.role === 'admin' || profile.role === 'faculty') && (
                  <button
                    onClick={() => handleNav('dashboard')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      transparent
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    transparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  transparent
                    ? 'bg-white text-blue-700 hover:bg-blue-50'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Staff Login
              </button>
            )}
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-slate-700'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <button
                      key={child.page}
                      onClick={() => handleNav(child.page)}
                      className="w-full text-left px-6 py-2 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page!)}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  {link.label}
                </button>
              )
            )}
            <div className="pt-2 border-t border-slate-100">
              {profile ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => handleNav('login')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
                >
                  <LogIn className="w-4 h-4" /> Staff Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
