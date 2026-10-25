import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'security' | 'admin') => {
    try {
      await demoLogin(role);
      if (role === 'security') navigate('/security');
      else if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-peach-500 text-white flex items-center justify-center mx-auto shadow-md shadow-peach-500/20">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-charcoal-900 font-sans">
          Log In to CampusFind
        </h1>
        <p className="text-xs text-gray-500">
          NMIMS MPSTME Campus Lost & Found Management Portal
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-soft space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              NMIMS Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanay@nmims.edu"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm transition-all shadow-md shadow-peach-500/20 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[11px] text-gray-500 font-semibold uppercase text-center tracking-wider">
            Quick Demo Accounts (1-Click Login)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-2 px-1 text-center bg-cream-100 hover:bg-cream-200 text-charcoal-800 rounded-xl text-[11px] font-bold border border-cream-200 transition-colors"
            >
              Student (Tanay)
            </button>
            <button
              onClick={() => handleQuickDemo('security')}
              className="py-2 px-1 text-center bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-[11px] font-bold border border-amber-200 transition-colors"
            >
              Security Desk
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-1 text-center bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-[11px] font-bold border border-purple-200 transition-colors"
            >
              Administrator
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-peach-600 hover:underline"
          >
            Create Student Account
          </button>
        </div>
      </div>
    </div>
  );
};
