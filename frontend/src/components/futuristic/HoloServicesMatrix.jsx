import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineColorSwatch,
  HiOutlineCubeTransparent,
  HiOutlineShieldCheck,
  HiOutlineFire,
  HiArrowRight,
  HiOutlineStar,
} from 'react-icons/hi';
import { playBlip, playEngage } from '../../utils/cyberAudio';
import { scrollToTop } from '../ScrollToTop';

const services = [
  {
    id: 'electrician',
    name: 'Electrical Engineering',
    tradeKey: 'Electrician',
    category: 'POWER & GRID',
    rate: '৳350/hr',
    activeCount: 42,
    rating: '4.92',
    icon: HiOutlineLightningBolt,
    accent: '#D97706',
    accentLight: '#FEF3C7',
    accentBorder: 'rgba(217, 119, 6, 0.35)',
    description: 'High-voltage circuitry, sub-panel upgrades, digital regulators, short-circuit diagnostics.',
    tags: ['Certified Wireman', 'Thermal Scan', 'Escrow Insured'],
  },
  {
    id: 'plumber',
    name: 'Master Hydraulic Plumbing',
    tradeKey: 'Plumber',
    category: 'FLUID DYNAMICS',
    rate: '৳300/hr',
    activeCount: 58,
    rating: '4.88',
    icon: HiOutlineFire,
    accent: '#C2410C',
    accentLight: '#FFEDD5',
    accentBorder: 'rgba(194, 65, 12, 0.35)',
    description: 'Ultrasonic acoustic leak detection, pressure manifolds, sump pumps, precision fitting.',
    tags: ['Acoustic Sensor', 'Copper/PEX', 'Instant Dispatch'],
  },
  {
    id: 'painter',
    name: 'Architectural Surface Coating',
    tradeKey: 'Painter',
    category: 'MATERIALS & FINISH',
    rate: '৳4,500 fixed',
    activeCount: 28,
    rating: '4.95',
    icon: HiOutlineColorSwatch,
    accent: '#881337',
    accentLight: '#FFE4E6',
    accentBorder: 'rgba(136, 19, 55, 0.35)',
    description: 'Nanotech weatherproofing, luxury textured walls, interior anti-microbial coatings.',
    tags: ['Colorimetry Match', 'Non-Toxic', '5-Yr Seal'],
  },
  {
    id: 'carpenter',
    name: 'Precision Structural Carpentry',
    tradeKey: 'Carpenter',
    category: 'TIMBER & FABRICATION',
    rate: '৳400/hr',
    activeCount: 35,
    rating: '4.85',
    icon: HiOutlineCubeTransparent,
    accent: '#B45309',
    accentLight: '#FFFBEB',
    accentBorder: 'rgba(180, 83, 9, 0.35)',
    description: 'Laser-leveled cabinetry, acoustic panelling, modular fittings, antique restoration.',
    tags: ['CNC Precision', 'Hardwood Guild', 'Fixed Rate'],
  },
  {
    id: 'gardener',
    name: 'Botanical & Hydroponic Grounds',
    tradeKey: 'Gardener',
    category: 'ECOLOGICAL DESIGN',
    rate: '৳1,500 fixed',
    activeCount: 19,
    rating: '4.89',
    icon: HiOutlineSparkles,
    accent: '#059669',
    accentLight: '#ECFDF5',
    accentBorder: 'rgba(5, 150, 105, 0.35)',
    description: 'Automated drip irrigation, vertical rooftop landscaping, exotic arbor care.',
    tags: ['Soil Analysis', 'Bio-Protection', 'Seasonal SLA'],
  },
  {
    id: 'cleaner',
    name: 'Advanced Cleanroom Sanitization',
    tradeKey: 'Cleaner',
    category: 'BIO-HYGIENE',
    rate: '৳1,200 fixed',
    activeCount: 64,
    rating: '4.94',
    icon: HiOutlineShieldCheck,
    accent: '#EA580C',
    accentLight: '#FFF7ED',
    accentBorder: 'rgba(234, 88, 12, 0.35)',
    description: 'Hospital-grade HEPA extraction, deep upholstery steam sanitization, non-abrasive care.',
    tags: ['HEPA Filtered', 'Anti-Viral', 'Rapid Squad'],
  },
];

const HoloCard = ({ item, onSelect }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({
      x: rotateX,
      y: rotateY,
      sheenX: (x / rect.width) * 100,
      sheenY: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    playBlip(1500);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  };

  return (
    <div
      className="perspective-1000 h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(15px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out',
          borderColor: hovered ? item.accent : 'rgba(251, 191, 36, 0.4)',
        }}
        className="relative h-full rounded-2xl bg-white border border-amber-200/80 p-6 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-card hover:shadow-ticket backdrop-blur-xl"
        onClick={() => onSelect(item.tradeKey)}
      >
        {/* Dynamic Sheen Glare */}
        {hovered && (
          <div
            style={{
              background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(212, 175, 55, 0.1) 0%, transparent 60%)`,
            }}
            className="absolute inset-0 pointer-events-none z-10"
          />
        )}

        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div
              style={{
                backgroundColor: item.accentLight,
                borderColor: item.accentBorder,
                color: item.accent,
              }}
              className="w-12 h-12 rounded-xl border flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 shadow-xs"
            >
              <item.icon />
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulseDot" />
                <span>{item.activeCount} LIVE</span>
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-amber-800/70 uppercase font-bold mb-1">
            // {item.category}
          </div>

          <h3 className="font-display font-bold text-xl text-stone-900 group-hover:text-[#881337] transition-colors">
            {item.name}
          </h3>

          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            {item.description}
          </p>

          {/* Skill Tag Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50/40 text-stone-700 border border-amber-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Card Metrics & Dispatch Trigger */}
        <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-stone-400 uppercase">Tariff Rate</div>
            <div className="font-mono font-bold text-sm text-[#881337]">{item.rate}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono text-amber-500">
              <HiOutlineStar className="fill-amber-400 text-sm" />
              <span className="font-bold text-stone-800">{item.rating}</span>
            </div>

            <div
              style={{ backgroundColor: item.accentLight, color: item.accent }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shadow-xs"
            >
              <HiArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HoloServicesMatrix = () => {
  const navigate = useNavigate();

  const handleSelect = (trade) => {
    playEngage();
    scrollToTop();
    navigate(`/browse?trade=${encodeURIComponent(trade)}`);
  };

  return (
    <section className="relative bg-[#FAF8F5] py-24 overflow-hidden border-b border-amber-200/60">
      {/* Background ambient mesh */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-br from-amber-400/10 via-rose-500/5 to-orange-400/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-amber-300/10 via-orange-400/5 to-rose-400/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-amber-300/80 text-[#9A3412] text-xs font-mono font-bold tracking-wider mb-3 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulseDot" />
              <span>AUTONOMOUS WORKFORCE MATRIX</span>
              <span className="text-amber-300">|</span>
              <span className="text-[#881337] font-semibold">2026 ARCHITECTURE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-stone-900 tracking-tight leading-tight">
              Six Specialized Neural Grids.
              <br />
              <span className="bg-gradient-to-r from-[#881337] via-[#C2410C] to-[#D97706] bg-clip-text text-transparent">
                Instantly Mobilized.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-stone-600 leading-relaxed">
            Select an operational trade to inspect certified diagnostic units, locked hourly tariffs, and cryptographic escrow guarantees.
          </p>
        </div>

        {/* 3D Holo Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <HoloCard key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HoloServicesMatrix;
