import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToTop } from './ScrollToTop';
import Scene3DCanvas from './futuristic/Scene3DCanvas';
import {
  HiOutlineShieldCheck,
  HiArrowRight,
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineClock,
} from 'react-icons/hi';
import { playBlip, playEngage, playClick } from '../utils/cyberAudio';

const verifiedCards = [
  {
    id: 'w1',
    name: 'Karim Sheikh',
    trade: 'Licensed Electrician',
    rating: '4.95',
    reviews: 64,
    eta: '12 min dispatch',
    rate: '৳350/hr',
    status: 'ONLINE & READY',
    sector: 'DHAKA-GULSHAN',
    skills: ['Substation Load', 'High-Voltage', 'Breaker Diagnostics'],
  },
  {
    id: 'w2',
    name: 'Jahangir Alam',
    trade: 'Master Hydraulic Plumber',
    rating: '4.88',
    reviews: 82,
    eta: '18 min dispatch',
    rate: '৳300/hr',
    status: 'IN TRANSIT',
    sector: 'DHAKA-BANANI',
    skills: ['Acoustic Sonar', 'PEX Lines', 'High-Pressure Valves'],
  },
  {
    id: 'w3',
    name: 'Nasrin Akter',
    trade: 'Architectural Surface Painter',
    rating: '4.98',
    reviews: 47,
    eta: 'Scheduled Slot',
    rate: '৳4,500 fixed',
    status: 'VERIFIED ELITE',
    sector: 'DHAKA-DHANMONDI',
    skills: ['Textured Finishes', 'Nano-Waterproofing', '5-Yr Guarantee'],
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeWorkerIdx, setActiveWorkerIdx] = useState(0);

  // 3D Perspective Tilt on Card
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const cx = card.width / 2;
    const cy = card.height / 2;

    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) * 10;

    setTilt({
      x: rotX,
      y: rotY,
      glareX: (x / card.width) * 100,
      glareY: (y / card.height) * 100,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    playEngage();
    const params = new URLSearchParams();
    if (selectedTrade !== 'All Trades') params.append('trade', selectedTrade);
    if (searchLocation.trim()) params.append('search', searchLocation.trim());
    scrollToTop();
    navigate(`/browse?${params.toString()}`);
  };

  const currentWorker = verifiedCards[activeWorkerIdx];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#FAF8F5] text-stone-900 pt-10 pb-20 overflow-hidden border-b border-amber-200/60">
      {/* 3D WebGL / Canvas Background Interactive Layer */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-80">
        <Scene3DCanvas />
      </div>

      {/* Blueprint Grid & Soft Radial Glow Overlay */}
      <div className="absolute inset-0 blueprint-bg opacity-70 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-amber-400/15 via-rose-500/10 to-orange-400/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Search */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold tracking-wider mb-6 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulseDot" />
              <span>THE NEURAL WORKFORCE GRID</span>
              <span className="text-amber-300">|</span>
              <span className="text-[#881337]">AUTONOMOUS DISPATCH</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-stone-900 leading-[1.08]">
              Verified Specialists.
              <br />
              <span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">
                Dispatched in Seconds.
              </span>
            </h1>

            {/* Futuristic Search Capsule */}
            <form
              onSubmit={handleSearch}
              className="mt-8 p-2.5 rounded-2xl bg-white border border-amber-200/90 shadow-ticket max-w-xl flex flex-col sm:flex-row gap-2 backdrop-blur-xl"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-amber-50/30 rounded-xl border border-amber-200/60 focus-within:border-[#C2410C] transition-colors">
                <HiOutlineSearch className="text-amber-700/60 text-lg flex-shrink-0" />
                <select
                  value={selectedTrade}
                  onChange={(e) => {
                    setSelectedTrade(e.target.value);
                    playClick();
                  }}
                  className="w-full bg-transparent text-sm font-semibold text-stone-800 outline-none cursor-pointer"
                >
                  <option>All Trades</option>
                  <option>Electrician</option>
                  <option>Plumber</option>
                  <option>Painter</option>
                  <option>Carpenter</option>
                  <option>Gardener</option>
                  <option>Cleaner</option>
                </select>
              </div>

              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-amber-50/30 rounded-xl border border-amber-200/60 focus-within:border-[#C2410C] transition-colors">
                <HiOutlineLocationMarker className="text-amber-700/60 text-lg flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location (e.g. Dhaka, Gulshan)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-stone-800 placeholder-stone-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-display font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 group"
              >
                <span>ENGAGE</span>
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Trust Assurance Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <HiOutlineShieldCheck className="text-emerald-600 text-lg" />
                <span>100% NID &amp; Background Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HiOutlineClock className="text-[#C2410C] text-lg" />
                <span>Sub-15 Min Rapid Response</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Holographic Dispatch Deck with Perspective Tilt */}
          <div className="lg:col-span-5 relative perspective-1000">
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => {
                setIsCardHovered(true);
                playBlip(1500);
              }}
              onMouseLeave={() => {
                setIsCardHovered(false);
                setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
              }}
              style={{
                transform: isCardHovered
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(15px)`
                  : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
                transition: isCardHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
              }}
              className="relative rounded-3xl bg-white/95 border border-amber-200/80 p-6 md:p-7 shadow-ticket backdrop-blur-2xl overflow-hidden"
            >
              {/* Dynamic Glare Reflection */}
              {isCardHovered && (
                <div
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(212, 175, 55, 0.12) 0%, transparent 65%)`,
                  }}
                  className="absolute inset-0 pointer-events-none z-10"
                />
              )}

              {/* Header Telemetry Badge */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-amber-100 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulseDot" />
                  <span className="font-bold text-stone-900 tracking-wider">HOLO-DISPATCH TERMINAL</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                  <span>SLA 99.8%</span>
                </div>
              </div>

              {/* Worker Switcher Hologram Tabs */}
              <div className="flex gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-amber-200/60 mb-5">
                {verifiedCards.map((w, idx) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActiveWorkerIdx(idx);
                      playClick();
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                      activeWorkerIdx === idx
                        ? 'bg-gradient-to-r from-[#881337] to-[#C2410C] text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {w.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Current Active Specialist Hologram */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWorker.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D4AF37] text-white font-display font-extrabold text-2xl flex items-center justify-center shadow-md shadow-amber-600/20">
                        {currentWorker.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-stone-900 text-lg">{currentWorker.name}</h4>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-[#881337] border border-amber-200/80">
                            Verified ✓
                          </span>
                        </div>
                        <p className="text-xs text-[#C2410C] font-semibold">{currentWorker.trade}</p>
                        <p className="text-[11px] font-mono text-stone-500">{currentWorker.sector}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {currentWorker.status}
                      </span>
                      <div className="font-mono font-bold text-sm text-stone-900 mt-1">{currentWorker.rate}</div>
                    </div>
                  </div>

                  {/* Skills radar pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {currentWorker.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50/50 text-stone-700 border border-amber-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Audio-Waveform Telemetry Animation */}
                  <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-[#881337] animate-pulse h-2 rounded-full" />
                        <span className="w-1 bg-[#C2410C] animate-pulse h-4 rounded-full" />
                        <span className="w-1 bg-[#D4AF37] animate-pulse h-3 rounded-full" />
                        <span className="w-1 bg-[#C2410C] animate-pulse h-1 rounded-full" />
                      </div>
                      <span className="text-[10px] font-mono text-stone-500">GPS CARRIER LOCKED</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#881337]">
                      <HiOutlineClock />
                      <span className="font-bold">{currentWorker.eta}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Quick Dispatch Action */}
              <div className="mt-6 pt-5 border-t border-amber-100 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-stone-900">Join Worker Network</div>
                  <div className="text-[10px] text-stone-500">Daily enterprise job tickets.</div>
                </div>

                <Link
                  to="/register"
                  onClick={() => {
                    playEngage();
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/90 text-[#9A3412] border border-amber-300/80 text-xs font-mono font-bold transition-all shadow-xs"
                >
                  Join Grid
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
