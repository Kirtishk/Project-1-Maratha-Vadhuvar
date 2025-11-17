import React from "react";
import { Heart, Instagram, Facebook, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#FFD6A5] via-[#FFC085] to-[#FFB66D] text-gray-900 py-16 relative overflow-hidden">
      {/* Soft Glow Circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <Heart className="w-12 h-12 text-amber-400 animate-pulse" />
          <h2 className="text-2xl font-bold">Maratha Vadhuvar</h2>
          <p className="text-gray-800 text-sm md:max-w-xs">
            Bringing love and meaningful connections together since 2014
          </p>
          <p className="text-gray-600 text-xs mt-2">
            &copy; {new Date().getFullYear()} RaniMaa Softwares. All rights reserved.
          </p>
        </div>

        {/* Middle Section - Contact */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <h3 className="font-semibold text-amber-500 text-lg">Contact Us</h3>
          <div className="flex items-center gap-2 text-gray-800">
            <Mail className="w-4 h-4 text-amber-400" /> krishna.k@ranimaasoftwares.co.in
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Phone className="w-4 h-4 text-amber-400" /> +91 920 9999 750
          </div>
        </div>

        {/* Right Section - Social Links */}
        {/* <div className="flex gap-6">
          <a
            href="#"
            className="p-3 bg-white/30 rounded-full hover:bg-white/50 transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-gray-900" />
          </a>
          <a
            href="#"
            className="p-3 bg-white/30 rounded-full hover:bg-white/50 transition-all"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 text-gray-900" />
          </a>
          <a
            href="#"
            className="p-3 bg-white/30 rounded-full hover:bg-white/50 transition-all"
            aria-label="Heart"
          >
            <Heart className="w-5 h-5 text-amber-400" />
          </a>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/30 pt-6 text-center text-gray-700 text-sm">
        Made with ❤️ by Maratha Vadhuvar Team
      </div>
    </footer>
  );
};

export default Footer;
