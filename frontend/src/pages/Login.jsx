import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiShieldCheck, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { scrollToTop } from '../components/ScrollToTop';

const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    name: 'Tasin Islam',
    email: 'admin@workforce.app',
    password: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: 'Founder & Admin',
    badgeColor: 'bg-rose-50 text-[#881337] border-rose-200',
  },
  {
    role: 'Customer',
    name: 'Tasin Islam',
    email: 'customer@workforce.app',
    password: 'customer123',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    badge: 'Verified Client',
    badgeColor: 'bg-amber-50 text-[#9A3412] border-amber-200',
  },
  {
    role: 'Worker',
    name: 'Karim Sheikh',
    email: 'karim.electrician@workforce.app',
    password: 'worker123',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    badge: 'Electrician (Worker)',
    badgeColor: 'bg-orange-50 text-[#C2410C] border-orange-200',
  },
  {
    role: 'Worker',
    name: 'Jahangir Alam',
    email: 'jahangir.plumber@workforce.app',
    password: 'worker123',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    badge: 'Plumber (Worker)',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
];

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e?.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to WorkForce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleQuickDemoLogin = async (acc) => {
    setForm({ email: acc.email, password: acc.password });
    try {
      await login(acc.email, acc.password);
      toast.success(`Logged in as ${acc.name} (${acc.role})!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FAF8F5] relative flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-lg bg-white rounded-3xl border border-amber-200/80 shadow-2xl p-7 sm:p-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-[#C2410C] mb-3 ring-8 ring-amber-50/60 shadow-xs">
            <HiShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Log in to manage appointments, payments, and workforce dispatch.
          </p>
        </div>

        {/* Feature 1 Demo Profiles Grid: 1-Click Fast Login with Real Avatars */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/70 border border-amber-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <HiOutlineSparkles className="text-[#C2410C]" />
              Quick Demo Accounts (1-Click Login)
            </span>
            <span className="text-[10px] font-mono text-stone-400">Click to switch</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickDemoLogin(acc)}
                className="p-2.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 hover:border-[#C2410C] transition-all flex items-center gap-2.5 text-left shadow-xs group"
                title={`Log in as ${acc.name} (${acc.role})`}
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="truncate">
                  <div className="text-xs font-bold text-stone-900 truncate">{acc.name}</div>
                  <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border mt-0.5 ${acc.badgeColor}`}>
                    {acc.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-700/60">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full pl-10 pr-4 py-3 bg-amber-50/20 border border-amber-200/80 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-amber-500/10 transition"
                placeholder="name@workforce.app"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-700/60">
                <HiOutlineLockClosed className="w-5 h-5" />
              </div>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full pl-10 pr-4 py-3 bg-amber-50/20 border border-amber-200/80 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-amber-500/10 transition"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-semibold shadow-lg shadow-amber-600/20 transition duration-150 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <>
                <span>Sign in to Account</span>
                <HiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" onClick={() => scrollToTop()} className="font-semibold text-[#881337] hover:text-[#C2410C] underline-offset-4 hover:underline">
            Register new account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
