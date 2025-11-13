import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firbase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Hourglass, Heart } from "lucide-react";

const backgrounds = [
  "https://images.unsplash.com/photo-1574017144578-85168ddb5040?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550575904-40938d5a4fca?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1645856052484-2e5506e20942?q=80&w=1170&auto=format&fit=crop",
];

const Pending = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);

useEffect(() => {
  if (!currentUser) return;

  const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
    if (!docSnap.exists()) return;
    const data = docSnap.data();

    const status = data.payment?.status;
    if (status === "approved") navigate("/dashboard", { replace: true });
    else if (status === "rejected") navigate("/payment", { replace: true });
  });

  return () => unsub();
}, [currentUser, navigate]);

  // Background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000); // change image every 6 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 ">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {backgrounds.map((url, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50"></div> {/* Dark overlay for contrast */}
      </div>

      {/* Content Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl max-w-md w-full text-center overflow-hidden">
        {/* Floating Hearts */}
        <div className="absolute -top-6 left-1/3 animate-bounce-slow opacity-50">
          <Heart className="w-8 h-8 text-orange-400" />
        </div>
        <div className="absolute -bottom-6 right-1/4 animate-bounce-slow opacity-40">
          <Heart className="w-6 h-6 text-pink-300" />
        </div>

        <Hourglass className="w-16 h-16 mx-auto text-orange-500 mb-4 animate-pulse" />
        <h2 className="text-3xl font-bold mb-3 text-orange-600 tracking-wide font-serif">
          ⏳ Payment Pending
        </h2>
        <p className="text-gray-700 mb-3 text-base">
          Your payment of <strong className="text-orange-500">₹1500</strong> is awaiting admin confirmation.
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          Once verified, you will be redirected automatically.
        </p>

        <button
          onClick={logout}
          className="relative overflow-hidden inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
        >
          Log Out
        </button>

        {/* Subtle Heart Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-4 left-6 w-4 h-4 text-pink-200 opacity-30 animate-bounce-slow" />
          <Heart className="absolute bottom-4 right-6 w-5 h-5 text-orange-200 opacity-25 animate-bounce-slow" />
          <Heart className="absolute top-10 right-10 w-3 h-3 text-amber-200 opacity-20 animate-bounce-slow" />
        </div>
      </div>
    </div>
  );
};

export default Pending;
