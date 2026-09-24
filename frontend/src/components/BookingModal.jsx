import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlineClock,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ worker, offer, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date_time: '',
    address: user?.location || 'Dhaka, Bangladesh',
    notes: '',
  });
  const [durationHours, setDurationHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);

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
        (typeof offer?.service_id === 'string' ? offer.service_id : undefined);

      await api.post('/bookings', {
        worker_id: worker._id,
        service_id: resolvedServiceId,
        date_time: form.date_time,
        address: form.address,
        notes: form.notes,
        duration_hours: durationHours,
        estimatedCost,
      });
      toast.success('Job ticket dispatched successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-7 relative border border-amber-200/80"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <HiOutlineX className="text-xl" />
          </button>

            <div className="mb-5">
            <span className="font-mono text-xs font-bold text-[#C2410C] uppercase tracking-wider">
              DISPATCH ORDER SPECIFICATION
            </span>
            <h2 className="font-display font-extrabold text-2xl text-stone-900 mt-1">
              Book {worker.user_id?.name || worker.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Service: <span className="font-semibold text-stone-700">{worker.service_type}</span> ·{' '}
              <span className="font-mono font-bold text-[#C2410C]">
                {isHourly
                  ? `৳${hourlyRate}/hr`
                  : fixedPrice > 0
                  ? `৳${fixedPrice} Fixed Package`
                  : 'Rate on request'}
              </span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Preferred Date &amp; Time
                </label>
                <span className="text-[10px] font-mono text-[#C2410C] font-semibold">
                  Present or Future Only
                </span>
              </div>
              <div className="flex items-center gap-2.5 border border-stone-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/10 transition-all bg-amber-50/20">
                <HiOutlineCalendar className="text-[#C2410C] text-lg flex-shrink-0" />
                <input
                  required
                  type="datetime-local"
                  min={getMinDateTime()}
                  value={form.date_time}
                  onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 font-medium"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1 font-mono">
                * Past dates are disabled. Only present and upcoming dispatch times can be reserved.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Service Address / Location
              </label>
              <div className="flex items-center gap-2.5 border border-stone-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/10 transition-all">
                <HiOutlineLocationMarker className="text-stone-400 text-lg flex-shrink-0" />
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400"
                  placeholder="Street / Sector / Apartment / Dhaka"
                />
              </div>
            </div>

            {/* Duration Selector */}
            <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <HiOutlineClock className="text-[#C2410C] text-base" />
                  Select Required Duration
                </label>
                <span className="text-[11px] font-mono font-semibold text-[#9A3412]">
                  {isHourly ? `৳${hourlyRate} BDT / hour` : 'Fixed service scope'}
                </span>
              </div>

              {/* Quick Hours Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[1, 2, 3, 4, 6, 8].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDurationHours(h)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      durationHours === h
                        ? 'bg-gradient-to-r from-[#881337] to-[#C2410C] text-white shadow-xs scale-105'
                        : 'bg-white hover:bg-amber-100/70 text-stone-700 border border-stone-200/90'
                    }`}
                  >
                    {h} {h === 1 ? 'Hour' : 'Hours'}
                  </button>
                ))}
              </div>

              {/* Stepper for custom hours */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-600">Custom Duration:</span>
                <div className="flex items-center border border-amber-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                    disabled={durationHours <= 1}
                    className="w-8 h-8 flex items-center justify-center hover:bg-amber-50 text-stone-700 font-bold transition text-base disabled:opacity-30 disabled:cursor-not-allowed"
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
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Job Requirements &amp; Notes
              </label>
              <div className="border border-stone-200 rounded-xl p-3 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/10 transition-all">
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400 resize-none"
                  placeholder="Specify problem symptoms, required parts, or access instructions..."
                />
              </div>
            </div>

            {/* Dynamic Rate Calculation Breakdown */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-stone-600">
                <span>Calculation Basis:</span>
                <span className="font-mono font-medium text-stone-800">
                  {isHourly ? (
                    <>
                      ৳{hourlyRate}/hr × {durationHours} hr{durationHours > 1 ? 's' : ''}
                    </>
                  ) : (
                    <span>Fixed Scope (Est. {durationHours} hr{durationHours > 1 ? 's' : ''})</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200/70">
                <span className="font-semibold text-stone-700">Estimated Total Payable:</span>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="font-extrabold text-base text-[#9A3412]">
                    {estimatedCost ? `৳${estimatedCost}` : 'Rate on request'}
                  </span>
                  {estimatedCost > 0 && <span className="text-[10px] text-stone-500 font-bold">BDT</span>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-md shadow-[#C2410C]/20 hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submitting
                  ? 'Confirming Dispatch…'
                  : `Confirm & Dispatch Booking${estimatedCost ? ` (৳${estimatedCost})` : ''}`}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
