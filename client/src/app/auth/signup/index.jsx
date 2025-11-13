// Signup.jsx
import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/firbase.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { doc, setDoc,getDocs, query, where, collection, getDoc } from "firebase/firestore";
import { Heart, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Background wedding images (warm/orange/romantic)
  const backgrounds = [
    "https://images.unsplash.com/photo-1573890697396-eed65fd271cf?q=80&w=1013&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609150370455-8beb3e7d35f4?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?q=80&w=1170&auto=format&fit=crop",
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const checkUserStatus = async () => {
  if (!currentUser || !currentUser.uid) return;
  try {
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (!userData.isNew) navigate("/dashboard");
    }
  } catch (err) {
    console.error("Error checking user:", err);
  }
};


  checkUserStatus();

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);

 const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  // 1️⃣ Check all required fields
  if (!email || !password || !cfmPassword) {
    toast.warn("Please fill all the fields");
    return;
  }

  // 2️⃣ Passwords match
  if (password !== cfmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  // 3️⃣ Strong password check
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    toast.error("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
    return;
  }

  setLoading(true);
  try {
    // 4️⃣ Check if user already exists in Firestore
    const userQuerySnapshot = await getDocs(query(collection(db, "users"), where("email", "==", email)));
    if (!userQuerySnapshot.empty) {
      toast.error("User with this email already exists!");
      setLoading(false);
      return;
    }

    // 5️⃣ Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName  ,
      isNew: true,
      isPaid: false,
      createdAt: new Date(),
    });

    toast.success("Registered successfully!");
    navigate("/details-1");
  } catch (err) {
    setError("Signup failed. " + err.message);
    toast.error("Error Signing Up");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen w-full text-slate-800 overflow-hidden flex flex-col justify-center items-center">
      {/* Background slideshow with overlay */}
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
            Begin Your Journey of Love
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
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
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/95 backdrop-blur-sm border-2 border-orange-300 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none transition-all duration-300 shadow-lg font-medium"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/95 backdrop-blur-sm border-2 border-orange-300 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none transition-all duration-300 shadow-lg font-medium"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={cfmPassword}
              onChange={(e) => setCfmPassword(e.target.value)}
              required
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/95 backdrop-blur-sm border-2 border-orange-300 text-slate-800 placeholder-slate-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 outline-none transition-all duration-300 shadow-lg font-medium"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : (
              <>
                Start Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </form>

        {/* Bottom text */}
        <div className="text-center pb-4">
          <p className="text-white/80 text-xs sm:text-sm font-light italic flex items-center gap-2 justify-center">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" fill="currentColor" />
            A new chapter starts here
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300" fill="currentColor" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
