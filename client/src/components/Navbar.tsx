import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Search,
  PlusCircle,
  FileQuestion,
  FlaskConical,
  LayoutDashboard,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', icon: Compass },
    { label: 'Browse Catalogue', path: '/browse', icon: Search },
    { label: 'Report Lost', path: '/report-lost', icon: FileQuestion },
    { label: 'Report Found', path: '/report-found', icon: PlusCircle },
    {
      label: 'Lab Showcase',
      path: '/experiments',
      icon: FlaskConical,
      highlight: true,
    },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F3E8E2] shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-peach-500 text-white flex items-center justify-center shadow-md shadow-peach-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-charcoal-900 font-sans">
                  Campus<span className="text-peach-600">Find</span>
                </span>
                <span className="text-[10px] bg-peach-100 text-peach-800 font-bold px-1.5 py-0.5 rounded-full border border-peach-200">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-none">
                NMIMS MPSTME Lost & Found
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'text-peach-600 bg-peach-50 font-semibold'
                      : 'text-gray-600 hover:text-charcoal-900 hover:bg-cream-100/70'
                  } ${
                    item.highlight && !isActive
                      ? 'border border-peach-300 text-peach-700 bg-peach-50/50 hover:bg-peach-100/70'
                      : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-peach-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Role Actions / Profile Dropdown */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-3 rounded-full border border-peach-200 bg-peach-50/60 hover:bg-peach-100 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-xs font-semibold text-charcoal-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] font-medium text-peach-700 capitalize">
                      {user.role === 'campus_user'
                        ? 'Student'
                        : user.role === 'security_personnel'
                        ? 'Security Desk'
                        : 'Admin'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-peach-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-charcoal-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.identifier && (
                        <p className="text-[11px] text-peach-600 font-medium mt-0.5">
                          Roll / ID: {user.identifier}
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      {user.role === 'campus_user' && (
                        <button
                          onClick={() => handleNav('/dashboard')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-peach-50 hover:text-peach-700 flex items-center gap-2.5"
                        >
                          <LayoutDashboard className="w-4 h-4 text-peach-500" />
                          <span>Student Dashboard</span>
                        </button>
                      )}

                      {user.role === 'security_personnel' && (
                        <button
                          onClick={() => handleNav('/security')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Security Desk Workbench</span>
                        </button>
                      )}

                      {user.role === 'administrator' && (
                        <>
                          <button
                            onClick={() => handleNav('/admin')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2.5 font-medium"
                          >
                            <Settings className="w-4 h-4 text-purple-600" />
                            <span>Administrator Console</span>
                          </button>
                          <button
                            onClick={() => handleNav('/security')}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                          >
                            <ShieldCheck className="w-4 h-4 text-gray-500" />
                            <span>Security Workspace</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleNav('/dashboard')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-peach-50 flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>My Reports & Claims</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNav('/');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-charcoal-800 hover:bg-cream-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-peach-500 text-white hover:bg-peach-600 transition-all shadow-sm hover:shadow"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-charcoal-900 hover:bg-cream-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-charcoal-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in fade-in">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium ${
                  isActive ? 'bg-peach-50 text-peach-600 font-semibold' : 'text-gray-700 hover:bg-cream-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-peach-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] bg-peach-100 text-peach-700 px-2 py-0.5 rounded-full font-bold">
                    Lab Exp 1–10
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 bg-cream-50 rounded-lg">
                  <p className="text-xs text-gray-500">Logged in as</p>
                  <p className="text-sm font-bold text-charcoal-900">{user.name}</p>
                  <p className="text-xs text-peach-600 capitalize font-medium">{user.role}</p>
                </div>
                {user.role === 'campus_user' && (
                  <button
                    onClick={() => handleNav('/dashboard')}
                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-peach-50 rounded-lg flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-peach-500" />
                    Student Dashboard
                  </button>
                )}
                {user.role === 'security_personnel' && (
                  <button
                    onClick={() => handleNav('/security')}
                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-amber-800 bg-amber-50 rounded-lg flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Security Desk Workbench
                  </button>
                )}
                {user.role === 'administrator' && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left px-3.5 py-2 text-sm font-medium text-purple-800 bg-purple-50 rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    Administrator Console
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    handleNav('/');
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-charcoal-900 text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2.5 rounded-lg bg-peach-500 text-white text-sm font-semibold text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
