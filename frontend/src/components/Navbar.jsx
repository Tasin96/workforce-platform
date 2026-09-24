import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlinePhone,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiChevronDown,
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
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    const unsub = onMuteChange((m) => setSoundMuted(m));
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSupportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
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
          {/* Compact Support & Sound Dropdown */}
          <div className="relative border-r border-amber-200/60 pr-2.5 mr-1" ref={dropdownRef}>
            <button
              onClick={() => {
                playClick();
                setSupportDropdownOpen((prev) => !prev);
              }}
              title="Support Hotline, Social Channels & Audio"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-bold transition-all ${
                supportDropdownOpen
                  ? 'bg-amber-100 border-amber-400 text-[#881337] shadow-xs ring-2 ring-amber-300/40'
                  : 'bg-white hover:bg-amber-50/80 border-amber-200/90 text-stone-700 hover:text-[#C2410C] shadow-2xs'
              }`}
            >
              <HiOutlinePhone className="text-xs text-[#C2410C]" />
              <span className="text-[11px] font-bold text-stone-800 tracking-tight">Help</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  soundMuted ? 'bg-stone-300' : 'bg-emerald-500 animate-pulse'
                }`}
                title={soundMuted ? 'Audio Muted' : 'Audio Active'}
              />
              <HiChevronDown
                className={`text-[10px] transition-transform duration-200 ${
                  supportDropdownOpen ? 'rotate-180 text-[#881337]' : 'text-stone-400'
                }`}
              />
            </button>

            {/* Dropdown Menu Panel (Solid 100% Opaque White with Rich Shadow) */}
            <AnimatePresence>
              {supportDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{ backgroundColor: '#ffffff' }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-amber-300 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.06)] p-2.5 z-[100] space-y-1.5 text-stone-700"
                >
                  <div className="px-2.5 py-1.5 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-amber-900 tracking-wider">DIRECT CHANNELS</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      24/7 Live
                    </span>
                  </div>

                  {/* Phone Call */}
                  <a
                    href="tel:+8801717408075"
                    onClick={() => setSupportDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#C2410C] flex items-center justify-center text-sm border border-orange-200/60 shrink-0 group-hover:scale-105 transition-transform">
                        <HiOutlinePhone />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-stone-900 group-hover:text-[#881337] transition-colors">
                          +8801717408075
                        </div>
                        <div className="text-[10px] text-stone-500">Founder Direct Hotline</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#881337] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      CALL
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/qr/HFFRHGPGCI6PL1"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSupportDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm border border-emerald-200/60 shrink-0 group-hover:scale-105 transition-transform">
                        <FaWhatsapp />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                          WhatsApp Live Chat
                        </div>
                        <div className="text-[10px] text-stone-500">Instant response</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      CHAT
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/tasinislam.riju"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSupportDropdownOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-200/80 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1877F2] flex items-center justify-center text-sm border border-blue-200/60 shrink-0 group-hover:scale-105 transition-transform">
                        <FaFacebook />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-[#1877F2] transition-colors">
                          Facebook Official
                        </div>
                        <div className="text-[10px] text-stone-500">Tasin Islam Profile</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      VISIT
                    </span>
                  </a>

                  {/* Audio Synthesizer Control */}
                  <div className="pt-2 border-t border-amber-100 flex items-center justify-between px-2.5 py-1.5 bg-stone-50 rounded-xl">
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${soundMuted ? 'bg-stone-200 text-stone-500' : 'bg-amber-100 text-[#C2410C]'}`}>
                        {soundMuted ? <HiOutlineVolumeOff className="text-sm" /> : <HiOutlineVolumeUp className="text-sm animate-pulse" />}
                      </div>
                      <div>
                        <div className="text-[11px] font-mono font-bold text-stone-800">Cyber Audio</div>
                        <div className="text-[9px] text-stone-500">{soundMuted ? 'Muted' : 'Sound Effects Active'}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAudioToggle}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                        soundMuted
                          ? 'bg-white border-stone-300 text-stone-700 hover:border-amber-400'
                          : 'bg-gradient-to-r from-[#881337] to-[#C2410C] text-white border-transparent shadow-xs'
                      }`}
                    >
                      {soundMuted ? 'UNMUTE' : 'MUTE'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
