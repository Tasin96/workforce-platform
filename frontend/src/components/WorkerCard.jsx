import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import RatingStars from './RatingStars';

const WorkerCard = ({ worker, index = 0 }) => {
  const offer = worker.offers?.[0];
  const priceLabel = offer
    ? offer.hourly_rate
      ? `৳${offer.hourly_rate}/hr`
      : offer.fixed_price
      ? `৳${offer.fixed_price} fixed`
      : 'Rate on request'
    : 'Rate on request';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="group relative bg-white rounded-2xl border border-amber-200/80 shadow-card hover:shadow-ticket hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      <div className="p-6">
        {/* Top Worker Profile & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {worker.user_id?.avatar || worker.user?.avatar || worker.avatar ? (
                <img
                  src={worker.user_id?.avatar || worker.user?.avatar || worker.avatar}
                  alt={worker.user_id?.name || worker.user?.name || 'Worker'}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-300 shadow-sm shadow-amber-600/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D4AF37] text-white flex items-center justify-center font-display font-bold text-lg shadow-sm shadow-amber-600/20">
                  {(worker.user_id?.name || worker.user?.name || worker.name || 'W').charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Active & Available" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-lg text-stone-900 group-hover:text-[#881337] transition-colors">
                  {worker.user_id?.name || worker.user?.name || worker.name || 'Specialist'}
                </h3>
                {(worker.isVerified ?? worker.is_verified) && (
                  <HiOutlineCheckCircle className="text-[#C2410C] text-lg flex-shrink-0" title="Verified Specialist" />
                )}
              </div>
              <span className="inline-block text-xs font-semibold text-[#9A3412] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                {worker.service_type}
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50/50 text-stone-700 border border-amber-200/60">
            {worker.experience || 'Verified'}
          </span>
        </div>

        {/* Bio */}
        <p className="mt-4 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {worker.bio || 'Qualified local specialist with demonstrated trade expertise and vetted background credentials.'}
        </p>

        {/* Skills Pills */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {worker.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium bg-amber-50/40 text-stone-700 px-2 py-0.5 rounded border border-amber-200/60"
              >
                {skill}
              </span>
            ))}
            {worker.skills.length > 3 && (
              <span className="text-[10px] font-mono text-stone-400">+{worker.skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Ratings and Location */}
        <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-xs text-stone-500">
          <RatingStars rating={worker.rating} count={worker.ratingCount || worker.rating_count} />
          <div className="flex items-center gap-1 text-stone-500 font-medium">
            <HiOutlineLocationMarker className="text-amber-700/60 text-sm" />
            <span className="truncate max-w-[120px]">{worker.user_id?.location || worker.user?.location || worker.location || 'Dhaka, Bangladesh'}</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="px-6 py-4 bg-amber-50/30 border-t border-amber-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">Pricing</span>
          <div className="font-mono font-extrabold text-sm text-stone-900 flex items-center gap-1">
            <HiOutlineBriefcase className="text-[#C2410C] text-xs" />
            <span>{priceLabel}</span>
          </div>
        </div>

        <Link
          to={`/workers/${worker._id || worker.worker_id || worker.id}`}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>View &amp; Book</span>
          <HiOutlineArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default WorkerCard;
