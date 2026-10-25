import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [department, setDepartment] = useState('MBA Tech CE');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('campus_user');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        name,
        email,
        password,
        identifier,
        department,
        phone,
        role,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-peach-500 text-white flex items-center justify-center mx-auto shadow-md shadow-peach-500/20">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-charcoal-900 font-sans">
          Register New Account
        </h1>
        <p className="text-xs text-gray-500">
          Join the SVKM's NMIMS MPSTME Lost & Found network
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-soft space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tanay Dekate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              NMIMS Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@nmims.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Roll No / SAP ID
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. N022"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. MBA Tech CE"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500 bg-white"
            >
              <option value="campus_user">Campus User (Student / Staff)</option>
              <option value="security_personnel">Security Personnel</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm transition-all shadow-md shadow-peach-500/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Complete Registration</span>
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already registered?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-peach-600 hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
