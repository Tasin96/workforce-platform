import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { playBlip } from '../utils/cyberAudio';

const stats = [
  { value: 99.8, suffix: '%', label: 'Platform Availability SLA', desc: 'Continuous uptime & sub-second API latency', color: 'text-[#881337]' },
  { value: 14, suffix: ' min', label: 'Average Radial Dispatch', desc: 'Autonomous sector triangulation speed', color: 'text-[#C2410C]' },
  { value: 12500, suffix: '+', label: 'Completed Neural Tickets', desc: 'Homes, corporate headquarters & facilities', color: 'text-[#D97706]' },
  { value: 99.4, suffix: '%', label: 'Verified Satisfaction Index', desc: 'Zero unarbitrated customer disputes', color: 'text-[#B45309]' },
];

const Counter = ({ value, suffix, color }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const cur = progress * value;
      setDisplay(value % 1 !== 0 ? Math.round(cur * 10) / 10 : Math.floor(cur));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className={`font-display font-extrabold text-4xl sm:text-5xl ${color}`}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatsSection = () => (
  <section className="bg-white border-y border-amber-200/80 py-20 relative overflow-hidden">
    {/* Subtle grid and scanning beam */}
    <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            onMouseEnter={() => playBlip(1300 + i * 100)}
            className="text-left p-6 rounded-2xl bg-[#FAF8F5] border border-amber-200/70 hover:border-amber-400 hover:shadow-xl transition-all duration-300 backdrop-blur-md group shadow-xs"
          >
            <div className="text-[10px] font-mono text-amber-800/60 mb-2 flex items-center justify-between">
              <span>METRIC // 0{i + 1}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] group-hover:scale-125 transition-transform" />
            </div>
            <Counter value={s.value} suffix={s.suffix} color={s.color} />
            <h4 className="mt-3 text-sm font-bold text-stone-900 group-hover:text-[#881337] transition-colors">
              {s.label}
            </h4>
            <p className="mt-1 text-xs text-stone-500 leading-relaxed font-mono">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
