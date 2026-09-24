import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineCreditCard,
  HiOutlineStar,
} from 'react-icons/hi';
import { playBlip } from '../utils/cyberAudio';

const steps = [
  {
    icon: HiOutlineSearch,
    title: 'Discover Specialists',
    text: 'Filter local technicians by discipline, verified badges, rating, and real-time availability.',
  },
  {
    icon: HiOutlineCalendar,
    title: 'Schedule & Book',
    text: 'Submit the job details, service requirements, and desired dispatch window in seconds.',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Real-Time Dispatch',
    text: 'Track live status transitions from accepted to in-progress directly on your job ticket.',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Escrow Settlement',
    text: 'Settle securely via bKash, Nagad, Card, or Cash upon verified completion with zero fee surprises.',
  },
  {
    icon: HiOutlineStar,
    title: 'Review & Verify',
    text: 'Leave a verified review to help uphold the gold standard for your neighborhood.',
  },
];

const HowItWorks = () => (
  <section className="bg-white border-b border-amber-200/80 py-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
          <span>STREAMLINED DISPATCH PIPELINE</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
          How the Neural System Operates.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
          From initial sector ping to final escrow settlement, experience total transparency, speed, and platform protection.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onMouseEnter={() => playBlip(1400 + i * 100)}
            className="relative bg-[#FAF8F5] rounded-2xl p-6 border border-amber-200/70 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-xl group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#C2410C] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                  <s.icon className="text-xl" />
                </div>
                <span className="w-7 h-7 rounded-full bg-white border border-amber-200 text-stone-700 font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-stone-900 mb-2 group-hover:text-[#881337] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">{s.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
