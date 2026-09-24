import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineTrendingUp, HiOutlineShieldCheck } from 'react-icons/hi';
import { playBlip } from '../utils/cyberAudio';

const benefits = [
  {
    icon: HiOutlineClock,
    title: 'Sub-15m Rapid Mobilization',
    text: 'Pre-vetted specialists ready to dispatch on short notice, minimizing costly downtime during plumbing or electrical failures.',
    color: '#C2410C',
  },
  {
    icon: HiOutlineCurrencyDollar,
    title: 'Institutional Cost Certainty',
    text: 'Predictable rates in BDT without irregular inflated quotes or hidden travel fees.',
    color: '#D97706',
  },
  {
    icon: HiOutlineTrendingUp,
    title: 'Worker Growth & Dignity',
    text: 'Equips verified local tradespeople with sustainable income, digital identity, and direct client access.',
    color: '#881337',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure Audited Escrow',
    text: 'Every transaction, booking contract, and dispute is permanently verified and safely recorded.',
    color: '#B45309',
  },
];

const BenefitsSection = () => (
  <section className="bg-[#FAF8F5] py-28 relative overflow-hidden border-b border-amber-200/60">
    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
            <span>PROVEN VALUE EQUATION</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-[1.15]">
            A Zero-Friction Grid for Customers &amp; Craftsmen.
          </h2>
          <p className="mt-5 text-stone-600 leading-relaxed text-sm sm:text-base">
            WorkForce eliminates middleman markups and replaces uncertainty with accountable technology, providing peace of mind to homeowners and regular high-paying jobs to skilled professionals.
          </p>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onMouseEnter={() => playBlip(1350 + i * 80)}
              className="p-6 rounded-2xl bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 backdrop-blur-xl group shadow-xs"
            >
              <div
                style={{ backgroundColor: `${b.color}12`, borderColor: `${b.color}30`, color: b.color }}
                className="w-11 h-11 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm"
              >
                <b.icon className="text-2xl" />
              </div>
              <h4 className="font-display font-bold text-lg text-stone-900 mb-2 group-hover:text-[#881337] transition-colors">{b.title}</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default BenefitsSection;
