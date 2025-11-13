import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { img2 } from "../assets";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Male", path: "/male" },
    { name: "Female", path: "/female" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1a1a1a]/80 to-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white font-bold text-2xl tracking-wide hover:scale-105 transition-transform duration-300"
        >
          {/* ✅ Replace Heart icon with your logo image */}
          <img
            src={img2   } // 👉 Replace with your actual logo path (e.g., /assets/logo.png)
            alt="Maratha Vadhuvar Logo"
            className="w-10 h-10 rounded-full shadow-lg object-cover border border-orange-400"
          />
          <span>
            Maratha <span className="text-orange-400">Vadhuvar</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className="relative text-white/90 hover:text-orange-400 font-medium transition-all duration-300 group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 rounded-lg text-white font-semibold hover:shadow-[0_0_15px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 rounded-lg text-white font-semibold hover:shadow-[0_0_15px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white focus:outline-none"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-[#1a1a1a]/95 to-[#0f0f0f]/95 backdrop-blur-md border-t border-white/10 transition-all duration-500 ease-in-out ${
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-5"
        }`}
      >
        <div className="flex flex-col items-center gap-6 py-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setOpen(false)}
              className="text-white text-lg font-medium hover:text-orange-400 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 rounded-xl text-white font-semibold hover:shadow-[0_0_15px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 rounded-xl text-white font-semibold hover:shadow-[0_0_15px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
