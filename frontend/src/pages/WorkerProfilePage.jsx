import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineStar,
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiCheck,
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import BookingModal from '../components/BookingModal';

const WorkerProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/workers/${id}`);
      setData(res);
      setSelectedOffer(res.offers?.[0] || null);
      const { data: rev } = await api.get(`/reviews/worker/${id}`);
      setReviews(rev || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner label="Fetching specialist credentials…" />;
  if (!data) return (
    <div className="max-w-4xl mx-auto px-5 py-24 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Specialist Profile Not Found</h2>
      <Link to="/browse" className="mt-4 inline-block text-[#C2410C] font-bold hover:underline">
        Back to Specialist Directory
      </Link>
    </div>
  );

  const { profile, offers, availability } = data;

  const displayName = profile.user_id?.name || profile.user?.name || profile.name || 'Specialist';
  const displayAvatar = profile.user_id?.avatar || profile.user?.avatar || profile.avatar || '';
  const displayLocation = profile.user_id?.location || profile.user?.location || 'Dhaka, Bangladesh';
  const displayPhone = profile.user_id?.phone || profile.user?.phone || '+8801717408075';
  const cleanPhone = displayPhone.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-stone-500 hover:text-[#C2410C] mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="text-sm" /> BACK TO SPECIALIST DIRECTORY
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center font-display font-extrabold text-3xl shadow-md">
                      {displayName.charAt(0)}
                    </div>
                  )}
                  {profile.isVerified && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 rounded-full p-1 shadow-sm"
                      title="Verified Platform Professional"
                    >
                      <HiOutlineCheckCircle className="text-base font-bold" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">
                      {displayName}
                    </h1>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-[#C2410C] px-2.5 py-1 rounded-full border border-amber-200">
                        <HiOutlineCheckCircle className="text-[#C2410C] text-sm" /> Verified Specialist
                      </span>
                    )}
                  </div>

                  <p className="text-[#C2410C] font-bold text-sm mt-1">{profile.service_type}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-stone-600 font-medium">
                    <RatingStars rating={profile.rating} count={profile.ratingCount} size="text-base" />
                    <span className="flex items-center gap-1 text-stone-500">
                      <HiOutlineLocationMarker className="text-[#C2410C]" />
                      {displayLocation}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500">
                      <HiOutlineBriefcase className="text-[#C2410C]" />
                      {profile.completedJobs || 30}+ Jobs Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Credentials Strip */}
              <div className="mt-6 pt-5 border-t border-amber-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Experience</span>
                  <span className="font-bold text-xs text-stone-800 font-mono">
                    {profile.experience || '5+ Years'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Satisfaction</span>
                  <span className="font-bold text-xs text-emerald-700 font-mono">99.4% Rating</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Response Time</span>
                  <span className="font-bold text-xs text-[#9A3412] font-mono">&lt; 15 mins</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Escrow Covered</span>
                  <span className="font-bold text-xs text-stone-800">100% Protected</span>
                </div>
              </div>

              {/* About / Bio */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  About The Specialist
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {profile.bio ||
                    'Demonstrated trade proficiency, punctuality, and commitment to quality execution. Available for scheduled and urgent residential and commercial jobs across Dhaka.'}
                </p>
              </div>

              {/* Verified Skills */}
              {profile.skills?.length > 0 && (
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                    Verified Trade Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-xl bg-amber-50/70 text-[#9A3412] text-xs font-semibold border border-amber-200/70 flex items-center gap-1"
                      >
                        <HiCheck className="text-[#C2410C]" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md shadow-amber-900/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                  <HiOutlineStar className="text-amber-500 text-xl" />
                  Verified Client Reviews ({reviews.length})
                </h2>
                {reviews.length > 0 && (
                  <span className="text-xs font-mono font-bold text-[#881337] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    Average Score: {Number(profile.rating || 5.0).toFixed(1)} / 5.0
                  </span>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200/80">
                  <p className="text-stone-500 text-sm">No client reviews yet. Be the first to schedule and review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => {
                    const reviewerName = r.customer_id?.name || r.customer?.name || 'Verified Client';
                    const reviewerAvatar = r.customer_id?.avatar || r.customer?.avatar || '';

                    return (
                      <div key={r._id || r.id || i} className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {reviewerAvatar ? (
                              <img
                                src={reviewerAvatar}
                                alt={reviewerName}
                                className="w-8 h-8 rounded-full object-cover border border-amber-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#881337] to-[#C2410C] text-white flex items-center justify-center text-xs font-bold">
                                {reviewerName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-stone-900 text-xs block">{reviewerName}</span>
                              {(r.createdAt || r.created_at) && (
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {new Date(r.createdAt || r.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                </span>
                              )}
                            </div>
                          </div>
                          <RatingStars rating={r.rating} />
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">"{r.comment}"</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar: Booking & Availability */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-md shadow-amber-900/5 sticky top-24 space-y-5">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C] block mb-1">
                  OFFICIAL TARIFF &amp; BOOKING
                </span>
                <h3 className="font-display font-extrabold text-2xl text-stone-900">Services &amp; Rates</h3>
              </div>

              {/* Service offers */}
              <div className="space-y-2.5">
                {offers?.length > 0 ? (
                  offers.map((o) => {
                    const isSelected = selectedOffer?._id === o._id;
                    return (
                      <button
                        key={o._id}
                        type="button"
                        onClick={() => setSelectedOffer(o)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-[#C2410C] bg-amber-50/80 ring-2 ring-[#C2410C]/20 shadow-sm'
                            : 'border-stone-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-stone-900">
                            {o.service_id?.service_name || profile.service_type}
                          </span>
                          <span className="font-mono font-extrabold text-sm text-[#881337]">
                            {o.hourly_rate
                              ? `৳${o.hourly_rate}/hr`
                              : o.fixed_price
                              ? `৳${o.fixed_price} Fixed`
                              : 'Custom Rate'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                          <span>{isSelected ? '✓ Selected for dispatch' : 'Click to select rate'}</span>
                          <span className="text-[#C2410C] font-semibold">Verified Rate</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3.5 rounded-2xl border border-stone-200 bg-amber-50/40 text-xs">
                    <span className="font-bold text-stone-800">{profile.service_type}</span>
                    <span className="font-mono font-bold text-[#C2410C] ml-2">Standard rate</span>
                  </div>
                )}
              </div>

              {/* CTA Book Button */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-md shadow-[#C2410C]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <HiOutlineSparkles className="text-base" />
                <span>Book Specialist Now</span>
              </button>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/${cleanPhone ? (cleanPhone.startsWith('880') ? cleanPhone : `88${cleanPhone}`) : '8801717408075'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <FaWhatsapp className="text-sm" /> WhatsApp
                </a>
                <a
                  href={`tel:${displayPhone}`}
                  className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#9A3412] text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <HiOutlinePhone className="text-sm" /> Call Specialist
                </a>
              </div>

              {/* Weekly Availability */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-800 mb-2.5 flex items-center gap-1.5">
                  <HiOutlineCalendar className="text-[#C2410C] text-sm" /> Standard Working Hours
                </h4>
                <ul className="text-xs text-stone-600 space-y-1.5">
                  {availability?.length > 0 ? (
                    availability.map((a) => (
                      <li key={a._id || a.id} className="flex justify-between items-center py-1 border-b border-stone-50 last:border-0">
                        <span className="font-medium text-stone-700">{a.day_of_week}</span>
                        <span className="font-mono font-semibold text-stone-900">{a.start_time} – {a.end_time}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-500 py-1 flex items-center justify-between">
                      <span>Mon – Sat</span>
                      <span className="font-mono font-semibold">09:00 AM – 08:00 PM</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Trust Assurance */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 bg-amber-50/40 p-3 rounded-xl border border-amber-200/50">
                <HiOutlineShieldCheck className="text-[#C2410C] text-lg shrink-0" />
                <span className="text-[11px] leading-tight">
                  Dispute guarantee &amp; 100% money-back escrow protection included.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showModal && (
        <BookingModal
          worker={profile}
          offer={selectedOffer}
          onClose={() => setShowModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
};

export default WorkerProfilePage;
