import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
} from 'react-icons/hi';
import { playBlip } from '../utils/cyberAudio';

const problems = [
  {
    icon: HiOutlineSearch,
    title: 'Biometric Discovery',
    tag: 'Screening SLA',
    text: 'Replacing unreliable word-of-mouth with instant, verified background checks and certified skill assessments.',
    color: '#C2410C',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Standardized Quality',
    tag: 'Trust & Safety',
    text: 'Every technician is backed by authentic customer reviews, verifiable licenses, and full platform accountability.',
    color: '#D97706',
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Cryptographic Escrow',
    tag: 'No Hidden Fees',
    text: 'Clear hourly or fixed rates in Bangladeshi Taka (BDT) agreed beforehand, held securely in transactional escrow.',
    color: '#881337',
  },
  {
    icon: HiOutlineClock,
    title: 'Sub-15m Geodesic SLA',
    tag: 'Rapid Response',
    text: 'Real-time dispatch telemetry ensures technicians arrive within agreed windows, with executive mediation by Founder Tasin Islam & Co-Founders Ahosan Habib and Farhan Ahmed.',
    color: '#B45309',
  },
];

const ProblemSection = () => {
  return (
    <section className="bg-[#FAF8F5] py-24 border-b border-amber-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
            <span>THE DISPATCH STANDARD</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
            Designed for Speed, Certainty,
            <br />
            <span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">
              and Total Accountability.
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onMouseEnter={() => playBlip(1300 + i * 90)}
              className="group bg-white rounded-2xl p-6 border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-xl shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    style={{ backgroundColor: `${p.color}12`, borderColor: `${p.color}30`, color: p.color }}
                    className="w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm"
                  >
                    <p.icon className="text-2xl" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-stone-400 group-hover:text-[#C2410C] transition-colors uppercase tracking-wider">
                    0{i + 1}
                  </span>
                </div>
                <span
                  style={{ color: p.color }}
                  className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1"
                >
                  {p.tag}
                </span>
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2 group-hover:text-[#881337] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {p.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
