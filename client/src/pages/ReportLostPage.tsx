import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';
import { FileQuestion, CheckCircle2, AlertCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export const ReportLostPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [contactInfo, setContactInfo] = useState(user ? `${user.email} / ${user.phone || ''}` : '');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.categories);
      if (res.categories.length > 0) {
        setCategoryId(String(res.categories[0].id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must log in to submit a lost item report.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.reportLost({
        title,
        category_id: Number(categoryId),
        description,
        color,
        brand,
        location,
        date_lost: dateLost,
        photo_url: photoUrl,
        contact_info: contactInfo,
      });

      setSuccessResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please review your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-semibold">
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Student Lost Property Register</span>
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-900 font-sans">
          Report a Misplaced or Lost Belonging
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Provide accurate details below. Our automated rule-based matching engine will check newly deposited found property immediately.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successResult ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-soft text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-charcoal-900 font-sans">
              Lost Report #{successResult.id} Successfully Saved!
            </h2>
            <p className="text-sm text-gray-600">
              Your report has been written to the normalized database and is now actively tracked by Campus Security.
            </p>
          </div>

          {successResult.potentialMatchesFound > 0 ? (
            <div className="bg-peach-50 border border-peach-200 p-4 rounded-2xl flex items-center justify-between text-left gap-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-peach-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-peach-900">
                    {successResult.potentialMatchesFound} Potential Match{successResult.potentialMatchesFound > 1 ? 'es' : ''} Found!
                  </p>
                  <p className="text-xs text-peach-700">
                    Existing found items closely match your report's specs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-2 rounded-xl bg-peach-500 text-white font-bold text-xs shrink-0 shadow-sm hover:bg-peach-600"
              >
                Inspect
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              No immediate matches in current custody. You will be notified when property matching your report is logged.
            </p>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSuccessResult(null);
                setTitle('');
                setDescription('');
                setColor('');
                setBrand('');
                setLocation('');
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-charcoal-800 hover:bg-gray-50"
            >
              Report Another Item
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Report Form Card */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F3E8E2] shadow-soft space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs flex items-start gap-3 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Item Name / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apple AirPods Pro 2 or Casio fx-991CW"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Item Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand, Color, Date Lost */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Brand (if known)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Apple, Dell, Casio"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Primary Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. White, Black, Space Grey"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Date Lost <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateLost}
                  onChange={(e) => setDateLost(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>
            </div>

            {/* Last Seen Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Last Seen Campus Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Computer Lab 612 (Bench 4), Central Library 2nd Floor, or MPSTME Canteen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe markings, stickers, scratches, contents, or circumstances that help security identify your item."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500 resize-none"
              />
            </div>

            {/* Photo URL & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Optional Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Contact Phone / Email
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Phone number or preferred contact"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm transition-all shadow-md shadow-peach-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Submit Lost Item Report</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
