import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Mail, Phone, IndianRupee, Users, Loader2 } from "lucide-react";
import { db } from "../../config/firebase.js"; // your firebase config
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BACKENT_API =import.meta.env.VITE_BACKEND_URL


const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



    // 1️⃣ Redirect to login if admin not logged in
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
       const q = query(
  collection(db, "users"),
  where("isPaid", "==", false),
  where("payment.status", "==", "pending")
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
  }, [users]);

  const sendEmail = async (to, subject, html) => {
    try {
      const response = await fetch(BACKENT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(`📧 Email sent to ${to}`);
      } else {
        console.error("❌ Failed to send email:", data.error);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const handleVerify = async (user) => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { isPaid: true, "payment.status": "approved" });

      await sendEmail(
        user.email,
        "✅ Payment Verified",
        `<p>Hi ${user.name},</p>
    <p>Great news — your payment has been successfully <b>verified!</b> 🎉</p>
    <p>You can now log in to <b>Marath Vaduvar</b> and start searching for your <b>life partner</b>.</p>
    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <br/>
    <p>Best regards,<br/>The Marath Vaduvar Team</p>`
      );

      toast.success(`${user.name} has been verified!`);
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify user.");

    }
  };

  const handleReject = async (user) => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { 
        isPaid: false,
        "payment.status": "rejected"
      });
      await sendEmail(
        user.email,
        "❌ Payment Rejected",
        `<p>Hi ${user.name},</p>
        <p>We regret to inform you that your recent payment could <b>not be verified</b>. 😔</p>
        <p>This might have happened due to incorrect payment details, delays, or technical issues.</p>
        <p>Please ensure your payment details are correct and try again, or contact our support team for help.</p>
        <p>📞 Contact Support</a></p>
        <br/>
        <p>Best regards,<br/>The Marath Vaduvar Team</p>`
      );

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`${user.name}  has been rejected.`);

    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 font-medium">Loading pending verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Payment Verification
            </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base ml-0 sm:ml-15">
            Review and approve pending user registrations
          </p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">All Caught Up</h3>
            <p className="text-slate-600">No users pending verification at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-4 py-3 mb-4">
              <p className="text-sm font-medium text-slate-700">
                <span className="text-blue-600 font-bold">{users.length}</span> user{users.length !== 1 ? 's' : ''} awaiting verification
              </p>
            </div>

            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">
                            {user.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Verification
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="text-sm truncate" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="text-sm">
                            +91 {user.mobile || "Not provided"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                          <IndianRupee className="w-4 h-4 flex-shrink-0 text-slate-400" />
                          <span className="text-sm font-medium">
                            Amount Paid: <span className="text-slate-800 font-semibold">{user.payment?.amount || "Not specified"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-3 lg:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleVerify(user)}
                        className="flex-1 lg:flex-none lg:min-w-[140px] px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                      >
                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Verify</span>
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="flex-1 lg:flex-none lg:min-w-[140px] px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                      >
                        <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
