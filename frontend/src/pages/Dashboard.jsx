import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineBell,
  HiOutlineUserCircle,
  HiArrowRight,
  HiOutlineCreditCard,
  HiOutlineShieldExclamation,
  HiOutlinePhone,
  HiCheckCircle,
  HiXCircle,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiShieldCheck,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PaymentModal from '../components/PaymentModal';
import InvoiceReceiptModal from '../components/InvoiceReceiptModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState(null);

  const loadData = async () => {
    try {
      const disputeEndpoint = user?.role === 'admin' ? '/disputes' : '/disputes/my';
      const [b, p, n, d] = await Promise.all([
        api.get('/bookings/my'),
        api.get('/payments/my').catch(() => ({ data: [] })),
        api.get('/notifications'),
        api.get(disputeEndpoint).catch(() => ({ data: [] })),
      ]);
      setBookings(b.data || []);
      setPayments(p.data || []);
      setNotifications(n.data || []);
      setDisputes(d.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateDispute = async (id, status) => {
    try {
      await api.put(`/disputes/${id}`, { status });
      toast.success(`Dispute status updated to ${status}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update dispute');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update booking status');
    }
  };

  if (loading) return <LoadingSpinner label="Loading executive board…" />;

  const active = bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status));
  const completed = bookings.filter((b) => b.status === 'completed');
  const paidBookings = bookings.filter((b) => b.payment);
  const totalPaid =
    payments.length > 0
      ? payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
      : paidBookings.reduce((sum, b) => sum + (parseFloat(b.payment.amount) || 0), 0);

  const stats = [
    {
      label: 'Active Jobs',
      value: active.length,
      icon: HiOutlineClipboardList,
      bg: 'bg-amber-50',
      text: 'text-[#C2410C]',
    },
    {
      label: 'Completed Jobs',
      value: completed.length,
      icon: HiOutlineStar,
      bg: 'bg-orange-50',
      text: 'text-[#9A3412]',
    },
    {
      label: 'Settled Payments',
      value: `৳${totalPaid}`,
      icon: HiOutlineCreditCard,
      bg: 'bg-rose-50',
      text: 'text-[#881337]',
    },
    {
      label: 'Active Disputes',
      value: disputes.filter((d) => ['open', 'under_review'].includes(d.status)).length,
      icon: HiOutlineShieldExclamation,
      bg: 'bg-amber-100/60',
      text: 'text-amber-800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Executive Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <Link to="/profile" className="relative group shrink-0" title="Edit Profile Picture">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-300/80 shadow-md shadow-amber-900/10 group-hover:border-[#C2410C] transition"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center font-display font-extrabold text-2xl sm:text-3xl shadow-md shadow-amber-900/10">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Online & Active" />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-[#9A3412] border border-amber-200">
                  {user?.role?.toUpperCase()} PORTAL
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                Welcome back, {user?.name}
              </h1>
              <p className="text-sm text-stone-500 mt-0.5">
                Authorized Account: <span className="font-semibold text-stone-700">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-amber-50/40 text-stone-700 font-semibold text-xs transition"
            >
              <HiOutlineUserCircle className="text-base text-[#C2410C]" /> Profile Settings
            </Link>
            <a
              href="https://wa.me/qr/HFFRHGPGCI6PL1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-semibold text-xs shadow-sm transition"
            >
              <FaWhatsapp className="text-base" /> WhatsApp Support
            </a>
          </div>
        </div>

        {/* Stats KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-md shadow-amber-900/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-lg shadow-2xs`}>
                  <s.icon />
                </div>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {s.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disputes Arbitration Panel (especially for Admin) */}
        {disputes.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C2410C] flex items-center justify-center">
                  <HiOutlineShieldExclamation className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    {user?.role === 'admin' ? 'Platform Dispute Arbitration (Admin)' : 'Dispute Cases'}
                  </h2>
                  <p className="text-xs text-stone-500">Mediations and quality assurance flags</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-[#9A3412] border border-amber-200">
                {disputes.length} Registered
              </span>
            </div>

            <div className="space-y-3">
              {disputes.map((d) => {
                const bookingIdStr = typeof d.booking_id === 'object' ? d.booking_id?._id : d.booking_id;
                const bookingCode = String(bookingIdStr || '').slice(-6).toUpperCase();

                return (
                  <div
                    key={d._id}
                    className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#881337] uppercase tracking-wider">
                          Status: {d.status}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="font-mono text-[#C2410C] font-semibold">Ticket #{bookingCode}</span>
                        {d.created_at && (
                          <>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-400">
                              {new Date(d.created_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-medium text-stone-800">"{d.reason}"</p>
                      {d.raiser && (
                        <p className="text-xs text-stone-500">
                          Raised by: <span className="font-semibold text-stone-700">{d.raiser.name}</span> ({d.raiser.email})
                        </p>
                      )}
                    </div>

                    {user?.role === 'admin' && ['open', 'under_review'].includes(d.status) && (
                      <div className="flex items-center gap-2 self-start md:self-center">
                        <button
                          onClick={() => handleUpdateDispute(d._id, 'under_review')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleUpdateDispute(d._id, 'resolved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
                        >
                          <HiCheckCircle className="text-sm" /> Resolve
                        </button>
                        <button
                          onClick={() => handleUpdateDispute(d._id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
                        >
                          <HiXCircle className="text-sm" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Recent Service Orders</h2>
              <p className="text-xs text-stone-500">Live verified appointments &amp; service records</p>
            </div>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C] hover:text-[#9A3412]"
            >
              View All Bookings <HiArrowRight />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 text-stone-400 space-y-2">
              <p className="text-sm">No service bookings found on this board yet.</p>
              {user?.role === 'customer' && (
                <Link to="/browse" className="text-xs font-semibold text-[#C2410C] hover:underline">
                  Browse and hire a certified specialist
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => {
                const bookingCode = String(b._id || '').slice(-6).toUpperCase();
                return (
                  <div
                    key={b._id}
                    className="p-4 rounded-xl border border-amber-200/70 bg-stone-50/50 hover:bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#9A3412] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          #{bookingCode}
                        </span>
                        <span className="font-semibold text-stone-900 text-sm">
                          {b.service_id?.service_name || 'Service Booking'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                        <span>
                          {new Date(b.date_time).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                        <span>•</span>
                        <span>{b.address || 'Address on file'}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Worker Action Controls */}
                      {user?.role === 'worker' && b.status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'accepted')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {user?.role === 'worker' && b.status === 'accepted' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'in_progress')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition"
                          >
                            Start Job
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                          >
                            Complete
                          </button>
                        </div>
                      )}

                      {user?.role === 'worker' && b.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateBookingStatus(b._id, 'completed')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                        >
                          Complete Job
                        </button>
                      )}

                      {/* Dispute link for active/completed bookings */}
                      {['accepted', 'in_progress', 'completed'].includes(b.status) && (
                        <Link
                          to="/bookings"
                          className="px-2 py-1 rounded-lg border border-amber-300 text-[#881337] hover:bg-amber-50 text-xs font-semibold transition"
                          title="Manage booking & raise dispute if needed"
                        >
                          Manage / Dispute
                        </Link>
                      )}

                      {b.payment ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-[#881337] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                            ৳{b.payment.amount} Paid
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedPaymentForInvoice(b.payment)}
                            className="px-2.5 py-1 rounded-lg border border-amber-200 hover:bg-white text-stone-700 text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
                            title="View official tax invoice & receipt"
                          >
                            <HiOutlineDocumentText className="text-sm text-[#C2410C]" /> Receipt
                          </button>
                        </div>
                      ) : (
                        b.status !== 'cancelled' &&
                        (user?.role === 'customer' || user?.role === 'admin') && (
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForPayment(b)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
                          >
                            <HiOutlineCreditCard className="text-sm" /> Settle ৳{b.estimatedCost || 500}
                          </button>
                        )
                      )}
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Settled Invoices & Payment Ledger Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C2410C] flex items-center justify-center">
                <HiOutlineCreditCard className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Settled Invoices &amp; Payment Ledger</h2>
                <p className="text-xs text-stone-500">
                  Verified escrow transactions &amp; official printable invoices
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-[#881337] border border-amber-300 font-mono">
              ৳{totalPaid} Settled Volume
            </span>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-8 text-stone-400 space-y-1">
              <p className="text-xs font-medium">No payment settlements recorded on this account yet.</p>
              <p className="text-[11px] text-stone-400">
                Settle pending service orders above to generate official verified receipts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 6).map((p) => {
                const bookingCode = String(p.booking_id || p.booking?._id || '').slice(-6).toUpperCase();
                const serviceName = p.booking?.service_id?.service_name || 'Trade Specialist';
                const workerName =
                  p.booking?.worker_id?.user_id?.name || p.booking?.worker?.user?.name || 'Verified Specialist';

                return (
                  <div
                    key={p._id}
                    className="p-4 rounded-xl border border-amber-200/70 bg-stone-50/40 hover:bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#9A3412] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {p.transaction_id || `TXN-${p._id?.slice(-6).toUpperCase()}`}
                        </span>
                        <span className="text-xs font-semibold text-stone-900">{serviceName}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500">Ticket #{bookingCode}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500">{workerName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                        <span>
                          Method:{' '}
                          <strong className="text-stone-700 font-medium">
                            {p.method === 'mobile_banking'
                              ? '📱 bKash / Nagad'
                              : p.method === 'card'
                              ? '💳 Card Checkout'
                              : '💵 Cash Settlement'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(p.paid_at || p.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-extrabold font-mono text-[#881337] bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                        ৳{p.amount} Paid
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentForInvoice(p)}
                        className="px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-white text-stone-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <HiOutlineDocumentText className="text-sm text-[#C2410C]" /> View Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Platform Ownership & Direct Contact Strip */}
        <div className="bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#9A3412] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-400/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
                Platform Leadership &amp; Executive Governance
              </span>
              <h3 className="text-xl font-bold mt-1">
                Founder: Tasin Islam | Co-Founders: Ahosan Habib &amp; Farhan Ahmed
              </h3>
              <p className="text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
                WorkForce Platform is an enterprise on-demand workforce dispatch platform with real-time tracking, escrow settlement, and quality assurance mediation under the executive leadership of Founder Tasin Islam and Co-Founders Ahosan Habib and Farhan Ahmed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/qr/HFFRHGPGCI6PL1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FaWhatsapp className="text-base" /> WhatsApp Direct
              </a>
              <a
                href="https://www.facebook.com/tasinislam.riju"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#0c63d4] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FaFacebook className="text-base" /> Facebook Profile
              </a>
              <a
                href="tel:+8801717408075"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
              >
                <HiOutlinePhone className="text-base" /> +8801717408075
              </a>
            </div>
          </div>
        </div>

        {/* Payment Checkout Modal */}
        <PaymentModal
          isOpen={!!selectedBookingForPayment}
          booking={selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={(newPayment) => {
            loadData();
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
    </div>
  );
};

export default Dashboard;
