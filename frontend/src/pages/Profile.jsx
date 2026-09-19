import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiShieldCheck,
  HiOutlineChatAlt2,
  HiCheck
} from 'react-icons/hi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

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

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', location: '', email: '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', experience: '', service_type: 'Electrician' });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWorker, setSavingWorker] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          email: data.user.email || '',
        });
        if (data.workerProfile) {
          setWorkerForm({
            bio: data.workerProfile.bio || '',
            experience: data.workerProfile.experience || '',
            service_type: data.workerProfile.service_type || 'Electrician',
          });
        }
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/me', {
        name: form.name,
        phone: form.phone,
        location: form.location,
      });
      setUser({ ...user, ...data });
      toast.success('Account profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveWorkerProfile = async (e) => {
    e.preventDefault();
    setSavingWorker(true);
    try {
      await api.put('/workers/me', workerForm);
      toast.success('Professional technician details updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update worker credentials');
    } finally {
      setSavingWorker(false);
    }
  };

  if (loading) return <LoadingSpinner label="Retrieving account settings…" />;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header with Avatar and Badges */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-[#C2410C]/20">
              {form.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-stone-900">{form.name || user?.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-[#9A3412] border border-amber-200">
                  <HiShieldCheck className="w-3.5 h-3.5 text-[#C2410C]" />
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-stone-500 mt-1 flex items-center gap-2">
                <span>{form.email || user?.email}</span>
                <span>•</span>
                <span>{form.location || 'Location not set'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#881337] bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
            Active Account
          </div>
        </div>

        {/* Primary Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5"
        >
          <div className="border-b border-amber-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-stone-900">Personal &amp; Contact Details</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              These details are shared with dispatchers and clients upon booking confirmation.
            </p>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <HiOutlineUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Direct Phone Number
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <HiOutlinePhone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                    placeholder="+8801717408075"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address (Primary Login)
                </label>
                <div className="relative rounded-xl opacity-75">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={form.email}
                    className="block w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Operating Location / Base City
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <HiOutlineLocationMarker className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="block w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                    placeholder="Faridpur, Dhaka"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-sm font-bold shadow-md shadow-[#C2410C]/20 transition duration-150 disabled:opacity-60 flex items-center gap-2"
              >
                {savingProfile ? 'Saving updates…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Professional Worker Details (if role is worker) */}
        {user?.role === 'worker' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5"
          >
            <div className="border-b border-amber-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-stone-900">Service Specialist Credentials</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure your verified public listing shown to hiring clients across the network.
              </p>
            </div>

            <form onSubmit={saveWorkerProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Primary Trade Specialty
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <HiOutlineBriefcase className="w-5 h-5" />
                    </div>
                    <select
                      value={workerForm.service_type}
                      onChange={(e) => setWorkerForm({ ...workerForm, service_type: e.target.value })}
                      className="block w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                    >
                      {TRADES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Experience Level
                  </label>
                  <div className="relative rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <HiOutlineClock className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={workerForm.experience}
                      onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })}
                      className="block w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition"
                      placeholder="e.g. 6+ Years Certified"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Professional Bio &amp; Technical Background
                </label>
                <textarea
                  rows={4}
                  value={workerForm.bio}
                  onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
                  className="block w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:bg-white focus:border-[#C2410C] focus:ring-4 focus:ring-[#C2410C]/10 transition resize-none"
                  placeholder="Describe your trade tools, background, certifications, and specialties..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingWorker}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] to-[#C2410C] hover:from-[#9F1239] hover:to-[#EA580C] text-white text-sm font-bold shadow-md transition duration-150 disabled:opacity-60 flex items-center gap-2"
                >
                  {savingWorker ? 'Updating credentials…' : 'Update Specialist Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Support & Contact Card */}
        <div className="bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#9A3412] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-400/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                WorkForce Support &amp; Governance
              </span>
              <h3 className="text-xl font-bold mt-1">Need help with dispatch or escrow?</h3>
              <p className="text-sm text-amber-100/80 mt-1 max-w-xl">
                Platform Leadership: Founder Tasin Islam and Co-Founders Ahosan Habib and Farhan Ahmed are available directly via WhatsApp, Facebook, and direct line for priority escalation and arbitration.
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
      </div>
    </div>
  );
};

export default Profile;
