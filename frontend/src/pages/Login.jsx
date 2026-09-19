import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiShieldCheck, HiArrowRight, HiOutlineSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { scrollToTop } from '../components/ScrollToTop';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to WorkForce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const setDemoCredentials = (email, password) => {
    setForm({ email, password });
    toast('Credentials filled! Click "Sign in" to continue.', { icon: '🔑' });
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] relative flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-md bg-white rounded-2xl border border-amber-200/80 shadow-xl p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-[#C2410C] mb-4 ring-8 ring-amber-50/60">
            <HiShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Log in to manage appointments, payments, and workforce dispatch.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-700/60">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full pl-10 pr-4 py-3 bg-amber-50/30 border border-amber-200/80 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-amber-500/10 transition"
                placeholder="name@workforce.app"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
              <span className="text-xs text-[#881337] hover:text-[#C2410C] font-medium cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-700/60">
                <HiOutlineLockClosed className="w-5 h-5" />
              </div>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full pl-10 pr-4 py-3 bg-amber-50/30 border border-amber-200/80 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-amber-500/10 transition"
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
                <span>Sign in</span>
                <HiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" onClick={() => scrollToTop()} className="font-semibold text-[#881337] hover:text-[#C2410C] underline-offset-4 hover:underline">
            Register now
          </Link>
        </p>

        {/* Quick Demo Credentials Panel */}
        <div className="mt-8 pt-6 border-t border-amber-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800/80 flex items-center gap-1.5">
              <HiOutlineSparkles className="text-amber-500" />
              One-Click Demo Accounts
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Instant Sandbox</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@workforce.app', 'admin123')}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#881337] to-[#C2410C] text-white flex items-center justify-center text-xs font-bold">
                  👑
                </span>
                <div>
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-[#881337]">
                    Founder &amp; Administrator (Tasin Islam)
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">admin@workforce.app</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#881337] opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-fill
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('habib@gmail.com', 'password123')}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#D97706] text-white flex items-center justify-center text-xs font-bold">
                  ⭐
                </span>
                <div>
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-amber-900">
                    Co-Founder &amp; Client (Ahosan Habib)
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">habib@gmail.com</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-fill
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('farhan@workforce.app', 'password123')}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#B45309] text-white flex items-center justify-center text-xs font-bold">
                  ⭐
                </span>
                <div>
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-amber-900">
                    Co-Founder &amp; Administrator (Farhan Ahmed)
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">farhan@workforce.app</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-fill
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('customer@workforce.app', 'customer123')}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  👤
                </span>
                <div>
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-emerald-900">
                    Client Account (Tasin Islam)
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">customer@workforce.app</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-fill
              </span>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('karim.electrician@workforce.app', 'worker123')}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-amber-200/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#EA580C] text-white flex items-center justify-center text-xs font-bold">
                  ⚡
                </span>
                <div>
                  <div className="text-xs font-semibold text-stone-800 group-hover:text-orange-900">
                    Technician (Karim Sheikh - Electrician)
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">karim.electrician@workforce.app</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#EA580C] opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-fill
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
