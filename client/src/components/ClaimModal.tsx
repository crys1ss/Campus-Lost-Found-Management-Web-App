import React, { useState } from 'react';
import { FoundItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import { X, ShieldAlert, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ClaimModalProps {
  item: FoundItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [proof, setProof] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit an ownership claim.');
      return;
    }

    if (proof.trim().length < 10) {
      setError('Please provide a more detailed proof description (at least 10 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.submitClaim({
        found_item_id: item.id,
        proof_description: proof,
        contact_phone: phone,
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E07A5F', '#F49D79', '#81B29A', '#F2CC8F'],
        });
      } catch (e) {}

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50/70">
          <div>
            <h3 className="font-bold text-lg text-charcoal-900 font-sans">
              Submit Ownership Claim
            </h3>
            <p className="text-xs text-gray-500">
              Claiming: <strong>{item.title}</strong> (#{item.id})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-charcoal-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Context Pill */}
          <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">Found At:</span>{' '}
              <strong className="text-charcoal-800">{item.location}</strong>
            </div>
            <div>
              <span className="text-gray-500">Current Storage:</span>{' '}
              <strong className="text-peach-700">{item.storage_location}</strong>
            </div>
          </div>

          {/* Proof of Ownership Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              Secret Proof of Ownership <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">
              Describe identifying details that only the true owner would know (e.g. wallpapers, unique scratches, serial numbers, case characteristics, stickers, exact contents).
            </p>
            <textarea
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="e.g. My laptop has a small NASA sticker on the top right, wallpaper is a mountain landscape, and I can unlock it in front of the officer."
              rows={4}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/30 focus:border-peach-500 transition-all resize-none"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider">
              Contact Phone / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500/30 focus:border-peach-500"
            />
          </div>

          {/* Verification Warning Disclaimer */}
          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your claim will be formally reviewed by NMIMS Campus Security personnel. You will need to show valid student/staff ID upon physical collection.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Submit Claim</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
