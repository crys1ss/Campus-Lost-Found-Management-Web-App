import React from 'react';
import { FoundItem, LostItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, MapPin, Calendar, Tag, Shield, Building, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ItemModalProps {
  item: FoundItem | LostItem | null;
  type: 'found' | 'lost';
  onClose: () => void;
  onClaim?: (item: FoundItem) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, type, onClose, onClaim }) => {
  const { user } = useAuth();
  if (!item) return null;

  const isFound = type === 'found';
  const foundItem = isFound ? (item as FoundItem) : null;
  const lostItem = !isFound ? (item as LostItem) : null;
  const isStaff = user && (user.role === 'security_personnel' || user.role === 'administrator');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-cream-50/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-peach-600 bg-peach-100/80 px-2.5 py-1 rounded-full border border-peach-200">
              {isFound ? 'Found Property Record' : 'Lost Property Report'}
            </span>
            <span className="text-xs text-gray-500 font-medium">#{item.id}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-charcoal-900 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual and Title */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-48 rounded-2xl bg-cream-100 overflow-hidden shrink-0 border border-cream-200 flex items-center justify-center relative">
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Tag className="w-16 h-16 text-peach-300" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <span className="inline-block text-xs font-semibold text-charcoal-700 bg-cream-100 px-2.5 py-0.5 rounded-md">
                {item.category_name || 'Item'}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 font-sans leading-snug">
                {item.title}
              </h2>

              <div className="flex flex-wrap gap-2 text-xs text-gray-600 pt-1">
                {item.brand && (
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    Brand: <strong className="text-charcoal-800">{item.brand}</strong>
                  </span>
                )}
                {item.color && (
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                    Color: <strong className="text-charcoal-800">{item.color}</strong>
                  </span>
                )}
                <span className="bg-gray-100 px-2.5 py-1 rounded-md">
                  Status: <strong className="text-peach-700 capitalize">{item.status}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Description & Circumstances
            </h4>
            <p className="text-sm text-charcoal-800 leading-relaxed bg-cream-50/50 p-4 rounded-xl border border-cream-100">
              {item.description}
            </p>
          </div>

          {/* Location & Custody Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-cream-50/70 p-4 rounded-xl border border-cream-200/80 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-peach-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Campus Location</p>
                <p className="text-sm font-semibold text-charcoal-900">{item.location}</p>
              </div>
            </div>

            <div className="bg-cream-50/70 p-4 rounded-xl border border-cream-200/80 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-peach-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {isFound ? 'Date Found' : 'Date Lost'}
                </p>
                <p className="text-sm font-semibold text-charcoal-900">
                  {isFound ? foundItem?.date_found : lostItem?.date_lost}
                </p>
              </div>
            </div>

            {isFound && (
              <div className="sm:col-span-2 bg-peach-50/40 p-4 rounded-xl border border-peach-200/70 flex items-start gap-3">
                <Building className="w-5 h-5 text-peach-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-peach-800 font-medium">Official Storage & Custody</p>
                  <p className="text-sm font-bold text-charcoal-900">
                    {foundItem?.storage_location || 'Security Lost & Found Desk'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Custody Status: <strong>{foundItem?.custody_status || 'IN_CUSTODY'}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Confidential Section (Only displayed to Security or Admin) */}
          {isFound && foundItem?.secret_identifying_details && isStaff && (
            <div className="bg-amber-50/80 border border-amber-300 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>CONFIDENTIAL SECURITY IDENTIFIER (Hidden from public)</span>
              </div>
              <p className="text-xs text-amber-950 font-mono bg-white/70 p-2.5 rounded border border-amber-200 mt-1">
                {foundItem.secret_identifying_details}
              </p>
              <p className="text-[11px] text-amber-700">
                Use this private physical marking/serial to verify claimant proof during desk interview.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>

          {isFound && foundItem?.status !== 'RETURNED' && onClaim && (
            <button
              onClick={() => {
                onClose();
                onClaim(foundItem);
              }}
              className="px-6 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-sm transition-all shadow-md shadow-peach-500/20"
            >
              Submit Ownership Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
