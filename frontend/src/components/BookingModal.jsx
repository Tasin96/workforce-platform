import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiCheckCircle,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineCheck,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DURATION_PRESETS = [
  { hours: 1, label: '1 Hr', title: '1 Hour', desc: 'Quick diagnosis, single fixture or minor repair' },
  { hours: 2, label: '2 Hrs', title: '2 Hours', desc: 'Standard service, parts replacement or routine maintenance' },
  { hours: 3, label: '3 Hrs', title: '3 Hours', desc: 'Multi-room servicing or deep troubleshooting' },
  { hours: 4, label: 'Half Day', title: '4 Hours', desc: 'Extensive maintenance, renovation or complex installation' },
  { hours: 8, label: 'Full Day', title: '8 Hours', desc: 'Complete overhaul or comprehensive day-long project' },
];

const COMMON_NOTE_TAGS = [
  '⚡ Emergency repair',
  '🧰 Bring required spare parts',
  '📞 Call 15 mins before arrival',
  '🔍 Inspect and quote first',
  '🏢 Apartment security check-in required',
];

const POPULAR_AREAS = ['Gulshan', 'Banani', 'Uttara', 'Dhanmondi', 'Mirpur', 'Mohakhali'];

const BookingModal = ({ worker, offer, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date_time: '',
    address: user?.location || 'Dhaka, Bangladesh',
    notes: '',
  });
  const [durationHours, setDurationHours] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Extract worker & offer details
  const workerName = worker?.user_id?.name || worker?.user?.name || worker?.name || 'Verified Specialist';
  const workerAvatar = worker?.user?.avatar || worker?.user_id?.avatar || worker?.avatar || '';
  const workerService = worker?.service_type || offer?.service?.service_name || 'Trade Specialist';
  const workerRating = Number(worker?.rating) || 4.9;
  const workerRatingCount = worker?.rating_count || worker?.ratingCount || 18;
  const completedJobs = worker?.completed_jobs || worker?.completedJobs || 45;
  const isVerified = worker?.is_verified ?? true;

  // Extract rates
  const hourlyRate = Number(
    offer?.hourly_rate ?? worker?.offers?.[0]?.hourly_rate ?? worker?.hourly_rate ?? 0
  );
  const fixedPrice = Number(
    offer?.fixed_price ?? worker?.offers?.[0]?.fixed_price ?? worker?.fixed_price ?? 0
  );
  const isHourly = hourlyRate > 0;
  const estimatedCost = isHourly
    ? hourlyRate * durationHours
    : fixedPrice > 0
    ? fixedPrice
    : 0;

  // Calculate minimum selectable datetime (now) in local ISO format YYYY-MM-DDTHH:mm
  const getMinDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  // Helper to set quick date & time presets
  const setQuickDate = (mode) => {
    const d = new Date();
    if (mode === 'soon') {
      d.setHours(d.getHours() + 2, 0, 0, 0);
    } else if (mode === 'tomorrow_morning') {
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
    } else if (mode === 'tomorrow_afternoon') {
      d.setDate(d.getDate() + 1);
      d.setHours(15, 0, 0, 0);
    } else if (mode === 'weekend') {
      const day = d.getDay();
      const daysUntilFri = (5 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilFri);
      d.setHours(11, 0, 0, 0);
    }
    const offset = d.getTimezoneOffset() * 60000;
    const localIso = new Date(d.getTime() - offset).toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, date_time: localIso }));
    toast.success('Time slot selected!');
  };

  // Helper to toggle notes tag
  const toggleNoteTag = (tag) => {
    setForm((prev) => {
      const current = prev.notes.trim();
      if (!current) return { ...prev, notes: tag };
      if (current.includes(tag)) {
        return {
          ...prev,
          notes: current
            .replace(tag, '')
            .replace(/,\s*,/g, ',')
            .replace(/^,\s*/, '')
            .replace(/,\s*$/, '')
            .trim(),
        };
      }
      return { ...prev, notes: `${current}, ${tag}` };
    });
  };

  // Helper to append area to address
  const handleSelectArea = (area) => {
    setForm((prev) => {
      const current = prev.address.trim();
      if (current.toLowerCase().includes(area.toLowerCase())) return prev;
      return { ...prev, address: `${area}, Dhaka, Bangladesh` };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to confirm a booking.');
      navigate('/login');
      return;
    }
    if (user.role !== 'customer' && user.role !== 'admin') {
      toast.error('Only customer and admin accounts can book specialists.');
      return;
    }

    if (!form.date_time) {
      toast.error('Please select an appointment date and time.');
      return;
    }

    // Verify date is present or future
    const selectedDate = new Date(form.date_time);
    const now = new Date();
    if (selectedDate < new Date(now.getTime() - 2 * 60 * 1000)) {
      toast.error('Past dates cannot be selected. Please choose a present or future date and time.');
      return;
    }

    setSubmitting(true);
    try {
      const resolvedServiceId =
        offer?.service_id?._id ||
        offer?.service_id?.service_id ||
        (typeof offer?.service_id === 'string' ? offer.service_id : undefined) ||
        worker?.offers?.[0]?.service_id?._id ||
        worker?.offers?.[0]?.service_id?.service_id ||
        (typeof worker?.offers?.[0]?.service_id === 'string' ? worker.offers[0].service_id : undefined);

      const resolvedWorkerId = worker?._id || worker?.worker_id || worker?.id;

      await api.post('/bookings', {
        worker_id: resolvedWorkerId,
        service_id: resolvedServiceId,
        date_time: form.date_time,
        address: form.address,
        notes: form.notes,
        duration_hours: durationHours,
        estimatedCost,
      });
      toast.success('Booking requested successfully! Specialist notified.');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPreset = DURATION_PRESETS.find((p) => p.hours === durationHours);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl relative border border-amber-200/90 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#9A3412] p-5 sm:p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
              title="Close modal (Esc)"
            >
              <HiOutlineX className="text-lg" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 flex items-center gap-1 font-bold">
                <HiOutlineSparkles className="text-xs text-amber-300" /> Easy 3-Step Booking
              </span>
              <span className="text-amber-200/50 text-xs">•</span>
              <span className="text-amber-100/90 text-xs font-medium">100% Escrow Protected</span>
            </div>

            {/* Worker Profile Snapshot */}
            <div className="flex items-center gap-3.5 mt-2">
              <div className="relative shrink-0">
                {workerAvatar ? (
                  <img
                    src={workerAvatar}
                    alt={workerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300/80 shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl border-2 border-amber-300/80 shadow-md">
                    {workerName.charAt(0)}
                  </div>
                )}
                {isVerified && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 rounded-full p-0.5 shadow-sm"
                    title="Verified Platform Professional"
                  >
                    <HiCheckCircle className="text-sm" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate">
                    {workerName}
                  </h2>
                  <span className="text-xs bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-md font-semibold shrink-0">
                    {workerService}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-amber-100/80 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-amber-200">
                    <HiOutlineStar className="text-amber-300 text-sm" /> {workerRating.toFixed(1)}
                    <span className="text-amber-100/60 font-normal">({workerRatingCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span>{completedJobs}+ Jobs Completed</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-amber-300">
                    {isHourly ? `৳${hourlyRate}/hr` : fixedPrice > 0 ? `৳${fixedPrice} Fixed` : 'Negotiable'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={submit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Step 1: Appointment Schedule */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[10px] font-mono">
                    1
                  </span>
                  Select Preferred Date &amp; Time
                </label>
                <span className="text-[11px] font-mono text-[#C2410C] font-semibold">
                  Upcoming slots only
                </span>
              </div>

              {/* Quick Date Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'soon', label: 'Today (In 2h)', sub: 'Fast Dispatch' },
                  { id: 'tomorrow_morning', label: 'Tomorrow', sub: '10:00 AM' },
                  { id: 'tomorrow_afternoon', label: 'Tomorrow', sub: '3:00 PM' },
                  { id: 'weekend', label: 'Weekend', sub: '11:00 AM' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setQuickDate(slot.id)}
                    className="p-2 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-100/60 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-stone-800 group-hover:text-[#9A3412]">
                      {slot.label}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">{slot.sub}</div>
                  </button>
                ))}
              </div>

              {/* Date Input with Icon */}
              <div className="flex items-center gap-2.5 border border-stone-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/15 transition-all bg-white shadow-2xs">
                <HiOutlineCalendar className="text-[#C2410C] text-lg shrink-0" />
                <input
                  required
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={form.date_time}
                  onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 font-medium cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                * You can modify or reschedule with the specialist free of charge.
              </p>
            </div>

            {/* Step 2: Duration Selector */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[10px] font-mono">
                    2
                  </span>
                  How Long Do You Need The Specialist?
                </label>
                <span className="text-[11px] font-mono font-bold text-[#9A3412]">
                  {isHourly ? `৳${hourlyRate} BDT / hr` : 'Standard Package'}
                </span>
              </div>

              {/* Quick Hours Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {DURATION_PRESETS.map((p) => {
                  const active = durationHours === p.hours;
                  return (
                    <button
                      key={p.hours}
                      type="button"
                      onClick={() => setDurationHours(p.hours)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                        active
                          ? 'border-[#C2410C] bg-gradient-to-r from-[#881337] to-[#C2410C] text-white shadow-sm ring-2 ring-[#C2410C]/20 scale-102'
                          : 'border-stone-200 bg-white hover:bg-amber-50/60 text-stone-700'
                      }`}
                    >
                      <span className="text-xs font-bold font-mono">{p.label}</span>
                      <span className={`text-[10px] ${active ? 'text-amber-200' : 'text-stone-400'}`}>
                        {isHourly ? `৳${hourlyRate * p.hours}` : 'Package'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Stepper + Custom Duration Counter */}
              <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <HiOutlineClock className="text-[#C2410C]" />
                    {selectedPreset ? selectedPreset.title : `${durationHours} Hours`}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    {selectedPreset?.desc || 'Custom on-site duration tailored for your requirements.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500 font-semibold hidden sm:inline">Adjust:</span>
                  <div className="flex items-center border border-amber-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                      disabled={durationHours <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 text-stone-700 font-bold transition text-base disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Decrease hours"
                    >
                      -
                    </button>
                    <div className="px-3 py-1 font-mono font-bold text-sm text-[#881337] min-w-[3.5rem] text-center border-x border-amber-200 bg-amber-50/30">
                      {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDurationHours((prev) => Math.min(24, prev + 1))}
                      disabled={durationHours >= 24}
                      className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 text-stone-700 font-bold transition text-base disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Increase hours"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Service Address / Location */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[10px] font-mono">
                    3
                  </span>
                  Service Location / Address
                </label>
                <span className="text-[11px] text-stone-400">On-site dispatch</span>
              </div>

              <div className="flex items-center gap-2.5 border border-stone-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/15 transition-all bg-white shadow-2xs">
                <HiOutlineLocationMarker className="text-[#C2410C] text-lg shrink-0" />
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400 font-medium"
                  placeholder="Apartment, House #, Road #, Area..."
                />
              </div>

              {/* Quick Area Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-stone-400 mr-1">Quick Add:</span>
                {POPULAR_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleSelectArea(area)}
                    className="text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-amber-100 hover:text-[#9A3412] px-2 py-0.5 rounded-lg transition"
                  >
                    + {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Requirements & Common Symptom Tags */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Job Requirements &amp; Notes (Optional)
              </label>

              {/* Quick Note Tags */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_NOTE_TAGS.map((tag) => {
                  const selected = form.notes.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleNoteTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1 ${
                        selected
                          ? 'border-[#C2410C] bg-amber-50 text-[#9A3412] font-semibold'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300'
                      }`}
                    >
                      {selected && <HiOutlineCheck className="text-xs text-[#C2410C]" />}
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="border border-stone-200 rounded-xl p-3 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/15 transition-all bg-white">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400 resize-none"
                  placeholder="Specify problem details, access gates, or spare parts needed..."
                />
              </div>
            </div>

            {/* Comprehensive Price & Escrow Summary Box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="font-semibold text-stone-700">Cost Calculation:</span>
                <span className="font-mono text-stone-800 font-bold">
                  {isHourly ? (
                    <>
                      ৳{hourlyRate}/hr × {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                    </>
                  ) : (
                    <span>Fixed Scope (Est. {durationHours} hrs)</span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <HiOutlineShieldCheck className="text-sm" /> 100% Escrow Protection
                </span>
                <span className="font-mono text-emerald-700 font-bold uppercase text-[11px]">
                  Included (Free)
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Total Estimated Amount</span>
                  <span className="text-[10px] text-stone-500">Pay only upon work satisfaction</span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-2xl font-black text-[#881337]">
                    ৳{estimatedCost}
                  </span>
                  <span className="text-xs font-bold text-stone-600">BDT</span>
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-lg shadow-[#C2410C]/25 hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Dispatching Request…</span>
                ) : (
                  <>
                    <HiOutlineCheck className="text-lg font-bold" />
                    <span>Confirm &amp; Book Specialist · ৳{estimatedCost} BDT</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
                <HiOutlineInformationCircle className="text-sm text-[#C2410C]" />
                <span>Zero upfront charge · Reschedule or cancel anytime before specialist arrives</span>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
