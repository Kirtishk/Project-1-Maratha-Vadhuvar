import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc,query, where } from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { Users as UsersIcon, CheckCircle2, Clock, Mail, Phone, User, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("payment.status", "in", ["pending", "approved"])
      );

      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(list);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  // Handle "Unverify" action
  const handleUnverify = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isPaid: false, "payment.status": "rejected" });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, isPaid: false } : user))
      );
      toast.success("User has been unverified successfully!");
    } catch (error) {
      console.error("Error unverifying user:", error);
      toast.error("Failed to unverify user.");

    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-slate-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl shadow-lg">
              <UsersIcon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base ml-0 sm:ml-16">
            Manage and monitor all registered users
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-rose-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-100 to-rose-100 p-2 rounded-lg">
                  <UsersIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">All Users</h2>
                  <p className="text-sm text-slate-600">
                    {users.length} {users.length === 1 ? "user" : "users"} registered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="p-12 sm:p-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full mb-4 sm:mb-6">
                <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">No users found</h3>
              <p className="text-slate-600">Users will appear here once they register</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          User
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-rose-50/30 transition-all duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold shadow-md">
                              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{user.name || "Unknown"}</p>
                              <p className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-700">{user.email || "-"}</td>
                        <td className="py-4 px-6 text-slate-700">{user.mobile || "-"}</td>
                        <td className="py-4 px-6">
                          {user.isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-sm font-medium shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium shadow-sm">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {user.isPaid && (
                            <button
                              onClick={() => handleUnverify(user.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Unverify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="lg:hidden divide-y divide-slate-100">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-rose-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{user.name || "Unknown"}</p>
                          <p className="text-xs text-slate-500">ID: {user.id.slice(0, 12)}...</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.isPaid ? (
                          <button
                            onClick={() => handleUnverify(user.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 transition"
                          >
                            <XCircle className="w-3 h-3" />
                            Unverify
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-medium shadow-sm">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pl-0">
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Mail className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Email</p>
                          <p className="text-sm font-medium">{user.email || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Phone className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Phone</p>
                          <p className="text-sm font-medium">{user.mobile || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {users.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-800">{users.length}</span> total {users.length === 1 ? "user" : "users"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
