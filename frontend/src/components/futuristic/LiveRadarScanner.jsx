import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineShieldCheck,
  HiArrowRight,
  HiOutlinePhone,
} from 'react-icons/hi';
import { playBlip, playEngage } from '../../utils/cyberAudio';
import { scrollToTop } from '../ScrollToTop';

const RADAR_PINGS = [
  {
    id: 'ping-1',
    name: 'Karim Sheikh',
    trade: 'Licensed Electrician',
    rating: '4.85',
    distance: '1.2 km away',
    eta: '12 mins',
    sector: 'DHAKA-GULSHAN 02',
    rate: '৳350/hr',
    x: 48, // percentage
    y: 35,
    status: 'ONLINE',
    verified: true,
    skills: ['Circuit Diagnostics', 'Breaker Tripping', '3-Phase Line'],
  },
  {
    id: 'ping-2',
    name: 'Jahangir Alam',
    trade: 'Master Hydraulic Plumber',
    rating: '4.92',
    distance: '2.4 km away',
    eta: '18 mins',
    sector: 'DHAKA-BANANI 11',
    rate: '৳300/hr',
    x: 72,
    y: 58,
    status: 'AVAILABLE',
    verified: true,
    skills: ['Acoustic Leak Detection', 'Pressure Valve', 'Water Lines'],
  },
  {
    id: 'ping-3',
    name: 'Nasrin Akter',
    trade: 'Architectural Painter',
    rating: '4.96',
    distance: '3.1 km away',
    eta: '25 mins',
    sector: 'DHAKA-DHANMONDI 27',
    rate: '৳4,500 fixed',
    x: 28,
    y: 62,
    status: 'EN ROUTE',
    verified: true,
    skills: ['Textured Finishes', 'Waterproofing', 'Exterior Spray'],
  },
  {
    id: 'ping-4',
    name: 'Rafiqul Islam',
    trade: 'Precision Structural Carpenter',
    rating: '4.80',
    distance: '1.8 km away',
    eta: '14 mins',
    sector: 'DHAKA-UTTARA 07',
    rate: '৳400/hr',
    x: 35,
    y: 22,
    status: 'STANDBY',
    verified: true,
    skills: ['Cabinetry', 'Door Reinforcement', 'Furniture Repair'],
  },
  {
    id: 'ping-5',
    name: 'Farzana Begum',
    trade: 'Bio-Cleanroom Specialist',
    rating: '4.94',
    distance: '0.8 km away',
    eta: '8 mins',
    sector: 'DHAKA-MOHAKHALI DOHS',
    rate: '৳1,200 fixed',
    x: 64,
    y: 28,
    status: 'IMMEDIATE',
    verified: true,
    skills: ['HEPA Steam Sterilization', 'Deep Extraction', 'Anti-Viral'],
  },
];

