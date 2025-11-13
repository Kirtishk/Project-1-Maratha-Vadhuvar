import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../config/firbase';
import { X, ChevronLeft, ChevronRight, ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, Droplet, Briefcase, Users, Heart, Star, Home, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(null);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
    return String(timestamp);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-700 text-lg font-medium">Loading profile...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">User Not Found</h2>
          <p className="text-slate-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const photos = user.photos || [];

  const openPhoto = (index) => setPreviewPhotoIndex(index);
  const closePhoto = () => setPreviewPhotoIndex(null);
  const prevPhoto = () =>
    setPreviewPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  const nextPhoto = () =>
    setPreviewPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));

  const InfoCard = ({ icon: Icon, title, children, gradient }) => (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`}></div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-sm`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-slate-100 last:border-0 group/row">
      <span className="text-sm font-semibold text-slate-600 group-hover/row:text-slate-800 transition-colors">{label}</span>
      <span className="text-sm text-slate-800 text-right max-w-[60%] font-medium">{value || "-"}</span>
    </div>
  );

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-15">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      <div className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-semibold">Back</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
            <div className="relative p-8 sm:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group/avatar">
                  {user.profileImage ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-pink-400 rounded-3xl blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity"></div>
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-white shadow-2xl cursor-pointer transform group-hover/avatar:scale-105 transition-transform duration-300"
                        onClick={() => openPhoto(photos.indexOf(user.profileImage))}
                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-4 ring-white shadow-2xl">
                      <User className="w-20 h-20 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">{user.name}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    {user.age && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-sm">
                        {user.age} years
                      </span>
                    )}
                    {user.jaat && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-full text-sm font-semibold shadow-sm">
                        {user.jaat}
                      </span>
                    )}
                    {user.bloodGroup && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm font-semibold shadow-sm flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5" />
                        {user.bloodGroup}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {user.email && (
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200/50">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 font-medium">Email</p>
                          <p className="text-sm text-slate-900 font-semibold truncate">{user.email}</p>
                        </div>
                      </div>
                    )}
                    {user.mobile && (
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200/50">
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-600 font-medium">Mobile</p>
                          <p className="text-sm text-slate-900 font-semibold">{user.mobile}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={User} title="Personal Details" gradient="from-blue-500 to-blue-600">
              <InfoRow label="Date of Birth" value={user.dob} />
              <InfoRow label="Day of Week" value={user.dayOfWeek} />
              <InfoRow label="Time of Birth" value={user.tob} />
              <InfoRow label="Height" value={user.heightFeet && user.heightInch ? `${user.heightFeet}' ${user.heightInch}"` : "-"} />
              <InfoRow label="Color" value={user.color} />
            </InfoCard>

            <InfoCard icon={MapPin} title="Address Details" gradient="from-pink-500 to-pink-600">
              <InfoRow label="Current Address" value={user.address} />
              <InfoRow label="Work Address" value={user.workAddress} />
              <InfoRow label="Native Place" value={user.nativePlace} />
              <InfoRow label="Parents Address" value={user.parentsAddress} />
            </InfoCard>

            <InfoCard icon={Briefcase} title="Professional Details" gradient="from-amber-500 to-amber-600">
              <InfoRow label="Education" value={user.education} />
              <InfoRow label="Profession" value={user.profession} />
              <InfoRow label="Annual Income" value={user.annualIncome} />
              <InfoRow label="Monthly Income" value={user.monthlyIncome} />
            </InfoCard>

            <InfoCard icon={Users} title="Family Details" gradient="from-teal-500 to-teal-600">
              <InfoRow label="Father's Name" value={user.fatherName} />
              <InfoRow label="Father's Profession" value={user.fatherProfession} />
              <InfoRow label="Mother's Name" value={user.motherName} />
              <InfoRow label="Brothers" value={user.brothers} />
              <InfoRow label="Sisters" value={user.sisters} />
            </InfoCard>

            <InfoCard icon={Star} title="Astrology Details" gradient="from-violet-500 to-violet-600">
              <InfoRow label="Rashi" value={user.astrology?.rashi} />
              <InfoRow label="Nakshatra" value={user.astrology?.nakshatra} />
              <InfoRow label="Gan" value={user.astrology?.gan} />
              <InfoRow label="Gotra" value={user.astrology?.gotra} />
              <InfoRow label="Charan" value={user.astrology?.charan} />
              <InfoRow label="Nadi" value={user.astrology?.nadi} />
              <InfoRow label="Manglik" value={user.astrology?.manglik} />
            </InfoCard>
          </div>

          {user.specialNotes && (
            <div className="bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Special Notes
                </h3>
                <p className="text-slate-700 leading-relaxed text-[15px] bg-white/50 p-4 rounded-xl border border-pink-100">{user.specialNotes}</p>
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-pink-500 to-violet-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Photo Gallery</h3>
                    <p className="text-sm text-slate-600">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                      onClick={() => openPhoto(idx)}
                    >
                      <img
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs font-bold text-slate-700">{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                Created on <span className="font-semibold text-slate-800">{formatTimestamp(user.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {previewPhotoIndex !== null && (
        <div
          onClick={closePhoto}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full animate-in zoom-in duration-300"
          >
            <img
              src={photos[previewPhotoIndex]}
              alt="Preview"
              className="max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={closePhoto}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white hover:bg-slate-100 rounded-full transition-all shadow-xl flex items-center justify-center group"
            >
              <X className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute top-1/2 -left-6 -translate-y-1/2 w-14 h-14 bg-white hover:bg-slate-100 rounded-full transition-all shadow-xl flex items-center justify-center group"
                >
                  <ChevronLeft className="w-7 h-7 text-slate-700 group-hover:text-slate-900" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute top-1/2 -right-6 -translate-y-1/2 w-14 h-14 bg-white hover:bg-slate-100 rounded-full transition-all shadow-xl flex items-center justify-center group"
                >
                  <ChevronRight className="w-7 h-7 text-slate-700 group-hover:text-slate-900" />
                </button>
              </>
            )}

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white rounded-full shadow-xl">
              <span className="text-sm font-bold text-slate-800">
                {previewPhotoIndex + 1} <span className="text-slate-400">/</span> {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default UserDetailsPage;
