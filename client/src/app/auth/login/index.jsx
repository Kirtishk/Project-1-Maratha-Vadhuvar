import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Sparkles, Flower as FlowerIcon } from "lucide-react";
import { img2 } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../config/firbase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import { onAuthStateChanged } from "firebase/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate()
  const {currentUser} = useAuth

  const backgrounds = [
    "https://images.unsplash.com/photo-1573890697396-eed65fd271cf?q=80&w=1013&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1740416265401-0f4f850ba062?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609150370455-8beb3e7d35f4?q=80&w=1170&auto=format&fit=crop",
  ];

  


  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(interval);

    
  }, []);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Logged in as:", user.uid);
  } else {
    console.log("❌ Not logged in");
  }
});
  const checkUser = async () => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isNew) {
        navigate("/details-1"); // redirect new users
      } else {
        navigate("/dashboard"); // existing users
      }
    }
  };

  checkUser();
}, [currentUser, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().isNew) {
      navigate("/details-1");
      toast.warn("Please fill the details")
    } else {
      navigate("/dashboard");
      toast.success(`Sucessfully logged in as ${user.displayName}`)
    }
  } catch (err) {
    toast.error(err.message)
    setLoading(false)
  }
  };


  return (
    <div className="relative min-h-screen w-full text-slate-800 overflow-hidden flex flex-col justify-center items-center">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        {backgrounds.map((url, i) => (
          <div
            key={i}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-[2000ms] ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})`, filter: "brightness(30%)" }}
          ></div>
        ))}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-yellow-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4 px-4 sm:px-0 space-y-6 sm:space-y-8">
        {/* Title */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg">
            Maratha <span className="text-orange-400">Vadhuvar</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
          <p className="text-white/90 text-base sm:text-lg font-light italic">
            Where Hearts Unite Forever
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-md">
            Welcome Back
          </h2>
          <p className="text-white/80 text-sm font-light">
            Continue your journey to forever
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-800 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm text-center font-medium shadow-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/95 backdrop-blur-sm border-1 border-orange-300 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all duration-300 shadow-lg font-medium"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/95 backdrop-blur-sm border-1 border-orange-300 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all duration-300 shadow-lg font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Continue Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </form>

        {/* Bottom text */}
        <div className="text-center pb-4">
          <p className="text-white/80 text-xs sm:text-sm font-light italic flex items-center gap-2 justify-center">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" fill="currentColor" />
            Where love stories begin
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" fill="currentColor" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
