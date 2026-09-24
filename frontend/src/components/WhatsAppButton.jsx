import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/qr/HFFRHGPGCI6PL1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Tasin Islam on WhatsApp"
      title="Chat with Tasin on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:ring-offset-2"
    >
      {/* Live Online Ping Badge */}
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-[#25D366]" />
      </span>

      <FaWhatsapp className="text-2xl" />

      {/* Floating Tooltip on Hover */}
      <span className="absolute right-14 whitespace-nowrap bg-stone-900/90 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-stone-700">
        Chat with Tasin
      </span>
    </a>
  );
};

export default WhatsAppButton;
