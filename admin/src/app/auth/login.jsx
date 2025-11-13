import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  
  
      // 1️⃣ Redirect to login if admin not logged in
    useEffect(() => {
      const adminUser = localStorage.getItem("adminUser");
      if (adminUser) {
        navigate("/home", { replace: true });
      }
    }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const res = login(email, password); // Check credentials
    if (res.success) {
      navigate("/home"); // Redirect on success
    } else {
      setError(res.message); // Show error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-orange-50 to-yellow-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-600">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-6 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
}
