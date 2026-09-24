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
} from 'react-icons/hi';
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
      setReviews(rev);
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
      <h2 className="text-2xl font-bold text-slate-800">Worker Profile Not Found</h2>
      <Link to="/browse" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
        Back to Specialist Directory
      </Link>
    </div>
  );

  const { profile, offers, availability } = data;

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Back button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-stone-500 hover:text-[#C2410C] mb-8 transition-colors"
        >
          <HiOutlineArrowLeft className="text-sm" /> BACK TO ALL SPECIALISTS
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl p-7 border border-amber-200/80 shadow-md shadow-amber-900/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {profile.user_id?.avatar || profile.user?.avatar ? (
                  <img
                    src={profile.user_id?.avatar || profile.user?.avatar}
                    alt={profile.user_id?.name || 'Worker'}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-300 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center font-display font-extrabold text-3xl shadow-md shrink-0">
                    {profile.user_id?.name?.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">
                      {profile.user_id?.name}
                    </h1>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-[#C2410C] px-2.5 py-1 rounded-md border border-amber-200">
                        <HiOutlineCheckCircle className="text-[#C2410C] text-sm" /> Verified Specialist
                      </span>
                    )}
                  </div>

                  <p className="text-[#C2410C] font-semibold text-sm mt-1">{profile.service_type}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-500 font-medium">
                    <RatingStars rating={profile.rating} count={profile.ratingCount} size="text-base" />
                    <span className="flex items-center gap-1">
                      <HiOutlineLocationMarker className="text-stone-400" />
                      {profile.user_id?.location || 'Dhaka, Bangladesh'}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineBriefcase className="text-stone-400" />
                      {profile.completedJobs} jobs completed
                    </span>
                  </div>
                </div>
              </div>

              {/* About / Bio */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  About The Specialist
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {profile.bio || 'Demonstrated trade proficiency, punctuality, and commitment to quality execution. Available for scheduled and urgent residential and commercial jobs.'}
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
                        className="px-3 py-1.5 rounded-lg bg-amber-50/70 text-[#9A3412] text-xs font-semibold border border-amber-200/60"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-2xl p-7 border border-amber-200/80 shadow-md shadow-amber-900/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-stone-900 flex items-center gap-2">
                  <HiOutlineStar className="text-amber-500 text-xl" />
                  Verified Client Reviews ({reviews.length})
                </h2>
                {reviews.length > 0 && (
                  <span className="text-xs font-mono font-bold text-stone-500">
                    Avg Rating: {Number(profile.rating || 0).toFixed(1)} / 5.0
                  </span>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-stone-500 text-sm py-4">No reviews yet. Be the first client to book and review this specialist.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={r._id || r.id || i} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-stone-800 text-sm">{r.customer_id?.name || r.customer?.name || 'Verified Customer'}</span>
                        <RatingStars rating={r.rating} />
                      </div>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">"{r.comment}"</p>
                    </div>
                  ))}
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
            <div className="bg-white rounded-2xl p-6 border border-amber-200/80 shadow-md shadow-amber-900/5 sticky top-24 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C2410C] block mb-1">
                  // SELECT SERVICE &amp; BOOK
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
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-[#C2410C] bg-amber-50/70 shadow-sm'
                            : 'border-stone-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-stone-900">{o.service_id?.service_name}</span>
                          <span className="font-mono font-bold text-sm text-[#C2410C]">
                            {o.hourly_rate ? `৳${o.hourly_rate}/hr` : o.fixed_price ? `৳${o.fixed_price}` : 'Rate on request'}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-500">No specific offers listed.</p>
                )}
              </div>

              {/* CTA Book Button */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-md shadow-[#C2410C]/20 hover:shadow-lg transition-all"
              >
                Book Specialist Now
              </button>

              {/* Availability */}
              <div className="pt-5 border-t border-stone-100">
                <h4 className="font-display font-bold text-sm text-stone-900 mb-3 flex items-center gap-1.5">
                  <HiOutlineCalendar className="text-[#C2410C] text-base" /> Weekly Availability
                </h4>
                <ul className="text-xs text-stone-600 space-y-2">
                  {availability?.length > 0 ? (
                    availability.map((a) => (
                      <li key={a._id} className="flex justify-between items-center py-1 border-b border-stone-50 last:border-0">
                        <span className="font-medium text-stone-700">{a.day_of_week}</span>
                        <span className="font-mono font-semibold text-stone-900">{a.start_time} – {a.end_time}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-stone-400">Flexible schedule — contact upon booking.</li>
                  )}
                </ul>
              </div>

              {/* Trust Assurance */}
              <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
                <HiOutlineShieldCheck className="text-amber-600 text-lg flex-shrink-0" />
                <span>Full platform protection and dispute guarantee included.</span>
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
