import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Award, CheckCircle2 } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { user, demoLogin } = useAuth();

  return (
    <div className="bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 text-cream-100 text-xs py-2 px-4 shadow-sm border-b border-charcoal-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-peach-500/20 text-peach-300 px-2 py-0.5 rounded-full font-medium border border-peach-500/30">
            <Award className="w-3 h-3" /> NMIMS MPSTME CE
          </span>
          <span className="hidden sm:inline text-cream-200">
            SE Lab Experiments 1–10 Project • N022, N026, N038
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-cream-300 text-[11px] font-medium hidden md:inline">
            Quick 1-Click Role Switcher:
          </span>

          <button
            onClick={() => demoLogin('student')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.role === 'campus_user'
                ? 'bg-peach-500 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white/10 text-cream-200 hover:bg-white/20'
            }`}
            title="Log in as Student (Tanay Dekate, Roll N022)"
          >
            <User className="w-3 h-3" />
            <span>Student (Tanay)</span>
            {user?.role === 'campus_user' && <CheckCircle2 className="w-3 h-3 text-peach-200" />}
          </button>

          <button
            onClick={() => demoLogin('security')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.role === 'security_personnel'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white/10 text-cream-200 hover:bg-white/20'
            }`}
            title="Log in as Security Officer (Officer Ramesh, Badge SEC-402)"
          >
            <Shield className="w-3 h-3" />
            <span>Security (Ramesh)</span>
            {user?.role === 'security_personnel' && <CheckCircle2 className="w-3 h-3 text-amber-200" />}
          </button>

          <button
            onClick={() => demoLogin('admin')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 font-medium ${
              user?.role === 'administrator'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-white/20'
                : 'bg-white/10 text-cream-200 hover:bg-white/20'
            }`}
            title="Log in as Administrator (Dr. K. Mehta, Dean/IT Cell)"
          >
            <Shield className="w-3 h-3" />
            <span>Admin (Dean)</span>
            {user?.role === 'administrator' && <CheckCircle2 className="w-3 h-3 text-purple-200" />}
          </button>
        </div>
      </div>
    </div>
  );
};
