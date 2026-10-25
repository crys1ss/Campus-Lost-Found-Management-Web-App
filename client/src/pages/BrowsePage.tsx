import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Category, FoundItem, LostItem } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { ClaimModal } from '../components/ClaimModal';
import { Search, Filter, RefreshCw, AlertCircle, Layers } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'found' | 'lost'>('found');
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [claimItem, setClaimItem] = useState<FoundItem | null>(null);

  useEffect(() => {
    // Parse query params if any
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearch(q);

    loadCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeTab, search, selectedCategory, selectedLocation, selectedStatus]);

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.categories);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const filterParams: Record<string, string> = {};
      if (search) filterParams.search = search;
      if (selectedCategory) filterParams.category = selectedCategory;
      if (selectedLocation) filterParams.location = selectedLocation;
      if (selectedStatus) filterParams.status = selectedStatus;

      if (activeTab === 'found') {
        const res = await api.getFoundItems(filterParams);
        setItems(res.items);
      } else {
        const res = await api.getLostItems(filterParams);
        setItems(res.items);
      }
    } catch (err) {
      console.error('Error fetching items', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedStatus('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-sans">
            Campus Item Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Search and filter reported lost belongings and deposited found property.
          </p>
        </div>

        {/* Found vs Lost Switcher Tabs */}
        <div className="inline-flex bg-cream-100 p-1.5 rounded-2xl border border-cream-200 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab('found');
              setSelectedStatus('');
            }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'found'
                ? 'bg-peach-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-charcoal-900'
            }`}
          >
            Found Property ({activeTab === 'found' ? items.length : '...'})
          </button>
          <button
            onClick={() => {
              setActiveTab('lost');
              setSelectedStatus('');
            }}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'lost'
                ? 'bg-peach-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-charcoal-900'
            }`}
          >
            Lost Reports ({activeTab === 'lost' ? items.length : '...'})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#F3E8E2] shadow-soft-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, brand, details..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            >
              <option value="">All Campus Locations</option>
              <option value="Lab">Computer Labs (6th Floor)</option>
              <option value="Library">Central Library</option>
              <option value="402">Engineering Classrooms (402/403)</option>
              <option value="Canteen">Canteen & Cafeteria</option>
              <option value="Sports">Sports Complex & Badminton</option>
              <option value="Staircase">Staircases & Corridors</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-peach-500/20 focus:border-peach-500"
            >
              <option value="">All Statuses</option>
              {activeTab === 'found' ? (
                <>
                  <option value="UNCLAIMED">Unclaimed (Available)</option>
                  <option value="CLAIM_PENDING">Claim Under Review</option>
                  <option value="RETURNED">Returned to Owner</option>
                </>
              ) : (
                <>
                  <option value="OPEN">Open Search</option>
                  <option value="MATCH_PENDING">Match Under Review</option>
                  <option value="RESOLVED">Resolved / Recovered</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(search || selectedCategory || selectedLocation || selectedStatus) && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              Active filters applied • {items.length} records found
            </span>
            <button
              onClick={clearFilters}
              className="text-peach-600 font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Item Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 border border-gray-100 animate-pulse p-4 space-y-4">
              <div className="h-44 bg-cream-100 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-cream-100 text-peach-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-charcoal-900 font-sans">No matching items found</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Try adjusting your search keywords, location filters, or status options to expand results.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-peach-500 text-white rounded-xl text-xs font-semibold hover:bg-peach-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type={activeTab}
              onSelect={(selected) => setSelectedItem(selected)}
              onClaim={(target) => setClaimItem(target)}
            />
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          type={activeTab}
          onClose={() => setSelectedItem(null)}
          onClaim={(target) => {
            setSelectedItem(null);
            setClaimItem(target);
          }}
        />
      )}

      {/* Claim Modal */}
      {claimItem && (
        <ClaimModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
          onSuccess={() => {
            fetchItems();
          }}
        />
      )}
    </div>
  );
};
