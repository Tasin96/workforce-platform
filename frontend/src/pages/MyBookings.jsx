import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineCreditCard,
  HiOutlineExclamationCircle,
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlinePhone,
  HiArrowRight,
  HiOutlineDocumentText,
  HiOutlineClipboardCopy,
  HiCheck,
} from 'react-icons/hi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PaymentModal from '../components/PaymentModal';
import InvoiceReceiptModal from '../components/InvoiceReceiptModal';

const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'in_progress',
  in_progress: 'completed',
};

// --- Modern Review Form Component ---
const ReviewForm = ({ booking, onDone, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { booking_id: booking._id, rating, comment });
      toast.success('Review submitted successfully — thank you!');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const bookingCode = String(booking._id || '').slice(-6).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-5 rounded-2xl bg-amber-50/70 border border-amber-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <HiOutlineStar className="text-amber-500 text-base" />
          Review Specialist for Job #{bookingCode}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Rating (1 to 5 Stars)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setRating(val)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  rating >= val
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-400 hover:border-amber-300'
                }`}
              >
                ★ {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
            Feedback &amp; Quality Notes
          </label>
          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about punctuality, trade skill, and resolution quality..."
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-amber-500 bg-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Modern Payment Form Component ---
const PaymentForm = ({ booking, onDone, onCancel }) => {
  const [method, setMethod] = useState('mobile_banking');
  const [amount, setAmount] = useState(booking.estimatedCost || 500);
  const [customTxn, setCustomTxn] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const RECIPIENT_PHONE = '+8801717408075';
  const RECIPIENT_NAME = 'Tasin Islam (Platform Escrow)';

  const copyNumber = () => {
    navigator.clipboard.writeText(RECIPIENT_PHONE);
    setCopied(true);
    toast.success(`Copied ${RECIPIENT_PHONE} to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateDemoTrxId = () => {
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    const prefix = method === 'mobile_banking' ? 'BKASH' : 'TXN';
    const generated = `${prefix}-${randomHex}`;
    setCustomTxn(generated);
    toast.success(`Generated Demo Ref: ${generated}`);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let finalTxn = customTxn.trim();
      if (!finalTxn) {
        finalTxn =
          method === 'card'
            ? `CARD-${Date.now().toString().slice(-6)}`
            : method === 'cash'
            ? `CASH-${Date.now().toString().slice(-6)}`
            : `MBL-${Date.now().toString().slice(-6)}`;
      }

      await api.post('/payments', {
        booking_id: booking._id,
        amount: parseFloat(amount),
        method,
        transaction_id: finalTxn,
      });
      toast.success(`Payment of ৳${amount} confirmed!`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  const bookingCode = String(booking._id || '').slice(-6).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-5 sm:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <HiOutlineCurrencyDollar className="text-emerald-600 text-base" />
          Settle Escrow Payment for Job #{bookingCode}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
            Select Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mobile_banking', label: 'bKash / Nagad', icon: '📱' },
              { id: 'card', label: 'Debit / Credit', icon: '💳' },
              { id: 'cash', label: 'Cash Settlement', icon: '💵' },
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`py-2 px-2 text-xs rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  method === m.id
                    ? 'border-emerald-600 bg-white text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                }`}
              >
                <span className="text-base">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MFS Recipient Info Box */}
        {method === 'mobile_banking' && (
          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Official Merchant / Personal Account
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Tasin Islam
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm sm:text-base font-mono font-extrabold text-slate-900">
                {RECIPIENT_PHONE}
              </span>
              <button
                type="button"
                onClick={copyNumber}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition flex items-center gap-1 shrink-0 shadow-2xs"
              >
                {copied ? <HiCheck className="text-emerald-400 text-sm" /> : <HiOutlineClipboardCopy className="text-sm" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Send Money or Payment of ৳{amount} BDT to this number and enter the TrxID below.
            </p>
          </div>
        )}

        {method === 'cash' && (
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-slate-600">
            <strong>Cash on Completion:</strong> Settle payment directly with the technician upon satisfactory service inspection. A verified receipt code will be logged.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Amount (৳ BDT)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-600 bg-white font-mono"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Transaction ID {method === 'cash' ? '(Optional)' : '(TrxID)'}
              </label>
              <button
                type="button"
                onClick={handleGenerateDemoTrxId}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                ⚡ Auto-Fill
              </button>
            </div>
            <input
              type="text"
              placeholder={method === 'cash' ? 'Receipt reference' : 'e.g. 9H7D6S2A or Auto-fill'}
              value={customTxn}
              onChange={(e) => setCustomTxn(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-600 bg-white font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center gap-1.5"
          >
            <HiOutlineShieldCheck className="text-base" />
            {submitting ? 'Confirming…' : `Confirm Payment of ৳${amount}`}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Modern Dispute Form Component ---
const DisputeForm = ({ booking, onDone, onCancel }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/disputes', {
        booking_id: booking._id,
        reason: reason.trim(),
      });
      toast.success('Dispute submitted for admin review and arbitration.');
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not raise dispute');
    } finally {
      setSubmitting(false);
    }
  };

  const bookingCode = String(booking._id || '').slice(-6).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-5 rounded-2xl bg-rose-50/70 border border-rose-200"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
          <HiExclamationCircle className="text-rose-600 text-base" />
          Raise Dispute on Job #{bookingCode}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <p className="text-xs text-rose-800 leading-relaxed">
          Platform leadership (Founder Tasin Islam &amp; Co-Founders Ahosan Habib and Farhan Ahmed) review disputes to mediate between customers and specialists. Please detail the issue:
        </p>
        <textarea
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain the problem (e.g. incomplete work, billing disagreement, specialist no-show)..."
          className="w-full border border-rose-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-rose-600 bg-white resize-none"
        />
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Dispute for Review'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Main MyBookings Page ---
const MyBookings = () => {
  const { user } = useAuth();
  const { id: paramBookingId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeAction, setActiveAction] = useState({ id: null, type: null });
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (booking) => {
    try {
      await api.put(`/bookings/${booking._id}/status`, { status: NEXT_STATUS[booking.status] });
      toast.success(`Job advanced to ${NEXT_STATUS[booking.status].replace('_', ' ')}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const cancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${booking._id}/status`, {
        status: 'cancelled',
        cancellation_reason: 'Cancelled by user',
      });
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const toggleAction = (id, type) => {
    if (activeAction.id === id && activeAction.type === type) {
      setActiveAction({ id: null, type: null });
    } else {
      setActiveAction({ id, type });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (paramBookingId) {
      return b._id === paramBookingId || b.id === paramBookingId;
    }
    if (filter === 'active') return ['pending', 'accepted', 'in_progress'].includes(b.status);
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  if (loading) return <LoadingSpinner label="Fetching booking records…" />;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-amber-200/80 shadow-md shadow-amber-900/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-[#9A3412] border border-amber-200">
                Verified Service Dispatches
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
              My Bookings &amp; Service Orders
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Track appointments, payments, ratings, and active disputes in real time.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-50/70 border border-amber-200/60 rounded-xl self-start sm:self-center">
            {[
              { id: 'all', label: `All (${bookings.length})` },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] text-white shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/80 p-12 text-center shadow-md shadow-amber-900/5 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-[#C2410C] flex items-center justify-center">
              <HiOutlineCalendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">No bookings match this filter</h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore verified specialists to schedule appointments and dispatch services.
              </p>
            </div>
            <a
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-md shadow-[#C2410C]/20 transition"
            >
              Browse Specialists
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b, i) => {
              const bookingCode = String(b._id || '').slice(-6).toUpperCase();
              const hasPayment = Boolean(b.payment);
              const hasReview = Boolean(b.review);
              const activeDispute = b.disputes && b.disputes.length > 0 ? b.disputes[0] : null;

              // Roles check
              const isCustomer = user?.role === 'customer';
              const isWorker = user?.role === 'worker';
              const isAdmin = user?.role === 'admin';

              const customerName = b.customer_id?.name || 'Customer';
              const customerPhone = b.customer_id?.phone || 'Verified';
              const workerName = b.worker_id?.user_id?.name || 'Specialist';
              const workerPhone = b.worker_id?.user_id?.phone || 'Verified';
              const workerTrade = b.worker_id?.service_type || b.service_id?.service_name || 'Trade Specialist';

              return (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.25) }}
                  className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-md shadow-amber-900/5 hover:shadow-lg transition-shadow"
                >
                  {/* Card Top: Code, Service Name, Status */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#9A3412] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          #{bookingCode}
                        </span>
                        <h2 className="text-lg font-bold text-stone-900">
                          {b.service_id?.service_name || 'Service Dispatch'}
                        </h2>
                      </div>

                      {/* Participant Details */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                        {isCustomer && (
                          <div className="flex items-center gap-1.5">
                            <HiOutlineBriefcase className="text-[#C2410C]" />
                            <span>Specialist:</span>
                            <span className="font-semibold text-stone-800">{workerName}</span>
                            <span className="text-stone-400">({workerTrade})</span>
                            <span className="text-stone-400">• {workerPhone}</span>
                          </div>
                        )}

                        {isWorker && (
                          <div className="flex items-center gap-1.5">
                            <HiOutlineUser className="text-[#C2410C]" />
                            <span>Client:</span>
                            <span className="font-semibold text-stone-800">{customerName}</span>
                            <span className="text-stone-400">• {customerPhone}</span>
                          </div>
                        )}

                        {isAdmin && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span>
                              Client: <strong className="text-stone-800">{customerName}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Specialist: <strong className="text-stone-800">{workerName}</strong> ({workerTrade})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>

                  {/* Telemetry Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-5 text-xs text-stone-500">
                    <span className="flex items-center gap-1.5">
                      <HiOutlineCalendar className="text-[#C2410C] text-sm" />
                      {new Date(b.date_time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HiOutlineLocationMarker className="text-[#C2410C] text-sm" />
                      {b.address || 'Address provided on file'}
                    </span>
                    {b.estimatedCost > 0 && (
                      <span className="font-mono font-bold text-[#881337]">
                        Rate / Est: ৳{b.estimatedCost} BDT
                      </span>
                    )}
                  </div>

                  {b.notes && (
                    <p className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 italic">
                      "{b.notes}"
                    </p>
                  )}

                  {/* Badges for Payments, Reviews, and Disputes */}
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    {/* Payment chip */}
                    {hasPayment ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-[#881337] font-mono px-3 py-1.5 rounded-xl border border-amber-200">
                          <HiCheckCircle className="text-[#C2410C] text-base" />
                          <span className="font-bold">PAID ৳{b.payment.amount}</span>
                          <span className="text-[#9A3412]">via {b.payment.method?.replace('_', ' ')}</span>
                          {b.payment.transaction_id && (
                            <span className="text-[10px] text-stone-500">[{b.payment.transaction_id}]</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentForInvoice({ ...b.payment, booking: b })}
                          className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-[#9A3412] text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
                        >
                          <HiOutlineDocumentText className="text-sm text-[#C2410C]" /> View Receipt
                        </button>
                      </div>
                    ) : (
                      b.status !== 'cancelled' && (
                        <span className="text-xs bg-stone-100 text-stone-600 font-mono px-2.5 py-1 rounded-lg border border-stone-200">
                          Payment: Pending
                        </span>
                      )
                    )}

                    {/* Review chip */}
                    {hasReview && (
                      <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 font-mono px-3 py-1.5 rounded-xl border border-amber-200">
                        <span className="text-amber-500 font-bold">★ {b.review.rating}.0</span>
                        <span className="italic text-stone-700">"{b.review.comment}"</span>
                      </div>
                    )}

                    {/* Dispute chip */}
                    {activeDispute && (
                      <div className="flex items-center gap-1.5 text-xs bg-rose-50 text-rose-800 font-mono px-3 py-1.5 rounded-xl border border-rose-200">
                        <HiExclamationCircle className="text-rose-600 text-base" />
                        <span className="font-bold">Dispute [{activeDispute.status}]:</span>
                        <span className="italic text-stone-700">"{activeDispute.reason}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2.5">
                    {/* Worker advance button */}
                    {isWorker && NEXT_STATUS[b.status] && (
                      <button
                        type="button"
                        onClick={() => advance(b)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#881337] to-[#C2410C] hover:from-[#9F1239] hover:to-[#EA580C] text-white text-xs font-bold shadow-sm transition"
                      >
                        Advance to {NEXT_STATUS[b.status].replace('_', ' ')}
                      </button>
                    )}

                    {/* Cancel button */}
                    {['pending', 'accepted'].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => cancel(b)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {/* Pay Now button (Customer or Admin) */}
                    {(isCustomer || isAdmin) && !hasPayment && b.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForPayment(b)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-sm shadow-[#C2410C]/20 transition flex items-center gap-1.5"
                      >
                        <HiOutlineCreditCard className="text-sm" />
                        Settle ৳{b.estimatedCost || '500'}
                      </button>
                    )}

                    {/* Leave Review button (Customer or Admin) */}
                    {(isCustomer || isAdmin) && b.status === 'completed' && !hasReview && (
                      <button
                        type="button"
                        onClick={() => toggleAction(b._id, 'review')}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1"
                      >
                        <HiOutlineStar className="text-sm" />
                        {activeAction.id === b._id && activeAction.type === 'review'
                          ? 'Close Review'
                          : 'Rate & Review'}
                      </button>
                    )}

                    {/* Raise Dispute button */}
                    {b.status !== 'pending' && !activeDispute && (
                      <button
                        type="button"
                        onClick={() => toggleAction(b._id, 'dispute')}
                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <HiOutlineExclamationCircle className="text-sm" />
                        {activeAction.id === b._id && activeAction.type === 'dispute'
                          ? 'Close Dispute'
                          : 'Raise Dispute'}
                      </button>
                    )}
                  </div>

                  {/* Drawers */}
                  <AnimatePresence>
                    {activeAction.id === b._id && activeAction.type === 'pay' && (
                      <PaymentForm
                        booking={b}
                        onDone={() => {
                          setActiveAction({ id: null, type: null });
                          load();
                        }}
                        onCancel={() => setActiveAction({ id: null, type: null })}
                      />
                    )}

                    {activeAction.id === b._id && activeAction.type === 'review' && (
                      <ReviewForm
                        booking={b}
                        onDone={() => {
                          setActiveAction({ id: null, type: null });
                          load();
                        }}
                        onCancel={() => setActiveAction({ id: null, type: null })}
                      />
                    )}

                    {activeAction.id === b._id && activeAction.type === 'dispute' && (
                      <DisputeForm
                        booking={b}
                        onDone={() => {
                          setActiveAction({ id: null, type: null });
                          load();
                        }}
                        onCancel={() => setActiveAction({ id: null, type: null })}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={!!selectedBookingForPayment}
        booking={selectedBookingForPayment}
        onClose={() => setSelectedBookingForPayment(null)}
        onSuccess={(newPayment) => {
          load();
          if (newPayment) {
            setSelectedPaymentForInvoice(newPayment);
          }
        }}
      />

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={!!selectedPaymentForInvoice}
        payment={selectedPaymentForInvoice}
        onClose={() => setSelectedPaymentForInvoice(null)}
      />
    </div>
  );
};

export default MyBookings;
