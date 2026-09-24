import React from 'react';
import Hero from '../components/Hero';
import TradesMarquee from '../components/TradesMarquee';
import HoloServicesMatrix from '../components/futuristic/HoloServicesMatrix';
import LiveRadarScanner from '../components/futuristic/LiveRadarScanner';
import QuantumDispatchSimulator from '../components/futuristic/QuantumDispatchSimulator';
import ProblemSection from '../components/ProblemSection';
import HowItWorks from '../components/HowItWorks';
import FeaturesSection from '../components/FeaturesSection';
import StatsSection from '../components/StatsSection';
import BenefitsSection from '../components/BenefitsSection';
import CTASection from '../components/CTASection';

const Home = () => (
  <div className="bg-[#FAF8F5] min-h-screen text-stone-900 overflow-x-hidden selection:bg-[#881337] selection:text-[#FEF3C7]">
    {/* Cinematic 3D Hero */}
    <Hero />

    {/* Live Sector Trades Marquee */}
    <TradesMarquee />

    {/* 3D Holo Services Matrix with Perspective Tilt */}
    <HoloServicesMatrix />

    {/* Real-time Tactical 360° Proximity Radar */}
    <LiveRadarScanner />

    {/* Interactive 4-Stage Autonomous Dispatch Simulator */}
    <QuantumDispatchSimulator />

    {/* Workforce Standard */}
    <ProblemSection />

    {/* How Dispatch Operates */}
    <HowItWorks />

    {/* Enterprise Platform Capabilities */}
    <FeaturesSection />

    {/* Live Telemetry SLA Metrics */}
    <StatsSection />

    {/* Proven Value Equation */}
    <BenefitsSection />

    {/* Cinematic Portal CTA */}
    <CTASection />
  </div>
);

export default Home;
