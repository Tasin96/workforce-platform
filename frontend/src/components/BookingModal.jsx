import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineDocumentText } from 'react-icons/hi';
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
  const [submitting, setSubmitting] = useState(false);

  const estimatedCost = offer?.hourly_rate || offer?.fixed_price || 0;

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
              // DISPATCH ORDER SPECIFICATION
            </span>
            <h2 className="font-display font-extrabold text-2xl text-stone-900 mt-1">
              Book {worker.user_id?.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Service: <span className="font-semibold text-stone-700">{worker.service_type}</span> ·{' '}
              <span className="font-mono font-bold text-[#C2410C]">
                {estimatedCost ? `৳${estimatedCost}` : 'Rate on request'}
              </span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Preferred Date &amp; Time
              </label>
              <div className="flex items-center gap-2.5 border border-stone-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/10 transition-all">
                <HiOutlineCalendar className="text-stone-400 text-lg flex-shrink-0" />
                <input
                  required
                  type="datetime-local"
                  value={form.date_time}
                  onChange={(e) => setForm({ ...form, date_time: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 font-medium"
                />
              </div>
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

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Job Requirements &amp; Notes
              </label>
              <div className="border border-stone-200 rounded-xl p-3 focus-within:border-[#C2410C] focus-within:ring-2 focus-within:ring-[#C2410C]/10 transition-all">
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400 resize-none"
                  placeholder="Specify problem symptoms, required parts, or access instructions..."
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
              <span className="font-medium text-stone-600">Estimated Total Rate:</span>
              <span className="font-mono font-extrabold text-sm text-[#9A3412]">
                {estimatedCost ? `৳${estimatedCost} BDT` : 'To be confirmed'}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-md shadow-[#C2410C]/20 hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submitting ? 'Confirming Dispatch…' : 'Confirm & Dispatch Booking'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
