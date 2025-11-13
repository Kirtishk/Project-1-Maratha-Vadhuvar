import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firbase";
import { doc, onSnapshot } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import Footer from "../../components/Footer";
import UserProfiles from "../../components/UserProfiles";

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      const status = data.payment?.status;

      if (status === "pending") navigate("/pending", { replace: true });
      else if (status === "rejected") navigate("/payment", { replace: true });
      // approved → stay on Home
    });

    return () => unsub();
  }, [currentUser, navigate]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <UserProfiles />
      <Footer />
    </>
  );
};

export default Home;
