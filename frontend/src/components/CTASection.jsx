import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlineShieldCheck, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { scrollToTop } from './ScrollToTop';
import { playEngage, playClick } from '../utils/cyberAudio';

const CTASection = () => (
  <section className="bg-[#FAF8F5] py-24 relative overflow-hidden border-b border-amber-200/60">
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D0612] via-[#5C0D24] to-[#881337] border border-amber-400/30 px-8 py-16 md:px-16 md:py-20 text-white shadow-[0_25px_60px_-15px_rgba(76,5,25,0.4)] text-center"
      >
        {/* Decorative ambient lighting */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-rose-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-cyber-grid opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Refined Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs font-mono font-bold tracking-wider mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>VERIFIED WORKFORCE NETWORK</span>
            <span className="text-amber-300/60">|</span>
            <span>NATIONWIDE ON-DEMAND</span>
          </div>

          {/* Elegant Executive Headline */}
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
            Ready to Hire
            <br />
            <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              Verified Professionals?
            </span>
          </h2>

          <p className="mt-5 text-stone-200/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Connect with pre-screened specialists across Dhaka for immediate repairs or scheduled projects with transparent pricing and guaranteed service quality.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/browse"
              onClick={() => {
                playEngage();
                scrollToTop();
              }}
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-stone-900 font-display font-extrabold shadow-lg transition-all text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Find a Specialist</span>
              <HiArrowRight className="group-hover:translate-x-1 transition-transform text-[#C2410C]" />
            </Link>

            <Link
              to="/register"
              onClick={() => {
                playClick();
                scrollToTop();
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-300/30 text-white font-mono font-bold transition-all text-sm shadow-sm backdrop-blur-sm hover:border-amber-300/60"
            >
              <span>Join as a Professional</span>
            </Link>

            <a
              href="https://wa.me/qr/HFFRHGPGCI6PL1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all text-sm shadow-md border border-emerald-400/40"
            >
              <FaWhatsapp className="text-lg" />
              <span>WhatsApp Support</span>
            </a>
          </div>

          {/* Polished Trust Strip */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-stone-300 font-medium">
            <span className="flex items-center gap-2">
              <HiOutlineClock className="text-amber-300 text-base" />
              <span>Sub-15 Min Rapid Response</span>
            </span>
            <span className="flex items-center gap-2">
              <HiOutlineShieldCheck className="text-emerald-400 text-base" />
              <span>100% NID &amp; Background Verified</span>
            </span>
            <span className="flex items-center gap-2 text-amber-200">
              <HiOutlinePhone className="text-amber-300 text-base" />
              <span>Direct Support: +8801717408075</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
