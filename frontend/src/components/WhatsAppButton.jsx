import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/qr/HFFRHGPGCI6PL1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Tasin Islam on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <FaWhatsapp className="text-2xl" />
      <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
        Chat with Tasin
      </span>
    </a>
  );
};

export default WhatsAppButton;
