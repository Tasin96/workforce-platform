import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlinePhone,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
} from 'react-icons/hi';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { scrollToTop } from './ScrollToTop';
import { isMuted, toggleMute, onMuteChange, playClick } from '../utils/cyberAudio';

const navLinkClass = ({ isActive }) =>
  `relative px-3 py-1.5 font-mono text-xs tracking-wider transition-all rounded-lg ${
    isActive
      ? 'text-[#9A3412] bg-amber-50/90 border border-amber-300/80 shadow-xs font-bold'
      : 'text-stone-600 hover:text-[#881337] hover:bg-amber-50/50'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [soundMuted, setSoundMuted] = useState(isMuted());
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    const unsub = onMuteChange((m) => setSoundMuted(m));
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  const handleLogout = () => {
    playClick();
    logout();
    scrollToTop();
    navigate('/');
  };

  const handleAudioToggle = () => {
    const newState = toggleMute();
    setSoundMuted(newState);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-amber-200/70 shadow-sm'
          : 'bg-white/85 backdrop-blur-md border-b border-amber-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => {
            playClick();
            scrollToTop();
          }}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D4AF37] border border-amber-400/60 flex items-center justify-center relative overflow-hidden shadow-sm shadow-amber-500/20">
            <span className="relative text-white font-display font-extrabold text-base transition-colors">
              W
            </span>
          </span>
          <span className="font-display font-extrabold text-lg tracking-wider text-stone-900">
            WORK<span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">FORCE</span>
            <span className="text-[10px] font-mono text-amber-700/80 ml-1.5 font-bold tracking-widest hidden sm:inline">
              // 2026
            </span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" end onClick={() => { playClick(); scrollToTop(); }} className={navLinkClass}>HOME</NavLink>
          <NavLink to="/browse" onClick={() => { playClick(); scrollToTop(); }} className={navLinkClass}>FIND WORKERS</NavLink>
          {user && <NavLink to="/dashboard" onClick={() => { playClick(); scrollToTop(); }} className={navLinkClass}>DASHBOARD</NavLink>}
          {user && <NavLink to="/bookings" onClick={() => { playClick(); scrollToTop(); }} className={navLinkClass}>BOOKINGS</NavLink>}
          {user && <NavLink to="/profile" onClick={() => { playClick(); scrollToTop(); }} className={navLinkClass}>PROFILE</NavLink>}
        </nav>

        {/* Right Command Strip */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            title={soundMuted ? 'Unmute Cyber Audio' : 'Mute Cyber Audio'}
            className="p-2 rounded-lg bg-stone-100/80 border border-amber-200/60 hover:border-amber-400/80 text-stone-700 hover:text-[#C2410C] transition-colors text-base"
          >
            {soundMuted ? <HiOutlineVolumeOff className="text-stone-400" /> : <HiOutlineVolumeUp className="text-[#C2410C]" />}
          </button>

          {/* Social & Phone Quick Drawer */}
          <div className="flex items-center gap-2 border-r border-amber-200/60 pr-3 mr-1 text-stone-500">
            <a
              href="https://wa.me/qr/HFFRHGPGCI6PL1"
              target="_blank"
              rel="noopener noreferrer"
              title="Chat with Founder Tasin Islam on WhatsApp"
              className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 text-stone-500 transition-colors"
            >
              <FaWhatsapp className="text-base text-emerald-600" />
            </a>
            <a
              href="https://www.facebook.com/tasinislam.riju"
              target="_blank"
              rel="noopener noreferrer"
              title="Tasin Islam on Facebook"
              className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-[#1877F2] text-stone-500 transition-colors"
            >
              <FaFacebook className="text-base text-[#1877F2]" />
            </a>
            <a
              href="tel:+8801717408075"
              title="Call Tasin Islam: +8801717408075"
              className="text-xs font-mono font-medium text-stone-600 hover:text-[#881337] transition-colors flex items-center gap-1"
            >
              <HiOutlinePhone className="text-[#C2410C]" /> +8801717408075
            </a>
          </div>

          {user ? (
            <>
              <NavLink
                to="/notifications"
                onClick={() => { playClick(); scrollToTop(); }}
                className="p-2 rounded-lg bg-stone-100/80 border border-amber-200/60 hover:border-amber-400/80 text-stone-700 relative"
              >
                <HiOutlineBell className="text-lg" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C2410C] rounded-full animate-pulseDot" />
              </NavLink>

              <Link
                to="/profile"
                onClick={() => { playClick(); scrollToTop(); }}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50/70 border border-amber-200/80 hover:border-amber-400 transition-all group"
                title="View & Edit Profile"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-300 shadow-xs"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center font-display font-bold text-xs shadow-xs">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs text-stone-900 font-mono font-bold leading-tight group-hover:text-[#881337] transition-colors">
                    {user.name?.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-[#C2410C] uppercase font-semibold">
                    {user.role}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-stone-100/80 border border-stone-300 text-stone-700 text-xs font-mono font-bold hover:bg-rose-50 hover:border-rose-300 hover:text-[#881337] transition-colors"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => { playClick(); scrollToTop(); }}
                className="px-3.5 py-1.5 text-xs font-mono font-bold text-stone-700 hover:text-[#881337] transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                onClick={() => { playClick(); scrollToTop(); }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white text-xs font-display font-extrabold shadow-md shadow-amber-600/20 transition-all"
              >
                ENGAGE GRID
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden p-2 text-stone-700"
          onClick={() => {
            playClick();
            setOpen(!open);
          }}
          aria-label="Toggle menu"
        >
          {open ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-amber-200/70"
          >
            <div className="flex flex-col gap-1.5 px-5 py-4">
              {user && (
                <Link
                  to="/profile"
                  onClick={() => { setOpen(false); scrollToTop(); }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 mb-2"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-lg object-cover border border-amber-300"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D97706] text-white flex items-center justify-center font-bold text-sm">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  )}
                  <div>
                    <div className="text-xs font-bold text-stone-900">{user.name}</div>
                    <div className="text-[10px] font-mono text-[#C2410C] uppercase font-semibold">{user.role} • Profile &amp; Picture</div>
                  </div>
                </Link>
              )}
              <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/" end className="py-2 text-sm font-mono text-stone-700">HOME</NavLink>
              <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/browse" className="py-2 text-sm font-mono text-stone-700">FIND WORKERS</NavLink>
              {user && <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/dashboard" className="py-2 text-sm font-mono text-stone-700">DASHBOARD</NavLink>}
              {user && <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/bookings" className="py-2 text-sm font-mono text-stone-700">BOOKINGS</NavLink>}
              {user && <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/profile" className="py-2 text-sm font-mono text-stone-700">PROFILE</NavLink>}
              {user && <NavLink onClick={() => { setOpen(false); scrollToTop(); }} to="/notifications" className="py-2 text-sm font-mono text-stone-700">NOTIFICATIONS</NavLink>}

              <div className="flex items-center justify-between py-2 border-t border-amber-100 mt-2">
                <span className="text-xs font-mono text-stone-500">CYBER AUDIO EFFECTS</span>
                <button
                  onClick={handleAudioToggle}
                  className="px-3 py-1 rounded-md bg-stone-100 border border-stone-300 text-stone-700 text-xs font-mono font-bold"
                >
                  {soundMuted ? 'MUTED' : 'ACTIVE'}
                </button>
              </div>

              {user ? (
                <button onClick={() => { setOpen(false); handleLogout(); }} className="mt-2 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#881337] font-mono font-bold text-xs">
                  LOGOUT
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link onClick={() => { setOpen(false); scrollToTop(); }} to="/login" className="flex-1 text-center py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-mono text-xs text-stone-800 font-bold">LOGIN</Link>
                  <Link onClick={() => { setOpen(false); scrollToTop(); }} to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] text-white font-display font-extrabold text-xs shadow-md">ENGAGE GRID</Link>
                </div>
              )}

              <div className="pt-3 mt-2 border-t border-amber-100 flex items-center justify-between text-xs font-mono text-stone-600">
                <a href="tel:+8801717408075" className="flex items-center gap-1 text-[#881337] font-bold">
                  <HiOutlinePhone className="text-[#C2410C]" /> +8801717408075
                </a>
                <div className="flex items-center gap-3">
                  <a href="https://wa.me/qr/HFFRHGPGCI6PL1" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold flex items-center gap-1">
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a href="https://www.facebook.com/tasinislam.riju" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] font-bold flex items-center gap-1">
                    <FaFacebook /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
