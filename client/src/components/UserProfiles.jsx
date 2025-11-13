  import React, { useEffect, useState } from "react";
  import { collection, getDocs, query, orderBy } from "firebase/firestore";
  import { useNavigate } from "react-router-dom";

  import { Users, ChevronLeft, ChevronRight, Loader2, MapPin, Mail, Heart } from "lucide-react";
  import { useAuth } from "../context/AuthContext";
  import { db } from "../config/firbase";

  const PAGE_SIZE = 10;

  const UserProfiles = () => {
    const [users, setUsers] = useState([]);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const fetchUsers = async () => {
  setLoading(true);
  try {
    const q = query(collection(db, "users"), orderBy("name"));
    const snapshot = await getDocs(q);

    // Map Firestore docs to user objects
    let fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // ✅ Filter users whose payment.status === 'verified'
    fetchedUsers = fetchedUsers.filter(user => {
      // exclude current user
      if (currentUser && user.uid === currentUser.uid) return false;

      // payment should be an object and verified
      return user.payment?.status?.toLowerCase() === "approved";
    });

    // ✅ Paginate
    const paginated = [];
    for (let i = 0; i < fetchedUsers.length; i += PAGE_SIZE) {
      paginated.push(fetchedUsers.slice(i, i + PAGE_SIZE));
    }

    setPages(paginated);
    setUsers(paginated[0] || []);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
      fetchUsers();
    }, [currentUser]);

    const goToPage = (pageNum) => {
      setCurrentPage(pageNum);
      setUsers(pages[pageNum - 1]);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-2">
              Discover People
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Connect with amazing individuals from our community
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 text-lg">Loading profiles...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No users found</p>
            </div>
          ) : (
            <>
              {/* User Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-12">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border border-slate-100"
                  >
                    {/* Image Container with Overlay */}
                    <div className="relative w-full h-64 sm:h-72 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/20 z-10" />
                      <img
                        src={user.profileImage || "https://via.placeholder.com/300x400"}
                        alt={user.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                      {/* Floating Badge */}
                      <div className="absolute top-3 right-3 z-30">
                        <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg border border-white/40">
                          <span className="text-xs font-bold text-slate-700">{user.age} years</span>
                        </div>
                      </div>

                      

                      {/* Name Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                        <h3 className="font-bold text-white text-xl mb-1 drop-shadow-lg">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm">
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="drop-shadow">{user.location}</span>
                            </div>
                          )}
                          {user.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="drop-shadow truncate max-w-[120px]">{user.email.split('@')[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Bar */}
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-medium">View Profile</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pages.length > 1 && (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="group inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border-2 border-slate-200 text-slate-700 shadow-md hover:shadow-xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:hover:shadow-md"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg p-2 border border-slate-100">
                      {pages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(index + 1)}
                          className={`relative inline-flex items-center justify-center w-11 h-11 rounded-lg text-sm font-bold transition-all duration-300 ${
                            currentPage === index + 1
                              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50 scale-110"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105 hover:shadow-md"
                          }`}
                          aria-label={`Go to page ${index + 1}`}
                          aria-current={currentPage === index + 1 ? "page" : undefined}
                        >
                          {index + 1}
                          {currentPage === index + 1 && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === pages.length}
                      className="group inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border-2 border-slate-200 text-slate-700 shadow-md hover:shadow-xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:hover:shadow-md"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  <div className="text-sm text-slate-500 font-medium">
                    Page {currentPage} of {pages.length}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  export default UserProfiles;
