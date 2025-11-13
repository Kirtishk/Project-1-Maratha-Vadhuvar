import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const images = [
  "https://images.unsplash.com/photo-1668432747162-5e7ded79e498?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1634992449982-2ca553fa118a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1741201866259-ed9a36c6a1f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 w-full flex items-center justify-center bg-gradient-to-br from-[#ffb26b] via-[#ff9966] to-[#ff7b54] overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1668432747162-5e7ded79e498?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-20 brightness-75"></div>

      {/* Dim overlay for mood */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 backdrop-blur-[1px]"></div>

      {/* Warm Glow */}
      <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] bg-gradient-radial from-amber-300/15 via-orange-200/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-start items-center gap-2 text-sm sm:text-base uppercase tracking-wider font-medium text-amber-200"
          >
            <Heart className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>Welcome to Maratha Vadhuvar</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-amber-50 drop-shadow-md"
          >
            Discover <span className="text-amber-300">Real Connections</span>{" "}
            That Last Forever
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/85 leading-relaxed max-w-lg mx-auto md:mx-0"
          >
            A cozy space where traditions meet technology. Begin your beautiful
            journey of love with warmth, trust, and heartfelt chemistry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-300 to-orange-200 text-orange-800 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300"
            >
              Know more about us <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Right Image Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className={`rounded-3xl overflow-hidden shadow-xl border border-white/10 ${
                i % 2 === 0 ? "mt-6" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.7 }}
              whileHover={{ scale: 1.04 }}
            >
              <img
                src={img}
                alt={`Profile ${i + 1}`}
                className={`w-full h-48 object-cover md:h-56 lg:h-64 brightness-90 hover:brightness-100 transition-all duration-300 ${
                i % 2 === 0 ? "-mt-7" : "-mt-1"
              }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
