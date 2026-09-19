import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiArrowRight,
  HiShieldCheck
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { scrollToTop } from '../components/ScrollToTop';

const TRADES = [
  'Electrician',
  'Plumber',
  'Painter',
  'Carpenter',
  'Gardener',
  'Cleaner',
  'Appliance Repair',
  'Mason / Construction'
];

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    service_type: 'Electrician',
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      toast.success('Account created successfully — welcome to WorkForce!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] relative flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      {/* Background Subtle Warm Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-xl bg-white rounded-2xl border border-amber-200/80 shadow-xl shadow-amber-900/5 p-8 sm:p-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-[#C2410C] mb-4 ring-8 ring-amber-100/50 border border-amber-200/70">
            <HiShieldCheck className="w-6 h-6 text-[#C2410C]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Join the verified workforce network for dependable local dispatch.
          </p>
        </div>

        {/* Role Segmented Switch */}
        <div className="mb-7 p-1 bg-amber-50/70 rounded-xl flex gap-1 border border-amber-200/60">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              role === 'customer'
                ? 'bg-white text-[#9A3412] shadow-sm border border-amber-300 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            👤 Client / Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              role === 'worker'
                ? 'bg-white text-[#9A3412] shadow-sm border border-amber-300 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ⚡ Professional Specialist
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <HiOutlineUser className="w-5 h-5" />
                </div>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                  placeholder="e.g. Tasin Islam"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                  placeholder="+8801717408075"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Location / City
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                </div>
                <input
                  required
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                  placeholder="Faridpur, Dhaka"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <HiOutlineLockClosed className="w-5 h-5" />
                </div>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                  placeholder="At least 6 chars"
                />
              </div>
            </div>
          </div>

          {role === 'worker' && (
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Primary Trade Specialty
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <HiOutlineBriefcase className="w-5 h-5" />
                </div>
                <select
                  value={form.service_type}
                  onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                >
                  {TRADES.map((trade) => (
                    <option key={trade} value={trade}>
                      {trade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold shadow-lg shadow-[#C2410C]/25 transition duration-150 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>
                  <span>
                    {role === 'worker' ? 'Register as Certified Specialist' : 'Create Client Account'}
                  </span>
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Account Link */}
        <p className="mt-6 text-center text-sm text-stone-600">
          Already registered?{' '}
          <Link to="/login" onClick={() => scrollToTop()} className="font-semibold text-[#C2410C] hover:text-[#9A3412] underline-offset-4 hover:underline">
            Sign in here
          </Link>
        </p>

        {/* Security / Verification Assurance */}
        <div className="mt-6 pt-5 border-t border-amber-100 flex items-center justify-center gap-2 text-xs text-stone-500">
          <HiShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Enterprise Data Protection • 256-bit Secure Encryption</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