const LiveRadarScanner = () => {
  const [selectedPing, setSelectedPing] = useState(RADAR_PINGS[0]);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [liveWorkersTotal, setLiveWorkersTotal] = useState(142);
  const navigate = useNavigate();

  useEffect(() => {
    let animId;
    let angle = 0;
    const loop = () => {
      angle = (angle + 1.2) % 360;
      setSweepAngle(angle);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleSelectPing = (ping) => {
    setSelectedPing(ping);
    playBlip(1800);
  };

  const handleDispatch = (trade) => {
    playEngage();
    scrollToTop();
    navigate(`/browse?trade=${encodeURIComponent(trade)}`);
  };

  return (
    <section className="relative bg-[#FAF8F5] py-28 overflow-hidden border-b border-amber-200/60">
      {/* Background blueprint glow and subtle grid */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-amber-400/10 via-rose-500/5 to-orange-400/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold tracking-wider mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulseDot" />
            <span>GEO-RADAR DISPATCH TELEMETRY</span>
            <span className="text-amber-300">|</span>
            <span>LIVE SECTOR TRACKING</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
            Real-Time Proximity Radar.
            <br />
            <span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">
              Sub-15 Minute Arrival.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            Every verified trade specialist transmits active operational beacons. Click on any radar blip to inspect live distance, dispatch latency, and locked pricing.
          </p>
        </div>

        {/* Grid with Radar on Left and Selected Telemetry Card on Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: Radar Visualizer */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-full border border-amber-300/80 bg-gradient-to-b from-white to-amber-50/40 p-4 shadow-xl flex items-center justify-center overflow-hidden">
              {/* Concentric Radar Rings */}
              <div className="absolute inset-8 rounded-full border border-amber-200/70" />
              <div className="absolute inset-20 rounded-full border border-amber-200/70" />
              <div className="absolute inset-32 rounded-full border border-amber-200/70" />
              <div className="absolute inset-44 rounded-full border border-amber-200/60" />

              {/* Crosshair Axes */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-200/70" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-amber-200/70" />

              {/* Polar Degree Markings */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-800/60 font-bold">
                000° N
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-800/60 font-bold">
                180° S
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-amber-800/60 font-bold">
                270° W
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-amber-800/60 font-bold">
                090° E
              </div>

              {/* Rotating Radar Sweep Cone */}
              <div
                style={{
                  transform: `rotate(${sweepAngle}deg)`,
                  background:
                    'conic-gradient(from 0deg at 50% 50%, rgba(217, 119, 6, 0.22) 0deg, rgba(194, 65, 12, 0.1) 55deg, transparent 75deg)',
                }}
                className="absolute inset-0 rounded-full pointer-events-none origin-center"
              />

              {/* Center Radar Beacon */}
              <div className="relative z-20 w-4 h-4 rounded-full bg-[#D4AF37] shadow-md border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Active Radar Pings */}
              {RADAR_PINGS.map((ping) => {
                const isSelected = selectedPing.id === ping.id;
                return (
                  <button
                    key={ping.id}
                    onClick={() => handleSelectPing(ping)}
                    style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none"
                  >
                    {/* Ping Ripple */}
                    <span className="absolute inset-0 -m-2 rounded-full bg-[#C2410C]/20 animate-ping pointer-events-none" />

                    {/* Blip Core */}
                    <div
                      className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#C2410C] border-white scale-125 shadow-lg'
                          : 'bg-[#881337] border-white group-hover:scale-125 shadow-md'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>

                    {/* Tooltip Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-5 px-2 py-0.5 rounded bg-white/95 border border-amber-200 text-[10px] font-mono text-stone-800 whitespace-nowrap pointer-events-none shadow-md">
                      {ping.name.split(' ')[0]} · {ping.eta}
                    </div>
                  </button>
                );
              })}

              {/* Bottom Radar Status HUD */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[10px] font-mono text-stone-600 bg-white/95 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm backdrop-blur-md">
                <span>SWEEP: 360° // FREQ: 2.4 GHz</span>
                <span className="text-[#881337] font-bold">5 BEACONS ACQUIRED</span>
              </div>
            </div>
          </div>

          {/* Right: Selected Specialist Telemetry Card */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPing.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl bg-white border border-amber-200/80 p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-xl"
              >
                {/* Top Corner Badge */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulseDot" />
                    <span>{selectedPing.status}</span>
                  </div>

                  <div className="text-xs font-mono text-stone-500">
                    {selectedPing.sector}
                  </div>
                </div>

                {/* Worker Avatar & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#881337] via-[#C2410C] to-[#D4AF37] text-white font-display font-extrabold text-2xl flex items-center justify-center shadow-md shadow-amber-600/20 flex-shrink-0">
                    {selectedPing.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-2xl text-stone-900">
                        {selectedPing.name}
                      </h3>
                      {selectedPing.verified && (
                        <span className="p-1 rounded-full bg-amber-50 text-[#881337] text-sm border border-amber-200" title="Verified Specialist">
                          <HiOutlineShieldCheck />
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#C2410C] mt-0.5">
                      {selectedPing.trade}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-stone-500">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <HiOutlineStar className="fill-amber-400 text-amber-500" />
                        {selectedPing.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#881337] font-bold">
                        <HiOutlineClock />
                        {selectedPing.eta} ETA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Metrics Box */}
                <div className="mt-6 grid grid-cols-2 gap-3 p-4 rounded-xl bg-amber-50/40 border border-amber-200/60 font-mono text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px]">RADIAL DISTANCE</span>
                    <span className="text-stone-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                      <HiOutlineLocationMarker className="text-[#C2410C]" />
                      {selectedPing.distance}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">LOCKED TARIFF</span>
                    <span className="text-[#881337] font-bold text-sm block mt-0.5">
                      {selectedPing.rate}
                    </span>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-5">
                  <span className="text-[10px] font-mono text-amber-800/70 uppercase tracking-wider block mb-2 font-semibold">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPing.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-50/50 text-stone-700 border border-amber-200/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dispatch Call to Action */}
                <div className="mt-8 pt-6 border-t border-amber-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDispatch(selectedPing.trade.split(' ')[0])}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-display font-extrabold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Instant Dispatch Unit</span>
                    <HiArrowRight className="text-base" />
                  </button>

                  <a
                    href="tel:+8801717408075"
                    className="py-3.5 px-4 rounded-xl bg-amber-50/60 hover:bg-amber-100/90 text-stone-800 border border-amber-200/80 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    title="Direct Support Hotline"
                  >
                    <HiOutlinePhone className="text-sm text-[#C2410C]" />
                    <span>Call Hotline</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveRadarScanner;
