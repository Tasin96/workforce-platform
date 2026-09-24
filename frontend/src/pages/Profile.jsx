import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiShieldCheck,
  HiOutlineCamera,
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineLink,
  HiOutlineShieldExclamation,
  HiCheckCircle,
  HiXCircle,
  HiOutlineSparkles,
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

const AVATAR_PRESETS = [
  { name: 'Executive Leader', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { name: 'Senior Consultant', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Licensed Electrician', url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hydraulic Plumber', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Architectural Painter', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Master Craftsman', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sanitation Lead', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
  { name: 'Client Account', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ name: '', phone: '', location: '', email: '', avatar: '' });
  const [workerForm, setWorkerForm] = useState({ bio: '', experience: '', service_type: 'Electrician' });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWorker, setSavingWorker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Admin dispute arbitration management
  const [adminDisputes, setAdminDisputes] = useState([]);
  const [loadingDisputes, setLoadingDisputes] = useState(false);

  const fetchProfileData = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setForm({
        name: data.user.name || '',
        phone: data.user.phone || '',
        location: data.user.location || '',
        email: data.user.email || '',
        avatar: data.user.avatar || '',
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

  const fetchAdminDisputes = async () => {
    if (user?.role !== 'admin') return;
    setLoadingDisputes(true);
    try {
      const { data } = await api.get('/disputes');
      setAdminDisputes(data || []);
    } catch (e) {
      console.error('Could not load disputes for admin:', e);
    } finally {
      setLoadingDisputes(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (user?.role === 'admin') {
      fetchAdminDisputes();
    }
  }, [user]);

  // Handle image upload from computer and optimize
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 400x400 for optimal fast loading
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        applyAvatar(dataUrl);
      };
      img.src = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Apply new avatar and immediately persist
  const applyAvatar = async (avatarUrl) => {
    try {
      setForm((prev) => ({ ...prev, avatar: avatarUrl }));
      const { data } = await api.put('/users/me', { avatar: avatarUrl });
      const updatedUser = { ...user, ...data, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile picture updated successfully!');
      setCustomAvatarUrl('');
      setShowPresets(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile picture');
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    try {
      setForm((prev) => ({ ...prev, avatar: '' }));
      const { data } = await api.put('/users/me', { avatar: '' });
      const updatedUser = { ...user, ...data, avatar: '' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile picture removed');
    } catch (err) {
      toast.error('Failed to remove profile picture');
    }
  };

  // Save personal profile details
  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/me', {
        name: form.name,
        phone: form.phone,
        location: form.location,
        avatar: form.avatar,
      });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Account profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Save worker details
  const saveWorkerProfile = async (e) => {
    e.preventDefault();
    setSavingWorker(true);
    try {
      await api.put('/workers/me', workerForm);
      toast.success('Professional technician credentials updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update worker credentials');
    } finally {
      setSavingWorker(false);
    }
  };

  // Admin dispute resolution handler
  const handleUpdateDispute = async (id, status) => {
    try {
      await api.put(`/disputes/${id}`, { status });
      toast.success(`Dispute status updated to "${status}"`);
      fetchAdminDisputes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update dispute');
    }
  };

  if (loading) return <LoadingSpinner label="Retrieving account settings…" />;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header with Avatar and Badges */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name || 'User'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-md shadow-[#C2410C]/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-[#C2410C]/20">
                  {form.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-[#C2410C] text-white shadow-md hover:bg-[#9A3412] transition-colors"
                title="Upload or change profile picture"
              >
                <HiOutlineCamera className="w-4 h-4" />
              </button>
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

        {/* Feature 1: Profile Picture Customizer Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-6"
        >
          <div className="border-b border-amber-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <HiOutlinePhotograph className="text-xl text-[#C2410C]" />
                Profile Picture &amp; Identity Avatar
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload a personal photo, enter an image URL, or choose one of our verified curated presets.
              </p>
            </div>
            {form.avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 self-start sm:self-center font-semibold"
              >
                <HiOutlineTrash /> Remove Photo
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Quick Action Upload Controls */}
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl border border-dashed border-[#C2410C]/60 bg-amber-50/40 hover:bg-amber-50 text-stone-800 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition group"
            >
              <HiOutlineCamera className="text-2xl text-[#C2410C] group-hover:scale-110 transition-transform" />
              <span>Upload From Device</span>
              <span className="text-[10px] font-normal text-stone-500">JPG, PNG, WebP (max 5MB)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="p-4 rounded-xl border border-amber-200/80 bg-white hover:bg-amber-50/50 text-stone-800 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition group"
            >
              <HiOutlineSparkles className="text-2xl text-[#D97706] group-hover:scale-110 transition-transform" />
              <span>{showPresets ? 'Close Avatar Presets' : 'Choose Curated Preset'}</span>
              <span className="text-[10px] font-normal text-stone-500">8 High-res trade portraits</span>
            </button>

            <div className="p-4 rounded-xl border border-amber-200/80 bg-white flex flex-col justify-between gap-2">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <HiOutlineLink className="text-[#C2410C]" /> Enter Image URL
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="url"
                  placeholder="https://images.unsplash..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="w-full text-xs p-1.5 border border-stone-200 rounded-lg outline-none focus:border-[#C2410C]"
                />
                <button
                  type="button"
                  onClick={() => customAvatarUrl.trim() && applyAvatar(customAvatarUrl.trim())}
                  className="px-2.5 py-1.5 rounded-lg bg-[#C2410C] text-white text-xs font-bold shrink-0 hover:bg-[#9A3412]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Preset Avatars Gallery */}
          <AnimatePresence>
            {showPresets && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-amber-100"
              >
                <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                  Select a Curated Avatar Preset:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((p) => {
                    const isSelected = form.avatar === p.url;
                    return (
                      <button
                        key={p.url}
                        type="button"
                        onClick={() => applyAvatar(p.url)}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left ${
                          isSelected
                            ? 'border-[#C2410C] bg-amber-50/80 ring-2 ring-[#C2410C]/20'
                            : 'border-stone-200 hover:border-amber-400 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={p.url}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-stone-800 truncate">{p.name}</div>
                          <div className="text-[10px] text-[#C2410C] font-semibold">1-Click Apply</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature 2: Admin Dispute Arbitration Management (Only visible for Admin role) */}
        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-amber-300 p-6 sm:p-8 shadow-xl shadow-amber-900/5 space-y-5"
          >
            <div className="border-b border-amber-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#881337] flex items-center justify-center text-xl">
                  <HiOutlineShieldExclamation />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Platform Dispute Arbitration (Admin Profile)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Dispute requests submitted by customers and workers for executive mediation.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-[#9A3412] border border-amber-200">
                {adminDisputes.length} Disputes Logged
              </span>
            </div>

            {loadingDisputes ? (
              <p className="text-xs text-stone-500 py-4">Checking dispute registry…</p>
            ) : adminDisputes.length === 0 ? (
              <div className="p-6 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold">
                ✓ No active disputes registered. Platform operational with 100% satisfaction index.
              </div>
            ) : (
              <div className="space-y-3">
                {adminDisputes.map((d) => {
                  const bookingIdStr = typeof d.booking_id === 'object' ? d.booking_id?._id : d.booking_id;
                  const bookingCode = String(bookingIdStr || '').slice(-6).toUpperCase();

                  const isResolved = d.status === 'resolved';
                  const isRejected = d.status === 'rejected';

                  return (
                    <div
                      key={d._id || d.id}
                      className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isResolved
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isRejected
                          ? 'bg-rose-50/30 border-rose-200'
                          : 'bg-amber-50/40 border-amber-200/80'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRejected
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-[#9A3412]'
                            }`}
                          >
                            Status: {d.status}
                          </span>
                          <span className="font-mono text-[#C2410C] font-semibold">
                            Ticket #{bookingCode}
                          </span>
                          {d.created_at && (
                            <span className="text-stone-400 font-mono text-[11px]">
                              • {new Date(d.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-stone-900">"{d.reason}"</p>

                        {d.raiser && (
                          <p className="text-xs text-stone-600">
                            Raised by: <span className="font-bold text-stone-800">{d.raiser.name}</span> ({d.raiser.email})
                          </p>
                        )}
                      </div>

                      {['open', 'under_review'].includes(d.status) ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id, 'under_review')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition"
                          >
                            Review
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id, 'resolved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                          >
                            <HiCheckCircle className="text-sm" /> Resolve Dispute
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                          >
                            <HiXCircle className="text-sm" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-lg self-start md:self-center">
                          Arbitration Concluded
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

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
                    placeholder="Gulshan, Dhaka"
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
                {savingProfile ? 'Saving updates…' : 'Save Profile Changes'}
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
