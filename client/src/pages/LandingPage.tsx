import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { FoundItem } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { ClaimModal } from '../components/ClaimModal';
import {
  Search,
  PlusCircle,
  FileQuestion,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Database,
  Terminal,
} from 'lucide-react';

export const LandingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [stats, setStats] = useState<any>({
    lostCount: 5,
    foundCount: 6,
    returnedCount: 2,
    inCustodyCount: 4,
    recoveryRate: 40,
  });
  const [recentItems, setRecentItems] = useState<FoundItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [claimItem, setClaimItem] = useState<FoundItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsRes = await api.getStats();
      setStats(statsRes);
      const itemsRes = await api.getFoundItems({ status: 'UNCLAIMED' });
      setRecentItems(itemsRes.items.slice(0, 6));
    } catch (err) {
      console.error('Error loading landing page data', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full hero-glow pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* College Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach-100/80 border border-peach-200/80 text-peach-900 text-xs font-semibold shadow-soft-sm">
            <Award className="w-4 h-4 text-peach-600" />
            <span>SVKM's NMIMS MPSTME • Software Engineering Project</span>
            <span className="w-1.5 h-1.5 rounded-full bg-peach-500"></span>
            <span className="text-peach-700">Experiments 1–10</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight font-sans leading-tight">
            Campus <span className="text-transparent bg-clip-text peach-gradient">Lost & Found</span>{' '}
            Management System
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            A unified campus platform for students, faculty, and security to report misplaced items,
            discover automated potential matches, and execute formal custody verifications with audit receipts.
          </p>

          {/* Instant Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto mt-6 flex items-center bg-white p-2 rounded-2xl shadow-soft-lg border border-[#F3E8E2] focus-within:ring-2 focus-within:ring-peach-500/30 transition-all"
          >
            <div className="pl-3 pr-2 text-gray-400">
              <Search className="w-5 h-5 text-peach-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, item name, brand, color, or location..."
              className="w-full py-2.5 text-sm text-charcoal-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-sm transition-all shadow-md shadow-peach-500/20 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/report-lost')}
              className="px-6 py-3 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-semibold text-sm transition-all shadow-md shadow-peach-500/20 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <FileQuestion className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => navigate('/report-found')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-cream-100 text-charcoal-900 border border-[#EBDDCF] font-semibold text-sm transition-all shadow-soft-sm flex items-center gap-2 hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-peach-600" />
              <span>Report Found Item</span>
            </button>

            <button
              onClick={() => navigate('/experiments')}
              className="px-5 py-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-900 font-semibold text-sm transition-all flex items-center gap-2 border border-peach-200"
            >
              <Sparkles className="w-4 h-4 text-peach-600" />
              <span>Lab Experiments 1–10 Showcase</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Statistics Counter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8E2] shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          <div className="pt-4 lg:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-sans">
              {stats.lostCount}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">Lost Reports Logged</p>
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-peach-600 font-sans">
              {stats.foundCount}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">Found Items Deposited</p>
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-sans">
              {stats.returnedCount}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
              Successful Handover Receipts
            </p>
          </div>

          <div className="pt-4 lg:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-charcoal-800 font-sans">
              {stats.inCustodyCount}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
              Securely Held in Custody
            </p>
          </div>
        </div>
      </section>

      {/* How the Recovery Process Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-xs font-bold text-peach-600 uppercase tracking-widest">
            Streamlined Campus Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-sans">
            How Lost Items Are Recovered
          </h3>
          <p className="text-sm text-gray-500">
            Engineered according to the Activity and Sequence diagrams from Experiments 4 & 6.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-[#F3E8E2] shadow-soft-sm hover:shadow-soft transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-700 font-bold flex items-center justify-center text-sm shadow-sm group-hover:bg-peach-500 group-hover:text-white transition-colors">
              01
            </div>
            <h4 className="text-lg font-bold text-charcoal-900 font-sans">Report & Smart Matching</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Students report lost or found belongings with color, category, location, and date.
              Our rule-based matching engine instantly computes similarity scores and flags candidates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-[#F3E8E2] shadow-soft-sm hover:shadow-soft transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-700 font-bold flex items-center justify-center text-sm shadow-sm group-hover:bg-peach-500 group-hover:text-white transition-colors">
              02
            </div>
            <h4 className="text-lg font-bold text-charcoal-900 font-sans">Security Custody & Proof</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Found items are handed over to Campus Security Desk and catalogued into designated safe lockers.
              Sensitive identifying details remain secret to block fraudulent claims.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-[#F3E8E2] shadow-soft-sm hover:shadow-soft transition-all space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-peach-100 text-peach-700 font-bold flex items-center justify-center text-sm shadow-sm group-hover:bg-peach-500 group-hover:text-white transition-colors">
              03
            </div>
            <h4 className="text-lg font-bold text-charcoal-900 font-sans">Verification & Receipt</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Security officers review submitted claims and verify physical proof and student ID.
              Upon handover, an official return receipt code is logged into the audit ledger.
            </p>
          </div>
        </div>
      </section>

      {/* Recently Found Belongings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold text-peach-600 uppercase tracking-widest">
              Live Campus Catalogue
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-sans">
              Recently Reported Found Items
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Currently held in security storage awaiting ownership claims.
            </p>
          </div>

          <button
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-peach-600 hover:text-peach-700 transition-colors"
          >
            <span>View All Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">No found items currently pending claim.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                type="found"
                onSelect={(selected) => setSelectedItem(selected)}
                onClaim={(target) => setClaimItem(target)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lab Showcase Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="peach-gradient rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Evaluator & Teacher Showcase</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold font-sans leading-tight">
              Software Engineering Lab Experiments 1 through 10
            </h3>
            <p className="text-cream-100 text-sm sm:text-base leading-relaxed opacity-95">
              Explore our interactive showcase mapping requirements engineering, agile user stories,
              StarUML diagrams (Use Case, Activity, Class, Sequence, Collaboration), 3NF Normalization,
              interactive SQL TCL/DCL transaction simulation, and MongoDB CRUD playground.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => navigate('/experiments')}
              className="px-8 py-4 rounded-2xl bg-white text-peach-700 font-bold text-sm sm:text-base hover:bg-cream-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Open Lab Showcase
            </button>
          </div>
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          type="found"
          onClose={() => setSelectedItem(null)}
          onClaim={(target) => {
            setSelectedItem(null);
            setClaimItem(target);
          }}
        />
      )}

      {/* Claim Submission Modal */}
      {claimItem && (
        <ClaimModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
          onSuccess={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
