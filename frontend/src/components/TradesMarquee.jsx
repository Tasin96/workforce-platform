import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { GiHammerNails, GiWaterDrop, GiPaintRoller, GiPlantWatering, GiBroom } from 'react-icons/gi';
import { scrollToTop } from './ScrollToTop';
import { playBlip } from '../utils/cyberAudio';

const trades = [
  { name: 'Electrician', icon: HiOutlineLightningBolt, tag: 'High-Voltage & Panels', count: '42 units', color: 'text-[#D97706]', border: 'border-amber-300' },
  { name: 'Plumber', icon: GiWaterDrop, tag: 'Acoustic Sonar & Piping', count: '58 units', color: 'text-[#C2410C]', border: 'border-orange-300' },
  { name: 'Painter', icon: GiPaintRoller, tag: 'Nanotech Surface Coatings', count: '28 units', color: 'text-[#881337]', border: 'border-rose-300' },
  { name: 'Carpenter', icon: GiHammerNails, tag: 'Precision CNC & Timber', count: '35 units', color: 'text-[#B45309]', border: 'border-amber-300' },
  { name: 'Gardener', icon: GiPlantWatering, tag: 'Hydroponics & Flora', count: '19 units', color: 'text-emerald-700', border: 'border-emerald-300' },
  { name: 'Cleaner', icon: GiBroom, tag: 'Hospital HEPA Sterilization', count: '64 units', color: 'text-[#EA580C]', border: 'border-orange-300' },
];

const TradesMarquee = () => {
  return (
    <section className="bg-white border-y border-amber-200/80 py-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulseDot" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800/80">
            ACTIVE TELEMETRY SECTORS &amp; TRADE UNITS
          </h3>
        </div>
        <Link
          to="/browse"
          onClick={() => scrollToTop()}
          className="text-xs font-mono font-bold text-[#881337] hover:text-[#C2410C] transition-colors flex items-center gap-1"
        >
          <span>VIEW ALL UNITS</span>
          <span>→</span>
        </Link>
      </div>

      <div className="flex w-max animate-marquee">
        {[...trades, ...trades, ...trades].map((t, index) => (
          <Link
            key={`${t.name}-${index}`}
            to={`/browse?trade=${encodeURIComponent(t.name)}`}
            onClick={() => scrollToTop()}
            onMouseEnter={() => playBlip(1300)}
            className="flex items-center gap-3 px-5 py-2.5 mx-2 rounded-xl bg-[#FAF8F5] border border-amber-200/70 hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-200 shrink-0 group shadow-xs"
          >
            <div className={`w-8 h-8 rounded-lg bg-white border ${t.border} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
              <t.icon className={`text-lg ${t.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xs text-stone-800 group-hover:text-[#881337] transition-colors">
                  {t.name}
                </span>
                <span className="text-[10px] font-mono text-[#9A3412] font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {t.count}
                </span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">{t.tag}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TradesMarquee;
