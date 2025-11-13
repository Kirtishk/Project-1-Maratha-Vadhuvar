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

const PageFour = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [formData, setFormData] = useState({
    nativePlace: "",
    village: "",
    taluka: "",
    district: "",
    ancestralSurname: "",
    fatherName: "",
    fatherProfession: "",
    motherName: "",
    parentsAddress: "",
    brothers: "",
    sisters: "",
    specialNotes: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData((prev) => ({ ...prev, ...docSnap.data() }));
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
    await setDoc(doc(db, "users", currentUser.uid), formData, { merge: true });
    navigate("/details-5");
  };

  const handleBack = () => navigate("/details-3");

  const fields = [
    { label: "Native Place", name: "nativePlace", type: "text" },
    { label: "Village", name: "village", type: "text" },
    { label: "Taluka", name: "taluka", type: "text" },
    { label: "District", name: "district", type: "text" },
    { label: "Ancestral Family Surname", name: "ancestralSurname", type: "text" },
    { label: "Father's Full Name", name: "fatherName", type: "text" },
    { label: "Father's Profession", name: "fatherProfession", type: "text" },
    { label: "Mother's Full Name", name: "motherName", type: "text" },
    { label: "Parent's Residential Address", name: "parentsAddress", type: "textarea" },
    { label: "No. of Brothers", name: "brothers", type: "number" },
    { label: "No. of Sisters", name: "sisters", type: "number" },
    { label: "Special Notes", name: "specialNotes", type: "textarea" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center text-white px-4 sm:px-6 md:px-10 py-10">
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
          Family Information
        </h1>
      </div>

      {/* Form Fields */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={`flex flex-col ${
              field.type === "textarea" ? "sm:col-span-2" : ""
            }`}
          >
            <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                rows={4}
                className="px-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-black/50 focus:ring-4 focus:ring-orange-400 outline-none w-full"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className={`px-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-black/50 focus:ring-4 focus:ring-orange-400 outline-none ${
                  field.type === "number" ? "" : "w-full"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between mt-10 gap-4 w-full max-w-5xl">
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

export default PageFour;
