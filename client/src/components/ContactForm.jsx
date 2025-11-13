import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Heart,
  User,
  MessageCircle,
} from "lucide-react";
import ContactHero from "./ContactHero";

const Contact = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ffb26b] via-[#ff9966] to-[#ff7b54] text-white overflow-hidden">
      {/* Background & Overlays */}
	  <ContactHero/>
      <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1729040401790-d9a6de88feeb?q=80&w=1159&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-20 brightness-75"></div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* 💌 Contact Info + Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2">
              <Heart className="text-amber-300 w-7 h-7 fill-amber-300" />
              <h1 className="text-4xl font-bold tracking-tight drop-shadow-md">
                Get in Touch
              </h1>
            </div>

            <p className="text-white/90 leading-relaxed text-lg">
              We’d love to hear from you — whether it’s a question, feedback, or
              just to say hello 💌  
              Let’s make your journey of love smooth, beautiful, and safe.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Mail className="text-amber-300" />
                <p className="text-white/90">support@marriagecode.in</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-amber-300" />
                <p className="text-white/90">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-amber-300" />
                <p className="text-white/90">Mumbai, India</p>
              </div>
            </div>

            {/* Social Icons
            <div className="flex gap-6 pt-4">
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div> */}
          </motion.div>

          {/* Right Side: Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 p-8 rounded-3xl shadow-lg backdrop-blur-md space-y-6"
          >
            <h2 className="text-2xl font-semibold text-amber-100 mb-2">
              Send us a Message
            </h2>

            <div>
              <label className="block text-sm mb-1 text-amber-100">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-amber-100">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-amber-100">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-300 to-orange-300 text-orange-900 font-semibold hover:scale-[1.03] hover:shadow-xl transition-all"
            >
              Send Message
            </button>
          </motion.form>
        </div>


        {/* 🗺️ Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl overflow-hidden shadow-xl border border-white/10"
        >
          <iframe
            title="Martaha Vadhuvar Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160980308!2d72.74109972707407!3d19.08219783955737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63a6a8bcdcd%3A0x6e98e6a5c4a7e8!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1696420000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
