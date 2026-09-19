import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { scrollToTop } from './ScrollToTop';
import { playEngage, playClick } from '../utils/cyberAudio';

const CTASection = () => (
  <section className="bg-[#FAF8F5] py-28 relative overflow-hidden border-b border-amber-200/60">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4C0519] via-[#881337] to-[#9A3412] border border-amber-400/40 px-8 py-16 md:px-16 md:py-20 text-white shadow-2xl text-center backdrop-blur-2xl"
      >
        {/* Decorative radial cyber glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[450px] h-[450px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-[450px] h-[450px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-mono font-bold tracking-wider mb-6 shadow-sm">
            <HiOutlineSparkles className="text-amber-300 text-sm animate-spin" style={{ animationDuration: '8s' }} />
            <span>NEURAL NETWORK OPERATIONAL // 2026 DEPLOYMENT</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Ready to Experience
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-white to-amber-300 bg-clip-text text-transparent">
              Frictionless Local Dispatch?
            </span>
          </h2>

          <p className="mt-5 text-amber-100/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Book verified local electricians, hydraulic plumbers, and surface specialists in minutes, or register your professional credentials to join our high-value dispatch roster.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/browse"
              onClick={() => {
                playEngage();
                scrollToTop();
              }}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-amber-50 text-stone-900 font-display font-extrabold shadow-lg transition-all text-sm"
            >
              <span>Browse Certified Units</span>
              <HiArrowRight className="group-hover:translate-x-1 transition-transform text-[#C2410C]" />
            </Link>

            <Link
              to="/register"
              onClick={() => {
                playClick();
                scrollToTop();
              }}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/40 text-white font-mono font-bold transition-colors text-sm shadow-sm"
            >
              <span>Register as Specialist</span>
            </Link>

            <a
              href="https://wa.me/qr/HFFRHGPGCI6PL1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition-colors text-sm shadow-md"
            >
              <FaWhatsapp className="text-lg" />
              <span>WhatsApp Hotline</span>
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-xs text-amber-200/90 font-mono">
            <span className="flex items-center gap-1.5 text-white">
              <HiOutlineLightningBolt className="text-amber-300" />
              <span>Instant Geodesic Dispatch</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <HiOutlineShieldCheck className="text-emerald-300" />
              <span>Zero Advance Surcharge</span>
            </span>
            <span className="text-amber-300 font-semibold">
              Directed by Tasin Islam (+8801717408075)
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
