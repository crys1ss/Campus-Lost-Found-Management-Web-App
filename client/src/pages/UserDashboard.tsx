import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Claim, LostItem, PotentialMatch } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { ClaimModal } from '../components/ClaimModal';
import {
  FileQuestion,
  PlusCircle,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';

export const UserDashboard: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'lost' | 'claims' | 'matches'>('lost');

  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [claimTarget, setClaimTarget] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [lostRes, claimsRes, matchesRes] = await Promise.all([
        api.getLostItems({ myOnly: 'true' }),
        api.getMyClaims(),
        api.getMyMatches(),
      ]);

      setLostItems(lostRes.items);
      setClaims(claimsRes.claims);
      setMatches(matchesRes.matches);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const recoveredCount = claims.filter((c) => c.status === 'APPROVED' && c.item_status === 'RETURNED').length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'PENDING' || c.status === 'UNDER_REVIEW').length;

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900 font-sans">Login Required</h2>
        <p className="text-xs text-gray-500">
          Please log in with your NMIMS student account to access your personal dashboard.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-peach-500 text-white font-semibold text-sm hover:bg-peach-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-800 text-xs font-semibold mb-2">
            <span>Student Dashboard</span>
            {user.identifier && <span>• Roll No: {user.identifier}</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-sans">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {user.department || 'NMIMS MPSTME'} • {user.email}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/report-lost')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Report Lost Item</span>
          </button>
          <button
            onClick={() => navigate('/report-found')}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 font-semibold text-xs border border-cream-200 transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-peach-600" />
            <span>Report Found</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm">
          <p className="text-xs font-medium text-gray-500">My Lost Reports</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 mt-1 font-sans">
            {lostItems.length}
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">Active & historical</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm">
          <p className="text-xs font-medium text-gray-500">Active Claims</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 font-sans">
            {pendingClaimsCount}
          </p>
          <span className="text-[10px] text-amber-700 mt-1 block">Pending desk review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm">
          <p className="text-xs font-medium text-gray-500">Recovered Items</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-sans">
            {recoveredCount}
          </p>
          <span className="text-[10px] text-emerald-700 mt-1 block">Handover completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft-sm">
          <p className="text-xs font-medium text-gray-500">Potential Matches</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-peach-600 mt-1 font-sans">
            {matches.length}
          </p>
          <span className="text-[10px] text-peach-700 mt-1 block">Score ≥ 50%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('lost')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lost'
              ? 'border-peach-500 text-peach-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>My Lost Belongings ({lostItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'border-peach-500 text-peach-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Ownership Claims ({claims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 relative ${
            activeTab === 'matches'
              ? 'border-peach-500 text-peach-600'
              : 'border-transparent text-gray-500 hover:text-charcoal-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Potential Matches ({matches.length})</span>
          {matches.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-peach-500"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400">Loading user data...</div>
      ) : (
        <>
          {/* 1. My Lost Belongings */}
          {activeTab === 'lost' && (
            <div className="space-y-4">
              {lostItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-500">You haven't reported any lost belongings yet.</p>
                  <button
                    onClick={() => navigate('/report-lost')}
                    className="px-5 py-2.5 rounded-xl bg-peach-500 text-white font-semibold text-xs"
                  >
                    Report Misplaced Item
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      type="lost"
                      onSelect={(s) => setSelectedItem(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. My Ownership Claims */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              {claims.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-500">No ownership claims submitted yet.</p>
                  <button
                    onClick={() => navigate('/browse')}
                    className="px-5 py-2.5 rounded-xl bg-peach-500 text-white font-semibold text-xs"
                  >
                    Browse Found Items
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-white rounded-2xl p-5 border border-[#F3E8E2] shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-charcoal-900 font-sans">
                            {claim.item_title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              claim.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : claim.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {claim.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2">
                          <strong>My Submitted Proof:</strong> {claim.proof_description}
                        </p>

                        {claim.reviewer_remarks && (
                          <div className="bg-cream-50 p-2.5 rounded-xl text-xs text-charcoal-800 border border-cream-200 mt-2">
                            <strong>Officer Feedback:</strong> {claim.reviewer_remarks}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0 space-y-1 text-xs">
                        <p className="text-gray-400">
                          Claimed On: {new Date(claim.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-peach-700 font-medium">
                          Storage: {claim.storage_location || 'Security Desk'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Potential Matches */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3 max-w-md mx-auto">
                  <Sparkles className="w-8 h-8 text-peach-400 mx-auto" />
                  <h3 className="font-bold text-sm text-charcoal-900 font-sans">
                    No Potential Matches Yet
                  </h3>
                  <p className="text-xs text-gray-500">
                    When newly deposited property matches your reports with ≥ 50% confidence, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-2xl p-5 border border-peach-200/80 shadow-soft-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold bg-peach-100 text-peach-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-peach-600" />
                            {m.score}% Similarity Match
                          </span>
                          <span className="text-xs text-gray-400">
                            Found: {m.date_found}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-base text-charcoal-900 font-sans">
                            {m.found_title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Matches your lost report: <strong>"{m.lost_title}"</strong>
                          </p>
                        </div>

                        {/* Match Reasons Pill Grid */}
                        <div className="space-y-1 text-xs bg-cream-50 p-3 rounded-xl border border-cream-200">
                          <p className="font-semibold text-charcoal-800 text-[11px] mb-1">
                            Algorithmic Match Factors:
                          </p>
                          <ul className="space-y-1 text-[11px] text-gray-600">
                            {m.match_reasons.notes.map((note, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-peach-500"></span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Location: <strong>{m.found_location}</strong>
                        </div>
                        <button
                          onClick={() => {
                            setClaimTarget({
                              id: m.found_item_id,
                              title: m.found_title,
                              location: m.found_location,
                              storage_location: m.storage_location || 'Security Desk',
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs transition-all shadow-sm"
                        >
                          Claim This Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          type="lost"
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Claim Modal */}
      {claimTarget && (
        <ClaimModal
          item={claimTarget}
          onClose={() => setClaimTarget(null)}
          onSuccess={() => {
            loadUserData();
          }}
        />
      )}
    </div>
  );
};
