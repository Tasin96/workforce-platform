import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineX,
  HiOutlinePrinter,
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

const InvoiceReceiptModal = ({ isOpen, payment, onClose }) => {
  if (!isOpen || !payment) return null;

  const booking = payment.booking || {};
  const customer = booking.customer_id || {};
  const worker = booking.worker_id || {};
  const workerUser = worker.user_id || {};
  const service = booking.service_id || {};

  const invoiceNo = `INV-${String(payment._id || '').slice(-8).toUpperCase()}`;
  const bookingCode = String(booking._id || payment.booking_id || '').slice(-6).toUpperCase();
  const dateStr = new Date(payment.paid_at || payment.createdAt || Date.now()).toLocaleString(
    undefined,
    { dateStyle: 'medium', timeStyle: 'short' }
  );

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (m) => {
    if (m === 'mobile_banking') return '📱 bKash / Nagad Mobile Banking';
    if (m === 'card') return '💳 Debit / Credit Card (Visa / Mastercard)';
    if (m === 'cash') return '💵 Cash Settlement on Completion';
    return m || 'Cash';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl overflow-hidden relative my-8 print:shadow-none print:border-none print:m-0 print:max-w-none"
        >
          {/* Modal Top Actions (Hidden in Print) */}
          <div className="bg-gradient-to-r from-[#4C0519] via-[#881337] to-[#9A3412] text-white p-4 sm:px-6 flex items-center justify-between print:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-2">
              <HiOutlineShieldCheck className="text-amber-400 text-base" /> Verified Escrow Receipt
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition text-white"
              >
                <HiOutlinePrinter className="text-sm" /> Print Invoice
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-amber-100 hover:text-white transition"
              >
                <HiOutlineX className="text-base" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div className="p-6 sm:p-10 space-y-6 text-stone-800">
            {/* Header / Brand */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-amber-200/80 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] flex items-center justify-center text-white font-black text-sm shadow-sm">
                    WF
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-stone-900">
                    WorkForce Platform
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Enterprise On-Demand Workforce Dispatch &amp; Settlement
                </p>
                <p className="text-xs text-stone-400">Dhaka, Bangladesh • Direct Support: +8801717408075</p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#9A3412] font-bold text-xs">
                  SETTLED &amp; PAID
                </span>
                <div className="font-mono text-xs text-stone-500 font-semibold">{invoiceNo}</div>
                <div className="text-xs text-stone-400">Date: {dateStr}</div>
              </div>
            </div>

            {/* Bill To & Dispatch Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-amber-50/30 p-5 rounded-2xl border border-amber-200/80">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Billed To (Customer)
                </span>
                <div className="font-bold text-stone-900 text-sm">{customer.name || 'Verified Customer'}</div>
                <div className="text-xs text-stone-600">{customer.email || 'account@workforce.app'}</div>
                {booking.address && (
                  <div className="text-xs text-stone-500 mt-1">{booking.address}</div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Service Specialist
                </span>
                <div className="font-bold text-stone-900 text-sm">
                  {workerUser.name || 'Licensed Specialist'}
                </div>
                <div className="text-xs text-stone-600">
                  Trade: {service.service_name || worker.service_type || 'Platform Specialist'}
                </div>
                <div className="text-xs text-[#C2410C] font-mono mt-1 font-bold">Ticket #{bookingCode}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-amber-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/70 border-b border-amber-200 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    <th className="p-3.5 sm:px-5">Description</th>
                    <th className="p-3.5 sm:px-5">Scope / Trade</th>
                    <th className="p-3.5 sm:px-5 text-right">Amount (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-xs">
                  <tr>
                    <td className="p-3.5 sm:px-5 font-semibold text-stone-900">
                      <div>{service.service_name || 'Professional Trade Service'}</div>
                      <div className="text-[11px] font-normal text-stone-500 mt-0.5">
                        Duration: {booking.duration_hours || booking.durationHours || 1}{' '}
                        {(booking.duration_hours || booking.durationHours || 1) === 1 ? 'Hour' : 'Hours'}
                      </div>
                    </td>
                    <td className="p-3.5 sm:px-5 text-stone-500">
                      {booking.notes || 'Verified on-site appointment'}
                    </td>
                    <td className="p-3.5 sm:px-5 text-right font-mono font-bold text-stone-900">
                      ৳{payment.amount}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 sm:px-5 font-medium text-stone-700">
                      Escrow Mediation Guarantee
                    </td>
                    <td className="p-3.5 sm:px-5 text-[#C2410C] font-medium">Included (100% Protection)</td>
                    <td className="p-3.5 sm:px-5 text-right font-mono text-[#C2410C] font-bold">
                      ৳0.00
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-amber-50/50 p-4 sm:px-5 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-stone-700">
                    Method: {getMethodLabel(payment.method)}
                  </div>
                  {payment.transaction_id && (
                    <div className="text-[11px] font-mono text-stone-500">
                      Transaction Ref: <span className="font-bold text-stone-800">{payment.transaction_id}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block">
                    Total Amount Settled
                  </span>
                  <div className="text-2xl font-black font-mono text-[#881337]">
                    ৳{payment.amount} <span className="text-xs text-stone-500 font-normal">BDT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Authorization Seal */}
            <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-stone-800">Authorized Escrow Settlement</div>
                <div className="text-[11px] text-stone-500">
                  Platform Direction: <strong>Tasin Islam</strong> (Founder) · <strong>Ahosan Habib</strong> (Co-Founder) · <strong>Farhan Ahmed</strong> (Co-Founder)
                </div>
                <div className="text-[11px] text-stone-400">
                  Support &amp; Inquiries: +8801717408075
                </div>
              </div>

              <div className="flex items-center gap-2 border border-amber-300 bg-amber-50/80 px-4 py-2 rounded-xl">
                <HiCheckCircle className="text-[#C2410C] text-2xl shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-[#881337] block">Digitally Signed &amp; Settled</span>
                  <span className="text-[#9A3412]">WorkForce Official Ledger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer (Hidden in Print) */}
          <div className="bg-amber-50/50 border-t border-amber-200/80 p-4 sm:px-6 flex items-center justify-end gap-3 print:hidden">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] text-white text-xs font-bold transition shadow-sm"
            >
              Close Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoiceReceiptModal;
