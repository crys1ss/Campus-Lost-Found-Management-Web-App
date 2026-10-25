import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';
import { PlusCircle, CheckCircle2, AlertCircle, Loader2, ShieldAlert, ArrowRight } from 'lucide-react';

export const ReportFoundPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
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
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [storageLocation, setStorageLocation] = useState('Security Lost & Found Desk');
  const [secretDetails, setSecretDetails] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

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
      setError('You must log in to submit a found item report.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.reportFound({
        title,
        category_id: Number(categoryId),
        description,
        color,
        brand,
        location,
        date_found: dateFound,
        storage_location: storageLocation,
        secret_identifying_details: secretDetails,
        photo_url: photoUrl,
      });

      setSuccessResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to submit found item report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-semibold">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Found Property Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal-900 font-sans">
          Report a Found Property
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Help reunite an item with its rightful campus owner. Keep secret identifying marks private for security verification.
        </p>
      </div>

      {successResult ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-soft text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-charcoal-900 font-sans">
              Found Property Record #{successResult.id} Registered!
            </h2>
            <p className="text-sm text-gray-600">
              The property has been logged into the custody ledger and matched against open student reports.
            </p>
          </div>

          {successResult.matchesCount > 0 && (
            <div className="bg-peach-50 border border-peach-200 p-4 rounded-2xl max-w-md mx-auto text-xs text-peach-800">
              ⚡ <strong>{successResult.matchesCount} open lost report(s)</strong> matched this item! Security personnel can now notify the claimants.
            </div>
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
                setSecretDetails('');
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-charcoal-800 hover:bg-gray-50"
            >
              Log Another Item
            </button>
            <button
              onClick={() => navigate('/browse')}
              className="px-6 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>View in Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
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
                  placeholder="e.g. Sony Wireless Headphones"
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

            {/* Brand, Color, Date Found */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Brand (if known)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Sony, Apple, Fastrack"
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
                  placeholder="e.g. Silver, Black"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Date Found <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>
            </div>

            {/* Found Location & Custody Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Found Campus Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Computer Lab 612 (Workbench 4) or Room 402"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                  Storage / Custody Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  placeholder="e.g. Security Main Office Locker 102"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
                />
              </div>
            </div>

            {/* Public Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Public Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="General description visible on the campus portal. Do not include secret markings here."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500 resize-none"
              />
            </div>

            {/* Secret Identifying Details (Anti-Fraud) */}
            <div className="space-y-1.5 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Confidential Verification Details (Security Eyes Only)
                </label>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Enter private markings, scratches, stickers, or hidden serial numbers.
                These will <strong>never be shown to the public</strong> and are solely used by security officers to verify claimant proof.
              </p>
              <input
                type="text"
                value={secretDetails}
                onChange={(e) => setSecretDetails(e.target.value)}
                placeholder="e.g. Has initials 'TD' inscribed under left earcup, or custom Docker sticker"
                className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
                Optional Image URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm transition-all shadow-md shadow-peach-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Register Found Belonging</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
