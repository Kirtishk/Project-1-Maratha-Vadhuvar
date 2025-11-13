import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Briefcase, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", path: "/home" },
    { icon: <User size={20} />, label: "Users", path: "/users" },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false); // close sidebar on mobile
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-rose-50 to-orange-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-80 md:w-80 bg-gradient-to-b from-orange-100 via-pink-100 to-rose-100 text-slate-900 p-6 z-50 transform transition-transform duration-300 ease-in-out shadow-xl rounded-r-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <h1 className="text-3xl font-bold mb-8 text-rose-600 tracking-wide">
          Maratha Vaduvar
        </h1>

        {/* Menu Items */}
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-rose-300 shadow-inner scale-105"
                    : "hover:bg-rose-200 hover:shadow-md"
                }`}
              >
                {item.icon}
                <span className="font-semibold text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-r from-orange-200 via-pink-200 to-rose-200 text-slate-900 shadow-md z-50">
        <h1 className="text-xl font-bold tracking-wide">Maratha Vaduvar</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
