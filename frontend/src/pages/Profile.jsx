import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  HiOutlineLockClosed,
  HiOutlineKey,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineCurrencyDollar,
  HiOutlineExternalLink,
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
  'Mason / Construction',
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

  // Active Tab
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [form, setForm] = useState({ name: '', phone: '', location: '', email: '', avatar: '' });
  const [workerProfileId, setWorkerProfileId] = useState('');
  const [workerForm, setWorkerForm] = useState({
    bio: '',
    experience: '',
    service_type: 'Electrician',
    hourly_rate: '',
    fixed_price: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  // Password / Security Form
  const [securityForm, setSecurityForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWorker, setSavingWorker] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // UI state
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  // Admin Data
  const [adminDisputes, setAdminDisputes] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  const fetchProfileData = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.user) {
        setForm({
          name: data.user.name || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '',
        });
      }
      if (data.workerProfile) {
        setWorkerProfileId(data.workerProfile.id || data.workerProfile._id || '');
        const offer = data.workerProfile.offers?.[0];
        setWorkerForm({
          bio: data.workerProfile.bio || '',
          experience: data.workerProfile.experience || '',
          service_type: data.workerProfile.service_type || 'Electrician',
          hourly_rate: offer?.hourly_rate ?? '',
          fixed_price: offer?.fixed_price ?? '',
          skills: data.workerProfile.skills || [],
        });
      }
    } catch (err) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    if (user?.role !== 'admin') return;
    setLoadingAdminData(true);
    try {
      const [disputesRes, usersRes] = await Promise.all([
        api.get('/disputes').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] })),
      ]);
      setAdminDisputes(disputesRes.data || []);
      setAdminUsers(usersRes.data || []);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoadingAdminData(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    if (user?.role === 'admin') {
      fetchAdminData();
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
      toast.success('Account profile updated successfully!');
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
      await api.put('/workers/me', {
        service_type: workerForm.service_type,
        experience: workerForm.experience,
        bio: workerForm.bio,
        skills: workerForm.skills,
        hourly_rate: workerForm.hourly_rate ? parseFloat(workerForm.hourly_rate) : null,
        fixed_price: workerForm.fixed_price ? parseFloat(workerForm.fixed_price) : null,
      });
      toast.success('Professional technician credentials & rates updated!');
      fetchProfileData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update worker credentials');
    } finally {
      setSavingWorker(false);
    }
  };

  // Add / remove skill tags
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (workerForm.skills.includes(trimmed)) {
      toast.error('Skill already added.');
      return;
    }
    setWorkerForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setWorkerForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Save password
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSavingSecurity(true);
    try {
      await api.put('/users/me', { password: securityForm.newPassword });
      toast.success('Password updated successfully! Your account is secure.');
      setSecurityForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingSecurity(false);
    }
  };

  // Admin dispute resolution handler
  const handleUpdateDispute = async (id, status) => {
    try {
      await api.put(`/disputes/${id}`, { status });
      toast.success(`Dispute status updated to "${status}"`);
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update dispute');
    }
  };

  if (loading) return <LoadingSpinner label="Retrieving account settings…" />;

  const isCustomer = user?.role === 'customer';
  const isWorker = user?.role === 'worker';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Identity Card */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group shrink-0">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt={form.name || 'User'}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md shadow-[#C2410C]/20"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center text-3xl font-black shadow-md shadow-[#C2410C]/20">
                    {form.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-[#C2410C] text-white shadow-md hover:bg-[#9A3412] transition-colors"
                  title="Upload profile photo"
                >
                  <HiOutlineCamera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
                    {form.name || user?.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isAdmin
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : isWorker
                        ? 'bg-amber-50 text-[#9A3412] border border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <HiShieldCheck className="w-3.5 h-3.5" />
                    {user?.role === 'admin' ? 'Administrator' : user?.role === 'worker' ? 'Specialist' : 'Client Account'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>{form.email || user?.email}</span>
                  <span>•</span>
                  <span>{form.phone || 'Phone not set'}</span>
                  <span>•</span>
                  <span>{form.location || 'Dhaka, Bangladesh'}</span>
                </p>

                {isWorker && workerProfileId && (
                  <Link
                    to={`/workers/${workerProfileId}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#C2410C] hover:text-[#9A3412] hover:underline"
                  >
                    <HiOutlineExternalLink className="text-sm" /> View Public Directory Profile
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              {isCustomer && (
                <Link
                  to="/bookings"
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#881337] border border-amber-200 text-xs font-bold transition flex items-center gap-1"
                >
                  My Bookings
                </Link>
              )}
              {isWorker && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#881337] border border-amber-200 text-xs font-bold transition flex items-center gap-1"
                >
                  Worker Dashboard
                </Link>
              )}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#881337] bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Verified &amp; Active
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 pt-4 border-t border-amber-100 flex flex-wrap items-center gap-2">
            {[
              { id: 'general', label: 'Identity & Details', icon: HiOutlineUser },
              ...(isWorker ? [{ id: 'worker', label: 'Specialist Credentials & Rates', icon: HiOutlineBriefcase }] : []),
              ...(isAdmin
                ? [
                    { id: 'admin_disputes', label: `Arbitration (${adminDisputes.length})`, icon: HiOutlineShieldExclamation },
                    { id: 'admin_users', label: `User Directory (${adminUsers.length})`, icon: HiOutlineUsers },
                  ]
                : []),
              { id: 'security', label: 'Security & Password', icon: HiOutlineLockClosed },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] text-white shadow-sm shadow-[#C2410C]/20'
                      : 'bg-amber-50/60 hover:bg-amber-100/70 text-stone-700 border border-amber-200/70'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: General Identity & Contact Details */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Avatar Uploader Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-5"
            >
              <div className="border-b border-amber-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <HiOutlinePhotograph className="text-lg text-[#C2410C]" /> Profile Picture &amp; Avatar
                  </h2>
                  <p className="text-xs text-stone-500">
                    Upload a personal photo, enter an image link, or choose from our curated presets.
                  </p>
                </div>
                {form.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold self-start sm:self-center"
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

              <div className="grid sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-2xl border border-dashed border-[#C2410C]/60 bg-amber-50/40 hover:bg-amber-50 text-stone-800 flex flex-col items-center justify-center gap-1 text-xs font-bold transition group"
                >
                  <HiOutlineCamera className="text-2xl text-[#C2410C] group-hover:scale-110 transition-transform" />
                  <span>Upload From Device</span>
                  <span className="text-[10px] font-normal text-stone-400">JPG, PNG, WebP (max 5MB)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="p-3.5 rounded-2xl border border-amber-200/80 bg-white hover:bg-amber-50/50 text-stone-800 flex flex-col items-center justify-center gap-1 text-xs font-bold transition group"
                >
                  <HiOutlineSparkles className="text-2xl text-[#D97706] group-hover:scale-110 transition-transform" />
                  <span>{showPresets ? 'Hide Avatar Presets' : 'Choose Curated Preset'}</span>
                  <span className="text-[10px] font-normal text-stone-400">8 High-res portraits</span>
                </button>

                <div className="p-3.5 rounded-2xl border border-amber-200/80 bg-white flex flex-col justify-between gap-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <HiOutlineLink className="text-[#C2410C]" /> Enter Image URL
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="https://..."
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

              {/* Presets Grid */}
              <AnimatePresence>
                {showPresets && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-amber-100"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => applyAvatar(p.url)}
                          className="p-2 rounded-xl border border-stone-200 hover:border-[#C2410C] bg-white hover:bg-amber-50/50 flex items-center gap-2 text-left transition"
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-stone-800 block truncate">{p.name}</span>
                            <span className="text-[10px] text-[#C2410C] font-semibold">1-Tap Apply</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Personal Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-5"
            >
              <div className="border-b border-amber-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">Personal &amp; Contact Information</h2>
                <p className="text-xs text-stone-500">
                  Shared with dispatchers and clients upon booking confirmation.
                </p>
              </div>

              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-xl">
                      <HiOutlineUser className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <div className="relative rounded-xl">
                      <HiOutlinePhone className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                        placeholder="+8801717408075"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address (Login ID)
                    </label>
                    <div className="relative rounded-xl opacity-75">
                      <HiOutlineMail className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                      <input
                        type="email"
                        disabled
                        value={form.email}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Operating City / Base Area
                    </label>
                    <div className="relative rounded-xl">
                      <HiOutlineLocationMarker className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                      <input
                        type="text"
                        required
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                        placeholder="Gulshan, Dhaka"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-md shadow-[#C2410C]/20 transition disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {savingProfile ? 'Saving updates…' : 'Save Contact Details'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* TAB 2: Worker Specialist Credentials & Rates (Only for Worker role) */}
        {activeTab === 'worker' && isWorker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-5"
          >
            <div className="border-b border-amber-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <HiOutlineBriefcase className="text-lg text-[#C2410C]" /> Specialist Credentials &amp; Hourly Rates
                </h2>
                <p className="text-xs text-stone-500">
                  Configure your hourly tariff, experience, and trade skills shown in the client booking section.
                </p>
              </div>

              {workerProfileId && (
                <Link
                  to={`/workers/${workerProfileId}`}
                  className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-[#881337] text-xs font-bold transition flex items-center gap-1 self-start sm:self-center"
                >
                  <HiOutlineEye className="text-sm" /> Preview Listing
                </Link>
              )}
            </div>

            <form onSubmit={saveWorkerProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Primary Trade Specialty
                  </label>
                  <select
                    value={workerForm.service_type}
                    onChange={(e) => setWorkerForm({ ...workerForm, service_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                  >
                    {TRADES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={workerForm.experience}
                    onChange={(e) => setWorkerForm({ ...workerForm, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                    placeholder="e.g. 6+ Years Licensed"
                  />
                </div>
              </div>

              {/* Hourly Rate & Fixed Tariff Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                      Hourly Rate (৳ BDT / Hour)
                    </label>
                    <span className="text-[10px] text-stone-500 font-mono">Used for duration calculation</span>
                  </div>
                  <div className="relative rounded-xl">
                    <span className="absolute left-3.5 top-2.5 font-bold font-mono text-stone-500">৳</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={workerForm.hourly_rate}
                      onChange={(e) => setWorkerForm({ ...workerForm, hourly_rate: e.target.value })}
                      placeholder="e.g. 350"
                      className="w-full pl-8 pr-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono font-bold text-stone-900 focus:border-[#C2410C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Fixed Package Rate (Optional)
                    </label>
                    <span className="text-[10px] text-stone-500 font-mono">Full project rate</span>
                  </div>
                  <div className="relative rounded-xl">
                    <span className="absolute left-3.5 top-2.5 font-bold font-mono text-stone-500">৳</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={workerForm.fixed_price}
                      onChange={(e) => setWorkerForm({ ...workerForm, fixed_price: e.target.value })}
                      placeholder="e.g. 4500"
                      className="w-full pl-8 pr-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm font-mono font-bold text-stone-900 focus:border-[#C2410C] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Verified Skills &amp; Equipment
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {workerForm.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-amber-50 text-[#881337] border border-amber-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>✓ {skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-stone-400 hover:text-rose-600 font-bold ml-1"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {workerForm.skills.length === 0 && (
                    <span className="text-xs text-stone-400 italic">No skills listed yet. Add some below!</span>
                  )}
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Wiring, Pipe Fitting, Deep Clean..."
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-[#C2410C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-[#C2410C] text-white text-xs font-bold shrink-0 hover:bg-[#9A3412]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Professional Bio &amp; Execution Summary
                </label>
                <textarea
                  rows={3}
                  value={workerForm.bio}
                  onChange={(e) => setWorkerForm({ ...workerForm, bio: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none resize-none"
                  placeholder="Describe your background, emergency response capabilities, and certifications..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingWorker}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-md shadow-[#C2410C]/20 transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {savingWorker ? 'Updating credentials…' : 'Save Specialist Credentials & Rates'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* TAB 3: Admin Dispute Arbitration & Platform Governance (Only for Admin role) */}
        {activeTab === 'admin_disputes' && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-5"
          >
            <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <HiOutlineShieldExclamation className="text-lg text-[#C2410C]" /> Executive Dispute Arbitration Console
                </h2>
                <p className="text-xs text-stone-500">
                  Formal escrow mediation for unresolved customer-worker disputes across Bangladesh.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-[#881337] border border-amber-200">
                {adminDisputes.length} Disputes
              </span>
            </div>

            {loadingAdminData ? (
              <p className="text-xs text-stone-500 py-4">Checking dispute registry…</p>
            ) : adminDisputes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center text-xs text-emerald-800 font-semibold space-y-1">
                <div className="text-xl">✓</div>
                <div>All service dispatches running at 100% satisfaction. No open dispute tickets.</div>
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
                      className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isResolved
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : isRejected
                          ? 'bg-rose-50/30 border-rose-200'
                          : 'bg-amber-50/40 border-amber-200/80'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${
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
                            <span className="text-stone-400 font-mono text-[10px]">
                              {new Date(d.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-stone-900">"{d.reason}"</p>

                        {d.raiser && (
                          <p className="text-xs text-stone-600">
                            Raiser: <strong className="text-stone-800">{d.raiser.name}</strong> ({d.raiser.email})
                          </p>
                        )}
                      </div>

                      {['open', 'under_review'].includes(d.status) ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id || d.id, 'under_review')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition"
                          >
                            Reviewing
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id || d.id, 'resolved')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                          >
                            <HiCheckCircle className="text-sm" /> Resolve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateDispute(d._id || d.id, 'rejected')}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                          >
                            <HiXCircle className="text-sm" /> Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-xl self-start md:self-center">
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

        {/* TAB 4: Admin Platform User Directory (Only for Admin role) */}
        {activeTab === 'admin_users' && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-4"
          >
            <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <HiOutlineUsers className="text-lg text-[#C2410C]" /> Registered Platform Users Directory
                </h2>
                <p className="text-xs text-stone-500">
                  Global roster of verified customers, specialists, and platform administrators.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-[#881337] border border-amber-200">
                {adminUsers.length} Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50/70 border-b border-amber-200 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {adminUsers.map((u) => (
                    <tr key={u.user_id || u._id} className="hover:bg-amber-50/30 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#881337] to-[#C2410C] text-white flex items-center justify-center font-bold text-xs">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-stone-900 block">{u.name}</span>
                            <span className="text-stone-400 text-[11px]">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                            u.role === 'admin'
                              ? 'bg-rose-100 text-rose-800'
                              : u.role === 'worker'
                              ? 'bg-amber-100 text-[#9A3412]'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-stone-700">{u.phone || '—'}</td>
                      <td className="p-3 text-stone-600">{u.location || 'Dhaka, Bangladesh'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 5: Security & Password Management */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-md shadow-amber-900/5 space-y-5"
          >
            <div className="border-b border-amber-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <HiOutlineLockClosed className="text-lg text-[#C2410C]" /> Account Security &amp; Credentials
              </h2>
              <p className="text-xs text-stone-500">
                Update your login password and review platform authentication protections.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  New Password
                </label>
                <div className="relative rounded-xl">
                  <HiOutlineKey className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative rounded-xl">
                  <HiOutlineKey className="absolute left-3.5 top-3 text-stone-400 text-lg" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:bg-white focus:border-[#C2410C] outline-none"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingSecurity}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white text-xs font-bold shadow-md shadow-[#C2410C]/20 transition disabled:opacity-60 flex items-center gap-1.5"
                >
                  {savingSecurity ? 'Updating password…' : 'Update Password'}
                </button>
              </div>
            </form>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-[#9A3412] flex items-center gap-1">
                <HiShieldCheck className="text-base text-[#C2410C]" /> Multi-Tier Identity Security Active
              </span>
              <p className="text-[11px] text-stone-500">
                Your session is protected with cryptographic JWT tokens and bcrypt salting. Platform transactions are backed by an escrow guarantee.
              </p>
            </div>
          </motion.div>
        )}

        {/* Support & Governance Card */}
        <div className="bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#9A3412] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                WorkForce Support &amp; Governance
              </span>
              <h3 className="text-xl font-bold mt-1">Need help with dispatch or escrow?</h3>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl">
                Platform Leadership: Founder Tasin Islam and Co-Founders Ahosan Habib and Farhan Ahmed are available directly via WhatsApp, Facebook, and direct line for priority escalation and arbitration.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
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
                <FaFacebook className="text-base" /> Facebook
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
