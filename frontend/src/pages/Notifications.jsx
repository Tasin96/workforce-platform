import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineBell, 
  HiOutlineCheck, 
  HiCheckCircle, 
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlineClock
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setItems(data);
    } catch (err) {
      toast.error('Failed to retrieve notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    try {
      await api.put('/notifications/read-all');
      toast.success('All notifications marked as read');
      load();
    } catch (err) {
      toast.error('Could not mark all as read');
    }
  };

  const markOne = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setItems((prev) =>
        prev.map((item) => (item.id === id || item._id === id ? { ...item, is_read: true } : item))
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const displayedItems = items.filter((item) => {
    if (filter === 'unread') return !item.is_read;
    return true;
  });

  const unreadCount = items.filter((item) => !item.is_read).length;

  if (loading) return <LoadingSpinner label="Fetching dispatch telemetry alerts…" />;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-amber-200/80 shadow-md shadow-amber-900/5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">Notifications Hub</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#9A3412] border border-amber-300">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500 mt-1">
              Real-time audit log of bookings, payments, and system dispatches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAll}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50/80 hover:bg-amber-100 text-[#9A3412] border border-amber-200/80 transition flex items-center gap-1.5"
              >
                <HiCheckCircle className="w-4 h-4 text-[#C2410C]" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] text-white shadow-sm font-bold'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-50/40'
            }`}
          >
            All Activity ({items.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] text-white shadow-sm font-bold'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-amber-50/40'
            }`}
          >
            Unread Only ({unreadCount})
          </button>
        </div>

        {/* List of Notifications */}
        {displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/80 p-12 text-center shadow-md shadow-amber-900/5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-[#C2410C] flex items-center justify-center mb-4">
              <HiOutlineBell className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-900">All clear — no notifications</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              You will receive automated dispatches when bookings are requested, accepted, paid, or reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedItems.map((n, i) => {
              const notifId = n.id || n._id;
              return (
                <motion.div
                  key={notifId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.2) }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                    n.is_read
                      ? 'bg-white border-stone-200 shadow-xs'
                      : 'bg-amber-50/40 border-amber-200/80 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.is_read
                        ? 'bg-stone-100 text-stone-500'
                        : 'bg-gradient-to-tr from-[#881337] to-[#C2410C] text-white shadow-sm shadow-[#C2410C]/20'
                    }`}
                  >
                    <HiOutlineInformationCircle className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {n.link ? (
                      <Link to={n.link} className="hover:underline block">
                        <p className={`text-sm leading-relaxed ${n.is_read ? 'text-stone-700' : 'text-stone-900 font-semibold'}`}>
                          {n.message}
                        </p>
                      </Link>
                    ) : (
                      <p className={`text-sm leading-relaxed ${n.is_read ? 'text-stone-700' : 'text-stone-900 font-semibold'}`}>
                        {n.message}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <HiOutlineClock className="w-3.5 h-3.5 text-[#C2410C]" />
                        {new Date(n.sent_at || n.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {!n.is_read && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-[#9A3412]">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {!n.is_read && (
                    <button
                      onClick={() => markOne(notifId)}
                      title="Mark as read"
                      className="p-2 rounded-xl text-stone-400 hover:text-[#C2410C] hover:bg-amber-50 transition shrink-0"
                    >
                      <HiOutlineCheck className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
