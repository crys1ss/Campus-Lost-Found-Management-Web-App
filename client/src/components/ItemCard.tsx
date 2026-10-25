import React from 'react';
import { FoundItem, LostItem } from '../types';
import { MapPin, Calendar, Tag, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ItemCardProps {
  item: FoundItem | LostItem;
  type: 'found' | 'lost';
  onSelect: (item: any) => void;
  onClaim?: (item: any) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, type, onSelect, onClaim }) => {
  const isFound = type === 'found';
  const foundItem = isFound ? (item as FoundItem) : null;
  const lostItem = !isFound ? (item as LostItem) : null;

  const dateStr = isFound ? foundItem?.date_found : lostItem?.date_lost;
  const status = item.status;

  const getStatusBadge = () => {
    switch (status) {
      case 'IN_CUSTODY':
      case 'UNCLAIMED':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> In Security Custody
          </span>
        );
      case 'CLAIM_PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Claim Under Review
          </span>
        );
      case 'RETURNED':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-purple-200">
            <CheckCircle2 className="w-3 h-3" /> Returned to Owner
          </span>
        );
      case 'MATCH_PENDING':
        return (
          <span className="inline-flex items-center gap-1 bg-peach-50 text-peach-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-peach-200">
            <Tag className="w-3 h-3" /> Potential Match Found
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-200">
            Open Report
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F3E8E2] overflow-hidden shadow-soft-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Image Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              // Fallback to stylized illustration if URL broken
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        {/* Fallback Icon when no image */}
        <div className="absolute inset-0 flex items-center justify-center text-peach-400 bg-peach-50/50 -z-0">
          <Tag className="w-12 h-12 opacity-40" />
        </div>

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-charcoal-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-1">
            {item.category_name || 'Item'}
          </span>
        </div>

        {/* Status Pill Over Image */}
        <div className="absolute top-3 right-3 z-10">
          {getStatusBadge()}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-charcoal-900 group-hover:text-peach-600 transition-colors line-clamp-1 font-sans">
            {item.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Quick Attribute Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {item.brand && (
              <span className="text-[10px] bg-cream-100 text-charcoal-700 px-2 py-0.5 rounded-md font-medium">
                {item.brand}
              </span>
            )}
            {item.color && (
              <span className="text-[10px] bg-cream-100 text-charcoal-700 px-2 py-0.5 rounded-md font-medium">
                {item.color}
              </span>
            )}
          </div>
        </div>

        {/* Location & Date Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5 text-peach-500 shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{dateStr || 'Recent'}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onSelect(item)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 transition-colors text-center"
            >
              View Details
            </button>

            {isFound && status !== 'RETURNED' && onClaim ? (
              <button
                onClick={() => onClaim(item)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-peach-500 hover:bg-peach-600 text-white transition-all shadow-sm text-center"
              >
                Claim Item
              </button>
            ) : (
              <button
                onClick={() => onSelect(item)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-peach-200 text-peach-700 hover:bg-peach-50 transition-colors text-center"
              >
                Inspect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
