import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineSearch, HiOutlineChatAlt2 } from 'react-icons/hi';

const NotFound = () => (
  <div className="min-h-[75vh] bg-[#FAF8F5] text-stone-900 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-300/15 blur-[130px] pointer-events-none rounded-full" />

    <div className="relative z-10">
      <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-amber-50 text-[#C2410C] font-mono text-xs font-bold mb-4 border border-amber-200/80 shadow-xs">
        // 404 SECTOR COORDINATES UNRESOLVED
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mb-3 font-display">
        Signal Lost in Matrix
      </h1>
      <p className="text-stone-600 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
        The requested dispatch route or sector node could not be localized. It may have been relocated or archived.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#9F1239] hover:via-[#EA580C] hover:to-[#F59E0B] text-white font-bold text-sm shadow-md shadow-[#C2410C]/25 transition-all"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          Return to Grid
        </Link>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-amber-50/50 text-[#9A3412] border border-amber-200/80 font-mono text-xs font-bold transition-all shadow-sm"
        >
          <HiOutlineSearch className="w-4 h-4" />
          Browse Specialists
        </Link>
        <a
          href="https://wa.me/qr/HFFRHGPGCI6PL1"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-mono text-xs font-bold transition-all shadow-sm"
        >
          <HiOutlineChatAlt2 className="w-4 h-4" />
          WhatsApp Support
        </a>
      </div>
    </div>
  </div>
);

export default NotFound;
