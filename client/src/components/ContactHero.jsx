import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const ContactHero = () => {
  return (
    <section className="relative w-full py-40 pt-40 bg-gradient-to-br from-[#ffb26b]/80 via-[#ff9966]/70 to-[#ff7b54]/80 text-white overflow-hidden">
      {/* Soft Background Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-center gap-2 text-sm sm:text-base uppercase tracking-wide font-medium text-amber-200 mx-auto"
        >
          <Heart className="w-5 h-5 fill-amber-300" />
          <span>We’d Love to Hear From You</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
        >
          Contact Maratha Vadhuvar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto"
        >
          Have a question, feedback, or suggestion? Reach out to our team and
          we’ll get back to you with love and care 💌
        </motion.p>
      </div>
    </section>
  );
};

export default ContactHero;
