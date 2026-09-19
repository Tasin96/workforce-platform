import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineLocationMarker,
  HiArrowRight,
} from 'react-icons/hi';
import { playBlip, playEngage, playSuccess, playClick } from '../../utils/cyberAudio';
import { scrollToTop } from '../ScrollToTop';

const SIM_STAGES = [
  {
    step: 1,
    title: 'SPATIAL TRIANGULATION',
    desc: 'Scanning Sector 01-08 for idle specialists within a 3.0 km geodesic radius...',
    metric: '4 UNITS LOCATED',
  },
  {
    step: 2,
    title: 'ESCROW LIQUIDITY LOCK',
    desc: 'Pre-authorizing secure smart transaction contract in BDT with zero dispute liability...',
    metric: 'ESCROW KEY: 0x9F42...E7B1',
  },
  {
    step: 3,
    title: 'NEURAL SLA VERIFICATION',
    desc: 'Verifying National ID, insurance badge, and 4.8+ customer satisfaction benchmark...',
    metric: 'VERIFIED 100% VALID',
  },
  {
    step: 4,
    title: 'UNIT MOBILIZED EN ROUTE',
    desc: 'Senior Specialist assigned. Real-time GPS beacon locked. Dispatched to customer coordinates.',
    metric: 'ARRIVAL IN: 14 MINS',
  },
];

