// PageOne.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "../../lib";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firbase";
import { useNavigate } from "react-router-dom";
import { Heart, Upload, User, MapPin, ArrowRight, LogOut } from "lucide-react";

function PageOne() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(""); // <-- new gender state
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const backgrounds = [
    "https://plus.unsplash.com/premium_photo-1682090864876-c452a35292cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1573951648026-fa38ff3f6770?q=80&w=1054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1645856051472-1046636f6c43?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUserData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profileImage) setPreview(data.profileImage);
        if (data.name) setName(data.name);
        if (data.address) setAddress(data.address);
        if (data.gender) setGender(data.gender); // <-- prefill gender
      }
    };
    fetchUserData();

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!gender) {
      alert("Please select your gender.");
      return;
    }

    let imageUrl = preview;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file, "users");
      if (uploadResult.success && uploadResult.data?.secure_url) {
        imageUrl = uploadResult.data.secure_url;
      } else {
        alert("Image upload failed!");
        return;
      }
    }
    await setDoc(
      doc(db, "users", currentUser.uid),
      { name, address, profileImage: imageUrl, gender, photos:[] },
      { merge: true }
    );

    navigate("/details-2");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background slideshow */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6 sm:px-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 shadow-xl">
            <Heart className="w-8 h-8 text-white fill-white/90" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Details</h1>
            <p className="text-amber-200 text-sm">Help us know you better</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-white/20 px-4 py-3 rounded-xl border border-white/30 backdrop-blur-md cursor-pointer hover:bg-white/30 transition">
                <Upload className="w-5 h-5 text-orange-300" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow-md"
                />
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-300" />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-5 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm border border-white/30 text-slate-800 placeholder-slate-500 font-medium  focus:ring-4 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-300" />
              <textarea
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-5 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur-sm border border-white/30 text-slate-800 placeholder-slate-500 font-medium focus:ring-4 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-2">Gender</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-orange-500 w-5 h-5"
                />
                Male
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-orange-500 w-5 h-5"
                />
                Female
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  className="accent-orange-500 w-5 h-5"
                />
                Other
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 focus:ring-4 focus:ring-orange-300 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageOne;
