import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firbase";
import { useNavigate } from "react-router-dom";
import { Heart, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import Select from "react-dropdown-select";

const PageTwo = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    gotra: "",
    jaat: "",
    mobile: "",
    dob: "",
    tob: "",
    age: "",
    dayOfWeek: "",
    heightFeet: "",
    heightInch: "",
    color: "",
    bloodGroup: "",
  });

  const backgrounds = [
    "https://images.unsplash.com/photo-1574017144578-85168ddb5040?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1550575904-40938d5a4fca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1645856052484-2e5506e20942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  ];

  const [bgIndex, setBgIndex] = useState(0);

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

  const handleSelectChange = (name, selected) => {
    setFormData((prev) => ({ ...prev, [name]: selected[0]?.value || "" }));
  };

  const handleSave = async () => {
    await setDoc(doc(db, "users", currentUser.uid), formData, { merge: true });
    navigate("/details-3");
  };

  const handleBack = () => navigate("/details-1");

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">
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

      {/* Form Section */}
      <div className="relative z-10 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-12 py-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-3 shadow-xl">
            <Heart className="w-8 h-8 text-white fill-white/90" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Additional Details
          </h1>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {[
            {
              label: "Gotra",
              name: "gotra",
              type: "text",
              placeholder: "Enter Gotra",
            },
            {
              label: "Jaat",
              name: "jaat",
              type: "text",
              placeholder: "Enter Jaat",
            },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Time of Birth", name: "tob", type: "time" },
            {
              label: "Age",
              name: "age",
              type: "number",
              placeholder: "Enter Age",
            },
            {
              label: "Day of Week",
              name: "dayOfWeek",
              type: "text",
              placeholder: "Enter Day",
            },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder || ""}
                className="px-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-white/50 focus:ring-4 focus:ring-orange-400 outline-none"
              />
            </div>
          ))}

          {/* Mobile Number */}
          <div className="flex flex-col col-span-1 sm:col-span-2 relative">
            <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
              Mobile Number
            </label>
            <Phone className="absolute left-4 top-[50%] translate-y-[25%] w-5 h-5 text-orange-300" />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-white/50 focus:ring-4 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Height */}
          <div className="flex flex-col col-span-1 sm:col-span-2 gap-3">
            <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
              Height (Feet & Inch)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                name="heightFeet"
                value={formData.heightFeet}
                onChange={handleChange}
                placeholder="Feet"
                className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-white/50 focus:ring-4 focus:ring-orange-400 outline-none"
              />
              <input
                type="number"
                name="heightInch"
                value={formData.heightInch}
                onChange={handleChange}
                placeholder="Inch"
                className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-white/30 text-black placeholder-white/50 focus:ring-4 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Color Dropdown */}
          <div className="flex flex-col relative">
            <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
              Color
            </label>
            <Select
              options={[
                { label: "Fair", value: "Fair" },
                { label: "Wheatish", value: "Wheatish" },
                { label: "Dark", value: "Dark" },
              ]}
              values={
                formData.color
                  ? [{ label: formData.color, value: formData.color }]
                  : []
              }
              onChange={(values) => handleSelectChange("color", values)}
              placeholder="Select Color"
              dropdownPosition="auto"
              className="w-full text-sm sm:text-base"
              style={{
                background: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "10px",
                color: "black",
                fontSize: "inherit",
                fontWeight: "500",
              }}
              dropdownStyle={{
                zIndex: 9999,
                position: "absolute",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.9)",
                color: "white",
                padding: "6px",
                maxHeight: "180px",
                overflowY: "auto",
                borderRadius: "12px",
                width: "100%",
              }}
              itemRenderer={({ item, methods }) => (
                <div
                  className={`px-3 py-2 cursor-pointer rounded-lg ${
                    methods.isSelected(item)
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-400/30"
                  }`}
                  onClick={() => methods.addItem(item)}
                >
                  {item.label}
                </div>
              )}
            />
          </div>

          {/* Blood Group Dropdown */}
          <div className="flex flex-col relative">
            <label className="text-white/90 text-base sm:text-sm font-semibold mb-1 drop-shadow-md">
              Blood Group
            </label>
            <Select
              options={[
                { label: "A+", value: "A+" },
                { label: "A-", value: "A-" },
                { label: "B+", value: "B+" },
                { label: "B-", value: "B-" },
                { label: "O+", value: "O+" },
                { label: "O-", value: "O-" },
                { label: "AB+", value: "AB+" },
                { label: "AB-", value: "AB-" },
              ]}
              values={
                formData.bloodGroup
                  ? [{ label: formData.bloodGroup, value: formData.bloodGroup }]
                  : []
              }
              onChange={(values) => handleSelectChange("bloodGroup", values)}
              placeholder="Select Blood Group"
              dropdownPosition="auto"
              className="w-full text-sm sm:text-base"
              style={{
                background: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "12px",
                padding: "10px",
                color: "black",
                fontSize: "inherit",
                fontWeight: "500",
              }}
              dropdownStyle={{
                zIndex: 9999,
                position: "absolute",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.9)",
                color: "white",
                padding: "6px",
                maxHeight: "180px",
                overflowY: "auto",
                borderRadius: "12px",
                width: "100%",
              }}
              itemRenderer={({ item, methods }) => (
                <div
                  className={`px-3 py-2 cursor-pointer rounded-lg ${
                    methods.isSelected(item)
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-400/30"
                  }`}
                  onClick={() => methods.addItem(item)}
                >
                  {item.label}
                </div>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-3">
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
    </div>
  );
};

export default PageTwo;