const QuantumDispatchSimulator = () => {
  const [selectedTrade, setSelectedTrade] = useState('Electrician');
  const [tier, setTier] = useState('urgent');
  const [stage, setStage] = useState(0); // 0 = idle, 1..4 = active stages, 5 = completed
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (stage === 0) return;
    if (stage <= 4) {
      const timer = setTimeout(() => {
        playBlip(1200 + stage * 200);
        setProgress((stage / 4) * 100);
        if (stage < 4) {
          setStage((prev) => prev + 1);
        } else {
          setStage(5);
          playSuccess();
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleStartSimulation = () => {
    playEngage();
    setStage(1);
    setProgress(25);
    setTxHash(`WF-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  };

  const handleReset = () => {
    playClick();
    setStage(0);
    setProgress(0);
  };

  const handleProceedToBooking = () => {
    playEngage();
    scrollToTop();
    navigate(`/browse?trade=${encodeURIComponent(selectedTrade)}`);
  };

  return (
    <section className="relative bg-[#FAF8F5] py-28 overflow-hidden border-b border-amber-200/60">
      {/* Blueprint radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-br from-amber-400/10 via-rose-500/5 to-orange-400/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
            <span>INTERACTIVE SIMULATOR</span>
            <span className="text-amber-300">|</span>
            <span>2026 DISPATCH PROTOCOL</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
            Experience Autonomous Dispatch.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            Test the 2026 neural dispatch pipeline in real-time. Watch how our geocoding, escrow smart locking, and SLA verification execute in seconds.
          </p>
        </div>

        {/* Simulator Glass Console */}
        <div className="rounded-3xl bg-white border border-amber-200/90 shadow-xl p-6 sm:p-10 backdrop-blur-2xl">
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-100 font-mono text-xs text-stone-500">
            <div className="flex items-center gap-2 text-[#881337]">
              <HiOutlineCube className="text-lg text-[#C2410C]" />
              <span className="font-bold">SYSTEM PROTOCOL: NEURAL-DISPATCH-V4</span>
            </div>
            <div className="flex items-center gap-4">
              <span>STATUS: {stage === 0 ? 'READY' : stage === 5 ? 'COMPLETED' : 'PROCESSING'}</span>
              {txHash && <span className="text-[#881337] font-bold">SESSION: {txHash}</span>}
            </div>
          </div>

          {/* Idle / Configuration View */}
          {stage === 0 ? (
            <div className="mt-8 grid md:grid-cols-12 gap-8 items-center">
              {/* Left Config Controls */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-amber-800/80 uppercase mb-2">
                    Target Trade Service
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Electrician', 'Plumber', 'Painter', 'Carpenter', 'Gardener', 'Cleaner'].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setSelectedTrade(t);
                          playClick();
                        }}
                        className={`p-3 rounded-xl text-xs font-display font-bold border transition-all ${
                          selectedTrade === t
                            ? 'bg-gradient-to-r from-[#881337] to-[#C2410C] text-white border-transparent shadow-md shadow-amber-600/20'
                            : 'bg-white border-amber-200/70 text-stone-700 hover:bg-amber-50/50 hover:border-amber-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-amber-800/80 uppercase mb-2">
                    Dispatch Speed SLA
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setTier('urgent');
                        playClick();
                      }}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        tier === 'urgent'
                          ? 'bg-amber-50/80 border-[#C2410C] text-[#881337] shadow-sm'
                          : 'bg-white border-amber-200/70 text-stone-700 hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#881337]">Priority Rapid (Sub-15m)</div>
                      <div className="text-[11px] font-mono text-stone-500 mt-1">Autonomous instant geolock</div>
                    </button>

                    <button
                      onClick={() => {
                        setTier('scheduled');
                        playClick();
                      }}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        tier === 'scheduled'
                          ? 'bg-amber-50/80 border-[#C2410C] text-[#881337] shadow-sm'
                          : 'bg-white border-amber-200/70 text-stone-700 hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="font-bold text-sm text-[#881337]">Scheduled Precision Slot</div>
                      <div className="text-[11px] font-mono text-stone-500 mt-1">Reserved specialist booking</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleStartSimulation}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-display font-extrabold text-base shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <HiOutlineLightningBolt className="text-xl group-hover:scale-110 transition-transform" />
                  <span>INITIALIZE NEURAL DISPATCH</span>
                </button>
              </div>

              {/* Right Diagnostic Pod */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-amber-50/30 border border-amber-200/80 font-mono text-xs shadow-sm">
                <div className="text-[#881337] font-bold mb-4 flex items-center justify-between">
                  <span>DISPATCH PRE-FLIGHT CHECK</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% READY</span>
                </div>
                <div className="space-y-3 text-stone-600">
                  <div className="flex justify-between py-1.5 border-b border-amber-100">
                    <span>GPS Sector</span>
                    <span className="text-stone-900 font-semibold">DHAKA CENTRAL (SECTOR 01)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-amber-100">
                    <span>Avg Response Time</span>
                    <span className="text-emerald-700 font-bold">14.2 Minutes</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-amber-100">
                    <span>Active Qualified Units</span>
                    <span className="text-[#C2410C] font-bold">38 Online</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-amber-100">
                    <span>Arbitration Escrow</span>
                    <span className="text-stone-900 font-semibold">PostgreSQL 18 Audited</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Direct Founder Support</span>
                    <span className="text-[#881337] font-bold">+8801717408075</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Simulation Running or Completed View */
            <div className="mt-8 space-y-8">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#881337] font-bold">DISPATCH PIPELINE EXECUTION</span>
                  <span className="text-stone-500 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-amber-100 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D4AF37] rounded-full transition-all duration-700 shadow-sm"
                  />
                </div>
              </div>

              {/* Steps Progress List */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SIM_STAGES.map((s) => {
                  const isDone = stage > s.step || stage === 5;
                  const isCurrent = stage === s.step;

                  return (
                    <div
                      key={s.step}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-50/90 border-[#C2410C] shadow-md scale-102'
                          : isDone
                          ? 'bg-emerald-50/60 border-emerald-300 text-stone-800'
                          : 'bg-white border-amber-200/60 text-stone-400 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold text-stone-500">0{s.step}</span>
                        {isDone ? (
                          <HiOutlineCheckCircle className="text-emerald-600 text-lg" />
                        ) : isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C] animate-pulseDot" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-stone-300" />
                        )}
                      </div>

                      <h4 className="font-display font-bold text-sm text-stone-900 mb-1.5">{s.title}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed mb-3">{s.desc}</p>
                      <div className="text-[10px] font-mono text-[#881337] font-bold bg-white px-2 py-1 rounded border border-amber-200 shadow-xs">
                        {s.metric}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completed Success Action Card */}
              {stage === 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#881337] to-[#C2410C] text-white flex items-center justify-center text-3xl font-extrabold shadow-md flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-stone-900">
                        Specialist Dispatched Successfully!
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        Senior {selectedTrade} unit en-route to your designated sector. Estimated arrival within 14 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs font-bold transition-colors flex items-center gap-1.5 border border-stone-200"
                    >
                      <HiOutlineRefresh />
                      <span>Simulate Another</span>
                    </button>

                    <button
                      onClick={handleProceedToBooking}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] hover:from-[#70102d] hover:via-[#a83508] hover:to-[#b45309] text-white font-display font-extrabold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
                    >
                      <span>Book Real Specialist</span>
                      <HiArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuantumDispatchSimulator;
