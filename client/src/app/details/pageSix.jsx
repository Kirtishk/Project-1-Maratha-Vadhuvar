import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firbase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

const backgrounds = [
  "https://images.unsplash.com/photo-1574017144578-85168ddb5040?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1550575904-40938d5a4fca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1645856052484-2e5506e20942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
];

const PageSix = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [bgIndex, setBgIndex] = useState(0);
  const [formData, setFormData] = useState({
    rashi: "",
    nakshatra: "",
    charan: "",
    gan: "",
    nadi: "",
    gotra: "",
    manglik: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().astrology) {
        setFormData({ ...docSnap.data().astrology });
      }
    };
    fetchUserData();

    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % backgrounds.length),
      6000
    );
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await setDoc(doc(db, "users", currentUser.uid), { astrology: formData }, { merge: true });
    navigate("/payment");
  };

  const handleBack = () => navigate("/details-5");

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
          Astrological Details
        </h1>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Rashi */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Rashi (Zodiac Sign)</label>
          <select
            name="rashi"
            value={formData.rashi}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          >
            <option value="">Select Rashi</option>
            <option value="मेष (Aries)">मेष (Aries)</option>
            <option value="वृषभ (Taurus)">वृषभ (Taurus)</option>
            <option value="मिथुन (Gemini)">मिथुन (Gemini)</option>
            <option value="कर्क (Cancer)">कर्क (Cancer)</option>
            <option value="सिंह (Leo)">सिंह (Leo)</option>
            <option value="कन्या (Virgo)">कन्या (Virgo)</option>
            <option value="तुला (Libra)">तुला (Libra)</option>
            <option value="वृश्चिक (Scorpio)">वृश्चिक (Scorpio)</option>
            <option value="धनु (Sagittarius)">धनु (Sagittarius)</option>
            <option value="मकर (Capricorn)">मकर (Capricorn)</option>
            <option value="कुंभ (Aquarius)">कुंभ (Aquarius)</option>
            <option value="मीन (Pisces)">मीन (Pisces)</option>
          </select>
        </div>

        {/* Nakshatra */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Nakshatra</label>
          <input
            type="text"
            name="nakshatra"
            value={formData.nakshatra}
            onChange={handleChange}
            placeholder="e.g. पूर्व भाद्रपदा"
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          />
        </div>

        {/* Charan */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Charan</label>
          <select
            name="charan"
            value={formData.charan}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          >
            <option value="">Select Charan</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
          </select>
        </div>

        {/* Gan */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Gan</label>
          <select
            name="gan"
            value={formData.gan}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          >
            <option value="">Select Gan</option>
            <option value="देवगण (Deva)">देवगण (Deva)</option>
            <option value="मनुष्यगण (Manushya)">मनुष्यगण (Manushya)</option>
            <option value="राक्षसगण (Rakshasa)">राक्षसगण (Rakshasa)</option>
          </select>
        </div>

        {/* Nadi */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Nadi</label>
          <select
            name="nadi"
            value={formData.nadi}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          >
            <option value="">Select Nadi</option>
            <option value="आदि (Adi)">आदि (Adi)</option>
            <option value="मध्य (Madhya)">मध्य (Madhya)</option>
            <option value="अंत्य (Antya)">अंत्य (Antya)</option>
          </select>
        </div>

        {/* Gotra */}
        <div className="flex flex-col">
          <label className="mb-1 text-white/90 font-semibold">Gotra</label>
          <input
            type="text"
            name="gotra"
            value={formData.gotra}
            onChange={handleChange}
            placeholder="Enter Gotra"
            className="px-4 py-3 rounded-xl bg-white border border-white/30 text-black outline-none focus:ring-4 focus:ring-orange-400"
          />
        </div>

        {/* Manglik */}
        <div className="flex flex-col col-span-2">
          <label className="mb-2 text-white/90 font-semibold">Manglik Status</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="manglik"
                value="Yes"
                checked={formData.manglik === "Yes"}
                onChange={handleChange}
                className="accent-orange-500"
              />
              हां (Yes)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="manglik"
                value="No"
                checked={formData.manglik === "No"}
                onChange={handleChange}
                className="accent-orange-500"
              />
              नाही (No)
            </label>
          </div>
        </div>
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

export default PageSix;
