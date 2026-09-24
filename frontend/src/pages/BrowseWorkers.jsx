import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiX,
} from 'react-icons/hi';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';
import LoadingSpinner from '../components/LoadingSpinner';

const trades = ['All', 'Electrician', 'Plumber', 'Painter', 'Carpenter', 'Gardener', 'Cleaner'];

const BrowseWorkers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get('search') || '');
  const [trade, setTrade] = useState(searchParams.get('trade') || 'All');
  const [minRating, setMinRating] = useState(0);

  const fetchWorkers = async (activeTrade = trade, activeQ = q, activeRating = minRating) => {
    setLoading(true);
    try {
      const params = {};
      if (activeQ) params.q = activeQ;
      if (activeTrade !== 'All') params.service = activeTrade;
      if (activeRating) params.minRating = activeRating;
      const { data } = await api.get('/workers', { params });
      setWorkers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Sync state and fetch when URL params change
  useEffect(() => {
    const urlTrade = searchParams.get('trade') || 'All';
    const urlSearch = searchParams.get('search') || '';
    setTrade(urlTrade);
    setQ(urlSearch);
    fetchWorkers(urlTrade, urlSearch, minRating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchWorkers(trade, q, minRating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minRating]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (q) params.search = q;
    if (trade !== 'All') params.trade = trade;
    setSearchParams(params);
    fetchWorkers(trade, q, minRating);
  };

  const selectTrade = (t) => {
    setTrade(t);
    const params = {};
    if (q) params.search = q;
    if (t !== 'All') params.trade = t;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQ('');
    setTrade('All');
    setMinRating(0);
    setSearchParams({});
    fetchWorkers('All', '', 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      {/* Header section */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 text-[#9A3412] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-amber-300/80">
            SPECIALIST DIRECTORY
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight">
            Find Verified Local Specialists
          </h1>
          <p className="text-stone-600 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
            Search qualified electricians, plumbers, carpenters, and painters. All professionals have background checks and client ratings.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-600 bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-200/80">
          <HiOutlineCheckCircle className="text-[#C2410C] text-base" />
          <span>{workers.length} Specialists Available</span>
        </div>
      </div>

      {/* Trade Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-6">
        {trades.map((t) => (
          <button
            key={t}
            onClick={() => selectTrade(t)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              trade === t
                ? 'bg-gradient-to-r from-[#881337] to-[#C2410C] text-white shadow-md'
                : 'bg-white text-stone-700 hover:bg-amber-50/50 border border-amber-200/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <form
        onSubmit={onSearchSubmit}
        className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-card flex flex-wrap gap-3 items-center mb-10"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px] bg-amber-50/30 border border-amber-200/80 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:bg-white transition-all">
          <HiOutlineSearch className="text-amber-700/60 text-lg flex-shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by specialist name, trade, skill, or location…"
            className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400 font-medium"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} className="text-stone-400 hover:text-stone-600">
              <HiX className="text-base" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-amber-50/30 border border-amber-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 outline-none focus:border-[#C2410C] cursor-pointer"
          >
            <option value={0}>Any Rating</option>
            <option value={4}>★ 4.0 &amp; Above</option>
            <option value={4.5}>★ 4.5 &amp; Above</option>
            <option value={4.8}>★ 4.8 &amp; Above</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
          >
            <HiOutlineFilter /> Search
          </button>

          {(q || trade !== 'All' || minRating > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-stone-500 hover:text-[#881337] px-3 py-2"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Worker Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching verified specialists…" />
      ) : workers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-amber-200 p-8 shadow-xs">
          <p className="text-stone-500 text-base">No workers match your active search filters.</p>
          <button
            onClick={clearFilters}
            className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#881337] to-[#C2410C] text-white text-xs font-bold shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((w, i) => (
            <WorkerCard key={w._id} worker={w} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BrowseWorkers;
