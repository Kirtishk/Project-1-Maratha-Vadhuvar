import { useEffect, useState } from "react";
import {
  Heart,
  User,
  Briefcase,
  Home,
  Calendar,
  Phone,
  Mail,
  Edit2,
  Save,
  Camera,
  MapPin,
  DollarSign,
  Users,
  X,
  Menu,
  Image,
  Trash2,
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firbase";
import { uploadFileToCloudinary } from "../../lib";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

function App() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [editField, setEditField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("contact");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewLightbox, setPreviewLightbox] = useState(null);

  // Add these states at the top of your component
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoLibrary, setPhotoLibrary] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Fetch user's photos on load
  useEffect(() => {
    if (!currentUser) return;

    const fetchPhotos = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setPhotoLibrary(data.photos || []);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
      }
    };

    fetchPhotos();
  }, [currentUser]);

  // Handle new photo selection
  const handlePhotoChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setPhotoFile(selected);
      setPhotoPreview(URL.createObjectURL(selected));
    }
  };

  // Handle uploading photo to Cloudinary & Firebase
  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setPhotoLoading(true);
    try {
      const uploadResult = await uploadFileToCloudinary(
        photoFile,
        "users/photos"
      );
      if (uploadResult.success && uploadResult.data?.secure_url) {
        const imageUrl = uploadResult.data.secure_url;

        const updatedLibrary = [...photoLibrary, imageUrl];

        await setDoc(
          doc(db, "users", currentUser.uid),
          { photos: updatedLibrary, updatedAt: new Date().toISOString() },
          { merge: true }
        );

        setPhotoLibrary(updatedLibrary);
        setFormData((prev) => ({ ...prev, photos: updatedLibrary })); // <-- keep in sync
        toast.success("Photo Uploaded successfully!");
        setPhotoFile(null);
        setPhotoPreview(null);
      } else {
        alert("Photo upload failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading photo!");
    } finally {
      setPhotoLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData(data);
          setPreview(data.profileImage || "");
        } else {
          console.warn("No user document found!");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSaveField = async (fieldName) => {
    setIsSaving(true);
    try {
      const updated = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", currentUser.uid), updated, { merge: true });

      setEditField(null);
    } catch (err) {
      console.error(err);
      alert("Error updating field!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveImage = async () => {
    setIsSaving(true);
    try {
      if (file) {
        const uploadResult = await uploadFileToCloudinary(file, "users");
        if (uploadResult.success && uploadResult.data?.secure_url) {
          const imageUrl = uploadResult.data.secure_url;
          const updated = {
            ...formData,
            profileImage: imageUrl,
            updatedAt: new Date().toISOString(),
          };

          await setDoc(doc(db, "users", currentUser.uid), updated, {
            merge: true,
          });

          setPreview(imageUrl);
          setEditField(null);
        } else {
          alert("Upload failed!");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error updating image!");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Loading Profile
          </h2>
          <p className="text-slate-600">Please wait...</p>
        </div>
      </div>
    );
  }

  const EditableField = ({ label, name, type = "text", icon: Icon, value }) => {
    const [tempValue, setTempValue] = useState(value || "");

    useEffect(() => {
      setTempValue(value || "");
    }, [value]);

    return (
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2.5">
          {Icon && <Icon className="w-4 h-4 text-orange-600" />}
          {label}
        </label>
        <div className="flex items-stretch gap-2">
          <input
            type={type}
            name={name}
            value={editField === name ? tempValue : value || ""}
            onChange={(e) => setTempValue(e.target.value)}
            readOnly={editField !== name}
            disabled={isSaving}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
              editField === name
                ? "border-orange-500 bg-white shadow-lg ring-4 ring-orange-100 text-slate-800"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
            } focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          />

          {editField === name ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleChange({ target: { name, value: tempValue } });
                  handleSaveField(name);
                }}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={() => setEditField(null)}
                disabled={isSaving}
                className="flex items-center justify-center px-3 py-3 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all duration-200 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditField(name)}
              className="flex items-center justify-center gap-1 text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 px-4 py-3 rounded-xl transition-all duration-200 font-medium hover:shadow-lg"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Edit</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const sections = [
    { id: "contact", label: "Contact Info", icon: Mail },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "professional", label: "Professional Info", icon: Briefcase },
    { id: "family", label: "Family & Culture", icon: Users },
    { id: "astrological", label: "Astrological Info", icon: Heart },
    { id: "photo", label: "Library", icon: Image },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50">
        <div className="pt-12">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar Navigation */}
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl z-50 transition-transform duration-300 overflow-y-auto lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  Profile Sections
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:ml-64 transition-all duration-300">
            {/* Header with Profile */}
            <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 text-white shadow-2xl">
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex-shrink-0"
                  >
                    <Menu className="w-6 h-6" />
                  </button>

                  {/* Profile Image */}
                  <div className="relative group flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-3 border-white shadow-xl bg-gradient-to-br from-orange-100 to-rose-100">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-orange-300" />
                        </div>
                      )}
                    </div>

                    {editField === "profileImage" ? (
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profile-upload"
                          disabled={isSaving}
                        />
                        <label
                          htmlFor="profile-upload"
                          className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-110 ${
                            isSaving ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                        <button
                          onClick={handleSaveImage}
                          disabled={isSaving || !file}
                          className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditField(null);
                            setFile(null);
                            setPreview(formData.profileImage || "");
                          }}
                          disabled={isSaving}
                          className="flex items-center justify-center w-8 h-8 bg-slate-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-110"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditField("profileImage")}
                        className="absolute -bottom-2 -right-2 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-110"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Name and Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-black truncate">
                      {formData.name || "User Name"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {formData.profession && (
                        <span className="text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                          {formData.profession}
                        </span>
                      )}
                      {formData.age && (
                        <span className="text-xs sm:text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                          {formData.age} years
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 lg:p-20 lg:pt-50">
              <div className="max-w-5xl mx-auto">
                {/* Contact Information */}
                {activeSection === "contact" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                    <EditableField
                      label="Email Address"
                      name="email"
                      type="email"
                      icon={Mail}
                      value={formData.email}
                    />
                    <EditableField
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      icon={Phone}
                      value={formData.mobile}
                    />
                    <EditableField
                      label="Full Address"
                      name="address"
                      icon={Home}
                      value={formData.address}
                    />
                    <EditableField
                      label="Native Place"
                      name="nativePlace"
                      icon={MapPin}
                      value={formData.nativePlace}
                    />
                    <EditableField
                      label="Work Address"
                      name="workAddress"
                      icon={MapPin}
                      value={formData.workAddress}
                    />
                  </div>
                )}

                {/* Personal Details */}
                {/* Personal Details */}
                {activeSection === "personal" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                    <EditableField
                      label="Full Name"
                      name="name"
                      icon={User}
                      value={formData.name}
                    />
                    <EditableField
                      label="Age"
                      name="age"
                      type="number"
                      icon={Calendar}
                      value={formData.age}
                    />
                    <EditableField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={Calendar}
                      value={formData.dob}
                    />
                    <EditableField
                      label="Time of Birth"
                      name="tob"
                      type="time"
                      icon={Calendar}
                      value={formData.tob}
                    />
                    <EditableField
                      label="Blood Group"
                      name="bloodGroup"
                      icon={User}
                      value={formData.bloodGroup}
                    />
                    <EditableField
                      label="Color"
                      name="color"
                      icon={User}
                      value={formData.color}
                    />
                    <EditableField
                      label="Height (Feet)"
                      name="heightFeet"
                      icon={User}
                      value={formData.heightFeet}
                    />
                    <EditableField
                      label="Height (Inch)"
                      name="heightInch"
                      icon={User}
                      value={formData.heightInch}
                    />
                  </div>
                )}

                {/* Professional Information */}
                {activeSection === "professional" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                    <EditableField
                      label="Education"
                      name="education"
                      icon={Briefcase}
                      value={formData.education}
                    />
                    <EditableField
                      label="Profession"
                      name="profession"
                      icon={Briefcase}
                      value={formData.profession}
                    />
                    <EditableField
                      label="Monthly Income"
                      name="monthlyIncome"
                      icon={DollarSign}
                      value={formData.monthlyIncome}
                    />
                    <EditableField
                      label="Annual Income"
                      name="annualIncome"
                      icon={DollarSign}
                      value={formData.annualIncome}
                    />
                    <EditableField
                      label="Father Profession"
                      name="fatherProfession"
                      icon={Briefcase}
                      value={formData.fatherProfession}
                    />
                  </div>
                )}

                {/* Family & Cultural Information */}
                {activeSection === "family" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                    <EditableField
                      label="Father's Name"
                      name="fatherName"
                      icon={Users}
                      value={formData.fatherName}
                    />
                    <EditableField
                      label="Mother's Name"
                      name="motherName"
                      icon={Users}
                      value={formData.motherName}
                    />
                    <EditableField
                      label="Gotra"
                      name="gotra"
                      icon={Users}
                      value={formData.gotra}
                    />
                    <EditableField
                      label="Jaat"
                      name="jaat"
                      icon={Users}
                      value={formData.jaat}
                    />
                    <EditableField
                      label="Sisters"
                      name="sisters"
                      icon={Users}
                      value={formData.sisters}
                    />
                    <EditableField
                      label="Brothers"
                      name="brothers"
                      icon={Users}
                      value={formData.brothers}
                    />
                    <EditableField
                      label="Parents Address"
                      name="parentsAddress"
                      icon={Users}
                      value={formData.parentsAddress}
                    />
                  </div>
                )}

                {/* Astrological Information */}
                {activeSection === "astrological" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-2">
                    <EditableField
                      label="Rashi"
                      name="rashi"
                      icon={Heart}
                      value={formData.astrology.rashi}
                    />
                    <EditableField
                      label="Manglik Status"
                      name="manglik"
                      icon={Heart}
                      value={formData.astrology.manglik}
                    />
                    <EditableField
                      label="Charan"
                      name="charan"
                      icon={Heart}
                      value={formData.astrology.charan}
                    />
                    <EditableField
                      label="Gan"
                      name="gan"
                      icon={Heart}
                      value={formData.astrology.gan}
                    />
                    <EditableField
                      label="Nadi"
                      name="nadi"
                      icon={Heart}
                      value={formData.astrology.nadi}
                    />
                    <EditableField
                      label="Nakshatra"
                      name="nakshatra"
                      icon={Heart}
                      value={formData.astrology.nakshatra}
                    />
                  </div>
                )}
                {activeSection === "photo" && (
                  <div className="w-full px-2">
                    {/* Add Photo Dashed Dropzone */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-64">
                        {photoPreview ? (
                          // Preview with delete button (hover)
                          <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-orange-400 shadow-md group">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <button
                              onClick={() => {
                                setPhotoFile(null);
                                setPhotoPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          // Dashed dropzone
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-orange-400 rounded-2xl cursor-pointer hover:border-rose-500 hover:bg-orange-50 transition-all duration-200 text-center text-orange-600 font-semibold">
                            <span className="mb-2 text-3xl">＋</span>
                            <span className="text-sm">
                              Click to add a photo or drag & drop
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPhotoFile(file);
                                  setPhotoPreview(URL.createObjectURL(file));
                                }
                              }}
                              disabled={photoLoading}
                              className="hidden"
                            />
                          </label>
                        )}

                        {/* Upload Button */}
                        {photoFile && (
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={handleUploadPhoto}
                              disabled={photoLoading}
                              className={`relative px-6 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg transition-all flex items-center gap-2 justify-center ${
                                photoLoading
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {photoLoading && (
                                <svg
                                  className="animate-spin h-5 w-5 text-white absolute left-3"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  ></path>
                                </svg>
                              )}
                              {photoLoading ? "Uploading..." : "Upload"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pt-10 lg:grid-cols-5 gap-4">
                      {photoLibrary.length > 0 ? (
                        photoLibrary.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                          >
                            <img
                              src={url}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onClick={() => setPreviewLightbox(url)}
                            />
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const updatedLibrary = photoLibrary.filter(
                                    (p) => p !== url
                                  );
                                  await setDoc(
                                    doc(db, "users", currentUser.uid),
                                    {
                                      photos: updatedLibrary,
                                      updatedAt: new Date().toISOString(),
                                    },
                                    { merge: true }
                                  );
                                  setPhotoLibrary(updatedLibrary); // <-- Update photoLibrary state
                                  toast.success(
                                    "Photo deleted successfully! 🗑️"
                                  );
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Failed to delete photo!");
                                }
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 col-span-full text-center py-10 text-lg">
                          No photos uploaded yet. Use the dashed dropzone above
                          to add photos.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                {formData.updatedAt && (
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-100">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <p className="text-sm font-medium text-slate-600">
                        Last updated:{" "}
                        <span className="text-slate-800 font-semibold">
                          {new Date(formData.updatedAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
