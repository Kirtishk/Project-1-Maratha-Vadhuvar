import React from "react";
import { motion } from "framer-motion";
import { Heart, User, Star, Globe } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const team = [
  { name: "Aisha Khan", role: "Founder & CEO" },
  { name: "Rohan Mehta", role: "Co-Founder & CTO" },
  { name: "Meera Sharma", role: "Community Manager" },
];

const values = [
  { title: "Trust", icon: <Heart className="w-6 h-6 text-amber-400" /> },
  { title: "Transparency", icon: <Globe className="w-6 h-6 text-amber-400" /> },
  { title: "Love", icon: <Star className="w-6 h-6 text-amber-400" /> },
];

const AboutUsPage = () => {
  return (
    <>
    <Navbar/>
    <section className="relative w-full text-gray-900">
      {/* ===== Hero Section ===== */}
      <div className="relative pt-50 bg-gradient-to-r from-[#FFD6A5] via-[#FFC085] to-[#FFB66D] py-50">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold"
          >
            About Maratha Vadhuvar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-800"
          >
            Bringing hearts together with trust, warmth, and meaningful connections.
          </motion.p>
        </div>
      </div>

      {/* ===== Mission & Vision ===== */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-amber-500 mb-4">Our Mission</h2>
          <p className="text-gray-800 leading-relaxed">
            To create a safe, welcoming, and effective platform where individuals can find meaningful relationships that last a lifetime.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-amber-500 mb-4">Our Vision</h2>
          <p className="text-gray-800 leading-relaxed">
            To become the most trusted matrimonial platform in India, known for integrity, love, and connection.
          </p>
        </motion.div>
      </div>

      {/* ===== Our Story / History ===== */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-amber-500"
          >
            Our Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-800 max-w-3xl mx-auto leading-relaxed"
          >
            Maratha Vadhuvar started as a small team of passionate individuals who wanted to help people find meaningful connections. Over the years, we’ve grown into a trusted platform that prioritizes safety, transparency, and love. Every successful match motivates us to continue our journey.
          </motion.p>
        </div>
      </div>

      {/* ===== Values ===== */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-amber-500 mb-12"
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
              className="flex flex-col items-center space-y-4 bg-white/30 rounded-2xl p-8 backdrop-blur-sm shadow-lg"
            >
              {val.icon}
              <h3 className="text-xl font-semibold">{val.title}</h3>
              <p className="text-gray-800 text-center">
                {val.title} is at the heart of everything we do.
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== Meet the Team ===== */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-amber-500"
          >
            Meet Our Team
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                className="flex flex-col items-center bg-white/30 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform"
              >
                <User className="w-12 h-12 text-amber-400 mb-3" />
                <p className="font-semibold">{member.name}</p>
                <p className="text-gray-800 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Testimonials / Success Stories ===== */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-amber-500"
        >
          Success Stories
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
          >
            <p className="text-gray-800">
              "Maratha Vadhuvar helped me find my soulmate. Everything was safe and smooth!" – Priya S.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
          >
            <p className="text-gray-800">
              "Thanks to Maratha Vadhuvar, I met someone special. Highly recommend it!" – Raj K.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg"
          >
            <p className="text-gray-800">
              "The platform is trustworthy and user-friendly. Found my partner here!" – Anjali M.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default AboutUsPage;
