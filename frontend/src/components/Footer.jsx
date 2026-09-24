import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineUser } from 'react-icons/hi';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { scrollToTop } from './ScrollToTop';

const Footer = () => (
  <footer className="bg-[#FAF8F5] text-stone-600 border-t border-amber-200/80 pt-16">
    <div className="max-w-7xl mx-auto px-5 md:px-8 pb-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <Link to="/" onClick={() => scrollToTop()} className="inline-flex items-center gap-2 mb-4 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D4AF37] border border-amber-400/60 flex items-center justify-center font-display font-extrabold text-white group-hover:scale-105 transition-transform shadow-sm shadow-amber-600/20">
            W
          </span>
          <span className="font-display font-extrabold text-xl text-stone-900 tracking-wider">
            WORK<span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">FORCE</span>
          </span>
        </Link>
        <p className="text-xs leading-relaxed text-stone-600 max-w-xs mb-4">
          The 2026 autonomous on-demand dispatch network connecting verified local specialists with households and organizations — fast, transparent, and audited.
        </p>
        <div className="text-xs text-stone-600 font-mono space-y-1">
          <div>Founder: <span className="text-[#881337] font-bold">Tasin Islam</span></div>
          <div>Co-Founders: <span className="text-[#881337] font-bold">Ahosan Habib</span> &amp; <span className="text-[#881337] font-bold">Farhan Ahmed</span></div>
        </div>
      </div>

      <div>
        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-stone-900 mb-4">
          Platform
        </h4>
        <ul className="space-y-2.5 text-xs font-mono text-stone-600">
          <li><Link to="/" onClick={() => scrollToTop()} className="hover:text-[#881337] transition-colors">Home Grid</Link></li>
          <li><Link to="/browse" onClick={() => scrollToTop()} className="hover:text-[#881337] transition-colors">Find a Specialist</Link></li>
          <li><Link to="/register" onClick={() => scrollToTop()} className="hover:text-[#881337] transition-colors">Register as Worker</Link></li>
          <li><Link to="/dashboard" onClick={() => scrollToTop()} className="hover:text-[#881337] transition-colors">Dispatch Dashboard</Link></li>
          <li><Link to="/bookings" onClick={() => scrollToTop()} className="hover:text-[#881337] transition-colors">Active Bookings</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-stone-900 mb-4">
          Certified Trades
        </h4>
        <ul className="space-y-2.5 text-xs font-mono text-stone-600">
          <li>Electrician Grid (৳350/hr)</li>
          <li>Hydraulic Plumber (৳300/hr)</li>
          <li>Surface Painter (৳4,500 fixed)</li>
          <li>Structural Carpenter (৳400/hr)</li>
          <li>Botanical Grounds (৳1,500 fixed)</li>
          <li>HEPA Sanitization (৳1,200 fixed)</li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-bold text-sm tracking-wider uppercase text-stone-900 mb-4">
          Leadership &amp; Contact
        </h4>
        <ul className="space-y-3 text-xs font-mono text-stone-600">
          <li className="flex items-start gap-2 text-stone-700">
            <HiOutlineUser className="text-[#C2410C] text-base mt-0.5" />
            <div>
              <div className="font-bold text-stone-900">Tasin Islam <span className="text-[#881337] font-mono text-[10px]">(Founder)</span></div>
              <div className="text-stone-600">Ahosan Habib <span className="text-[#881337] font-mono text-[10px]">(Co-Founder)</span></div>
              <div className="text-stone-600">Farhan Ahmed <span className="text-[#881337] font-mono text-[10px]">(Co-Founder)</span></div>
            </div>
          </li>
          <li className="flex items-center gap-2">
            <HiOutlinePhone className="text-[#C2410C] text-base" />
            <a href="tel:+8801717408075" className="hover:text-[#881337] transition-colors font-bold text-stone-900">
              +8801717408075
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaWhatsapp className="text-emerald-600 text-base" />
            <a
              href="https://wa.me/qr/HFFRHGPGCI6PL1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline flex items-center gap-1 font-bold"
            >
              WhatsApp Support
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaFacebook className="text-[#1877F2] text-base" />
            <a
              href="https://www.facebook.com/tasinislam.riju"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:underline flex items-center gap-1 font-bold"
            >
              Facebook Official
            </a>
          </li>
          <li className="flex items-center gap-2">
            <HiOutlineMail className="text-[#C2410C] text-base" />
            <a href="mailto:admin@workforce.app" className="hover:text-[#881337] transition-colors text-stone-900">
              admin@workforce.app
            </a>
          </li>
          <li className="flex items-center gap-2">
            <HiOutlineLocationMarker className="text-[#C2410C] text-base" />
            <span>Dhaka, Bangladesh [SECTOR 01]</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-amber-200/70 py-6 text-center text-xs text-stone-500 font-mono">
      © {new Date().getFullYear()} WORKFORCE — On-Demand Neural Workforce Management System · Founded by <span className="text-[#881337] font-semibold">Tasin Islam</span> · Co-Founded by <span className="text-[#881337] font-semibold">Ahosan Habib</span> &amp; <span className="text-[#881337] font-semibold">Farhan Ahmed</span> (Hotline: +8801717408075)
    </div>
  </footer>
);

export default Footer;
