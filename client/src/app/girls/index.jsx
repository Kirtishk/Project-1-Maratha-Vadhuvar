import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Users, Filter, Search } from "lucide-react";
import { db } from "../../config/firbase";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext"; // Make sure you have AuthContext

const MIN_AGE = 18;
const MAX_AGE = 60;

function App() {
  const { currentUser } = useAuth(); // Logged-in user
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const [ageRange, setAgeRange] = useState({ min: MIN_AGE, max: MAX_AGE });
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [educations, setEducations] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState("");
  const [professions, setProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState("");

  const navigate = useNavigate();

  // Fetch all male users except the logged-in user
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (p) => p.gender === "Female"  && p.payment?.status?.toLowerCase() === "approved" && p.id !== currentUser?.uid // Exclude logged-in user
          );

        setProfiles(data);
        setFilteredProfiles(data);

        // Extract unique hobbies
        const allHobbies = new Set();
        data.forEach((p) => p.hobbies?.forEach((h) => allHobbies.add(h)));
        setHobbies(Array.from(allHobbies));

        // Extract unique educations
        const eduSet = new Set();
        data.forEach((p) => p.education && eduSet.add(p.education));
        setEducations(Array.from(eduSet));

        // Extract unique professions
        const profSet = new Set();
        data.forEach((p) => p.profession && profSet.add(p.profession));
        setProfessions(Array.from(profSet));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfiles();
  }, [currentUser]);

  // Filter whenever filters change
  useEffect(() => {
    const result = profiles.filter((p) => {
      const matchAge = p.age >= ageRange.min && p.age <= ageRange.max;
      const matchHobbies =
        selectedHobbies.length === 0 || p.hobbies?.some((h) => selectedHobbies.includes(h));
      const matchEducation = !selectedEducation || p.education === selectedEducation;
      const matchProfession = !selectedProfession || p.profession === selectedProfession;
      return matchAge && matchHobbies && matchEducation && matchProfession;
    });
    setFilteredProfiles(result);
  }, [ageRange, selectedHobbies, selectedEducation, selectedProfession, profiles]);

  const toggleHobby = (hobby) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-15 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-8">
          {/* Filter Panel */}
          <div className="lg:w-80 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-orange-200/50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Filters
                </h2>
              </div>

              {/* Age Range */}
              <div className="mb-8">
                <label className="text-gray-800 font-semibold mb-4 block flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" /> Age Range
                </label>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4 text-sm font-medium text-gray-700">
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{ageRange.min}</span>
                    <span className="text-orange-600">—</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{ageRange.max}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={MIN_AGE}
                      max={MAX_AGE}
                      value={ageRange.min}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= ageRange.max) setAgeRange((prev) => ({ ...prev, min: val }));
                      }}
                      className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer mb-2 slider-thumb"
                    />
                    <input
                      type="range"
                      min={MIN_AGE}
                      max={MAX_AGE}
                      value={ageRange.max}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= ageRange.min) setAgeRange((prev) => ({ ...prev, max: val }));
                      }}
                      className="w-full h-3 bg-orange-200 rounded-full appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </div>
              </div>

              {/* Education Dropdown */}
              <div className="mb-8">
                <label className="text-gray-800 font-semibold mb-4 block">Education</label>
                <select
                  value={selectedEducation}
                  onChange={(e) => setSelectedEducation(e.target.value)}
                  className="w-full bg-white border-2 border-orange-200 rounded-2xl px-4 py-3 text-gray-800 font-medium focus:border-orange-400 focus:outline-none transition-colors duration-200 shadow-sm"
                >
                  <option value="">All Education Levels</option>
                  {educations.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profession Dropdown */}
              <div className="mb-8">
                <label className="text-gray-800 font-semibold mb-4 block">Profession</label>
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full bg-white border-2 border-orange-200 rounded-2xl px-4 py-3 text-gray-800 font-medium focus:border-orange-400 focus:outline-none transition-colors duration-200 shadow-sm"
                >
                  <option value="">All Professions</option>
                  {professions.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hobbies */}
              <div>
                <label className="text-gray-800 font-semibold mb-4 block">Interests & Hobbies</label>
                <div className="flex flex-wrap gap-3">
                  {hobbies.map((hobby) => (
                    <button
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedHobbies.includes(hobby)
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-white text-gray-700 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 shadow-sm"
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profiles Grid */}
          <div className="flex-1">
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/user/${p.id}`)}
                    className="group h-[350px] bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-orange-100 relative"
                  >
                    <div className="relative overflow-hidden aspect-[4/5] cursor-pointer">
                      <img
                        src={p.profileImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-200">
                            {p.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                              <Users className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium">{p.age} years old</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-8">
                      <button className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-semibold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-orange-50">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-8">
                  <Search className="w-16 h-16 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">No profiles found</h3>
                <p className="text-gray-600 text-center max-w-md mb-8 text-lg">
                  Try adjusting your filters to discover more amazing profiles.
                </p>
                <button
                  onClick={() => {
                    setAgeRange({ min: MIN_AGE, max: MAX_AGE });
                    setSelectedHobbies([]);
                    setSelectedEducation("");
                    setSelectedProfession("");
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
