import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineCurrencyDollar,
  HiOutlineStar,
  HiOutlineLockClosed,
} from 'react-icons/hi';
import { playBlip } from '../utils/cyberAudio';

const features = [
  {
    icon: HiOutlineLocationMarker,
    title: 'Precise Geodesic Dispatch',
    text: 'Sub-second geospatial triangulation matches emergency or planned work with the optimal specialist operating inside your sector radius.',
    accent: '#C2410C',
  },
  {
    icon: HiOutlineBadgeCheck,
    title: 'Multi-Tier Neural Verification',
    text: 'Every tradesperson undergoes government biometric ID authentication, past work history audits, and hands-on capability screening.',
    accent: '#D97706',
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: 'PostgreSQL 18 Escrow Settlement',
    text: 'No ambiguous cash surprises. Real-time pre-authorized tariffs in BDT held securely in transactional escrow until work is signed off.',
    accent: '#881337',
  },
  {
    icon: HiOutlineStar,
    title: 'Executive Platform Arbitration',
    text: 'Direct dispute mediation overseen personally by Founder Tasin Islam & Co-Founders Ahosan Habib and Farhan Ahmed with 24-hr resolution SLAs.',
    accent: '#B45309',
  },
  {
    icon: HiOutlineLockClosed,
    title: 'Military-Grade Cryptographic Security',
    text: 'Hardened zero-trust infrastructure with JWT role authentication, bcrypt hashed secrets, and immutable audit logs on every booking state.',
    accent: '#9A3412',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Autonomous SLA Guarantee',
    text: 'Automated response timers, live GPS arrival beacons, and authentic client satisfaction benchmarks preserve exceptional performance.',
    accent: '#D4AF37',
  },
];

const FeaturesSection = () => (
  <section className="bg-[#FAF8F5] text-stone-900 py-28 relative overflow-hidden border-b border-amber-200/60">
    {/* Ambient radial glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-br from-amber-400/10 via-rose-500/5 to-orange-400/10 blur-[150px] pointer-events-none rounded-full" />
    <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <div className="max-w-2xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold tracking-wider mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
          <span>ENTERPRISE ARCHITECTURE • GLOBAL BENCHMARKS</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
          Engineered for Instant Scale.
          <br />
          <span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">
            Uncompromising Trust.
          </span>
        </h2>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          The next-generation workforce infrastructure connecting certified tradespeople with homes, commercial hubs, and modern organizations.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            onMouseEnter={() => playBlip(1400 + i * 80)}
            className="rounded-2xl p-7 bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between backdrop-blur-xl cursor-default shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div
                  style={{ backgroundColor: `${f.accent}12`, borderColor: `${f.accent}30`, color: f.accent }}
                  className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm"
                >
                  <f.icon />
                </div>
                <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-[#C2410C] transition-colors">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900 mb-2.5 group-hover:text-[#881337] transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {f.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
