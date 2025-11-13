import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firbase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart, X } from "lucide-react";

const backgrounds = [
  "https://images.unsplash.com/photo-1574017144578-85168ddb5040?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1550575904-40938d5a4fca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1645856052484-2e5506e20942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
];

const PageFive = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bgIndex, setBgIndex] = useState(0);
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState("");

  // Load existing hobbies
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().hobbies) {
        setHobbies(docSnap.data().hobbies);
      }
    };
    fetchUserData();

    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % backgrounds.length),
      6000
    );
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    setHobbies((prev) => [...prev, newHobby.trim()]);
    setNewHobby("");
  };

  const handleRemoveHobby = (index) => {
    setHobbies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    await setDoc(doc(db, "users", currentUser.uid), { hobbies }, { merge: true });
    navigate("/details-6");
  };

  const handleBack = () => navigate("/details-4");

  return (
    <div className="relative min-h-screen flex flex-col items-center text-white px-6 py-10">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {backgrounds.map((url, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center gap-3 mb-10">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 shadow-xl">
          <Heart className="w-8 h-8 text-white fill-white/90" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Hobbies
        </h1>
      </div>

      {/* Input */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter a hobby"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-white/30 text-black placeholder-black/50 focus:ring-4 focus:ring-orange-400 outline-none"
        />
        <button
          onClick={handleAddHobby}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-semibold shadow-md transition-all duration-300"
        >
          Add
        </button>
      </div>

      {/* Hobbies List */}
      <div className="relative z-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hobbies.length === 0 && (
          <p className="col-span-2 text-white/80">No hobbies added yet.</p>
        )}
        {hobbies.map((hobby, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white/90 text-black rounded-xl px-4 py-2 shadow-md"
          >
            <span>{hobby}</span>
            <button
              onClick={() => handleRemoveHobby(index)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between mt-10 gap-4 w-full max-w-3xl">
        <button
          onClick={handleBack}
          className="bg-gray-500/70 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-600 to-amber-600 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 focus:ring-4 focus:ring-orange-300 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PageFive;
