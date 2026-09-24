import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineX,
  HiOutlineCreditCard,
  HiOutlineClipboardCopy,
  HiCheck,
  HiOutlineShieldCheck,
  HiOutlineCash,
  HiOutlineDeviceMobile,
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from 'react-icons/hi';
import api from '../api/axios';

const PaymentModal = ({ isOpen, booking, onClose, onSuccess }) => {
  if (!isOpen || !booking) return null;

  const [method, setMethod] = useState('mobile_banking');
  const [amount, setAmount] = useState(booking.estimatedCost ?? booking.estimated_cost ?? 500);
  const [customTxn, setCustomTxn] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Card mock state
  const [cardHolder, setCardHolder] = useState('Tasin Islam');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Recipient details
  const RECIPIENT_PHONE = '+8801717408075';
  const RECIPIENT_NAME = 'Tasin Islam (Platform Escrow Account)';

  const bookingCode = String(booking._id || '').slice(-6).toUpperCase();
  const serviceName = booking.service_id?.service_name || 'Trade Service';
  const workerName = booking.worker_id?.user_id?.name || 'Assigned Specialist';

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
    toast.success(`Generated Demo Reference: ${generated}`);
  };

  const handleFillDemoCard = () => {
    setCardHolder('Tasin Islam');
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setCustomTxn(`CARD-VISA-${Math.floor(100000 + Math.random() * 900000)}`);
    toast.success('Filled Demo Visa Card details!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalTxn = customTxn.trim();
      if (!finalTxn) {
        if (method === 'card') {
          finalTxn = `CARD-${Date.now().toString().slice(-6)}`;
        } else if (method === 'cash') {
          finalTxn = `CASH-REC-${Date.now().toString().slice(-6)}`;
        } else {
          finalTxn = `MBL-${Date.now().toString().slice(-6)}`;
        }
      }

      const { data } = await api.post('/payments', {
        booking_id: booking._id,
        amount: parseFloat(amount),
        method,
        transaction_id: finalTxn,
      });

      toast.success(`Payment of ৳${amount} BDT settled successfully!`);
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-amber-200/90 shadow-2xl w-full max-w-xl overflow-hidden relative my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#9A3412] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
            >
              <HiOutlineX className="text-lg" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                Verified Escrow Settlement
              </span>
              <span className="text-amber-200/50 text-xs">•</span>
              <span className="text-amber-100/90 font-mono text-xs">Job Ticket #{bookingCode}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Settle Service Payment</h2>
            <p className="text-xs text-amber-100/80 mt-1 flex items-center gap-2">
              <span>{serviceName}</span>
              <span>•</span>
              <span>Technician: {workerName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Amount Summary Pill */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Total Payable Amount
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#881337] font-mono">৳{amount}</span>
                    <span className="text-xs font-semibold text-stone-500">BDT</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#9A3412] bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <HiOutlineShieldCheck className="text-sm text-[#C2410C]" /> 100% Guaranteed Escrow
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1 block">Zero platform surcharge</span>
                </div>
              </div>

              {/* Booked Duration & Calculation Basis */}
              <div className="pt-2 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 bg-white/70 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <HiOutlineClock className="text-[#C2410C] text-sm" />
                  <span>Duration:</span>
                  <strong className="text-stone-900 font-mono font-bold">
                    {booking.duration_hours || booking.durationHours || 1}{' '}
                    {(booking.duration_hours || booking.durationHours || 1) === 1 ? 'Hour' : 'Hours'}
                  </strong>
                </div>
                <div className="font-mono text-[11px] text-[#9A3412] font-semibold">
                  {(booking.duration_hours || booking.durationHours || 1) > 1
                    ? `Calculated: ৳${Math.round(
                        (booking.estimatedCost ?? booking.estimated_cost ?? amount) /
                          (booking.duration_hours || booking.durationHours || 1)
                      )}/hr × ${booking.duration_hours || booking.durationHours || 1} hrs`
                    : `Base Rate: ৳${amount} BDT`}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Choose Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'mobile_banking',
                    label: 'bKash / Nagad',
                    sub: 'Instant MFS',
                    icon: HiOutlineDeviceMobile,
                  },
                  {
                    id: 'card',
                    label: 'Card Checkout',
                    sub: 'Visa / Mastercard',
                    icon: HiOutlineCreditCard,
                  },
                  {
                    id: 'cash',
                    label: 'Cash on Hand',
                    sub: 'Service Completion',
                    icon: HiOutlineCash,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = method === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        active
                          ? 'border-[#C2410C] bg-amber-50/70 ring-2 ring-[#C2410C]/20 shadow-sm'
                          : 'border-stone-200 bg-white hover:bg-amber-50/40 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`text-xl ${active ? 'text-[#C2410C]' : 'text-stone-400'}`} />
                        {active && <div className="w-2 h-2 rounded-full bg-[#C2410C]" />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-[#9A3412]' : 'text-stone-800'}`}>
                          {m.label}
                        </div>
                        <div className="text-[10px] text-stone-500">{m.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method Details Box */}
            <div className="p-4 rounded-2xl border border-amber-200/70 bg-stone-50/70 space-y-3">
              {/* Method 1: Mobile Banking (bKash / Nagad) */}
              {method === 'mobile_banking' && (
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Recipient Account (Send Money / Pay)
                      </span>
                      <span className="text-[10px] font-bold text-[#9A3412] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Personal / Merchant
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold font-mono text-stone-900">
                          {RECIPIENT_PHONE}
                        </div>
                        <div className="text-[11px] text-stone-500">{RECIPIENT_NAME}</div>
                      </div>

                      <button
                        type="button"
                        onClick={copyNumber}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#881337] to-[#C2410C] hover:from-[#9F1239] hover:to-[#EA580C] text-white text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                      >
                        {copied ? <HiCheck className="text-sm text-amber-300" /> : <HiOutlineClipboardCopy className="text-sm" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-1">
                    <div className="font-bold text-[#9A3412]">Instructions:</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-stone-700">
                      <li>Open bKash or Nagad, tap Send Money or Payment.</li>
                      <li>Transfer <strong>৳{amount} BDT</strong> to <strong>{RECIPIENT_PHONE}</strong>.</li>
                      <li>Enter the Transaction ID (TrxID) below or click Generate Demo below.</li>
                    </ol>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        bKash / Nagad Transaction ID (TrxID)
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateDemoTrxId}
                        className="text-[11px] font-semibold text-[#C2410C] hover:text-[#9A3412] hover:underline"
                      >
                        ⚡ Generate Demo TrxID
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 9H7D6S2A or BKASH-49210"
                      value={customTxn}
                      onChange={(e) => setCustomTxn(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Method 2: Credit / Debit Card */}
              {method === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Card Credentials</span>
                    <button
                      type="button"
                      onClick={handleFillDemoCard}
                      className="text-[11px] font-semibold text-[#C2410C] hover:text-[#9A3412] hover:underline"
                    >
                      ⚡ Fill Demo Card
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Cardholder Full Name"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number (4242 •••• •••• 4242)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono text-center"
                      />
                      <input
                        type="password"
                        placeholder="CVC / CVV"
                        maxLength="4"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Method 3: Cash Payment */}
              {method === 'cash' && (
                <div className="space-y-2.5">
                  <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <HiOutlineCash className="text-[#C2410C] text-sm" /> Hand-to-Hand Settlement Protocol
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-700">
                      You will pay <strong>৳{amount} BDT</strong> in cash directly to{' '}
                      <strong>{workerName}</strong> upon satisfactory completion and inspection of work.
                      The platform will log a verified cash receipt ticket for records.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Cash Receipt Note / Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Paid in cash at location"
                      value={customTxn}
                      onChange={(e) => setCustomTxn(e.target.value)}
                      className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Amount Adjustment (if needed) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Settlement Amount (৳ BDT)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#C2410C] bg-white font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-md shadow-[#C2410C]/25 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>Processing Settle…</>
                ) : (
                  <>
                    <HiOutlineShieldCheck className="text-base text-amber-300" /> Confirm Payment of ৳{amount}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
