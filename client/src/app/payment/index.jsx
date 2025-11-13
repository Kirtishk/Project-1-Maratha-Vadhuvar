import React, { useEffect, useState } from "react";
import { doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firbase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { Heart } from "lucide-react";

const MERCHANT_VPA = import.meta.env.VITE_PAYMENT_MERCHANT_VPA;
const MERCHANT_NAME = import.meta.env.VITE_PAYMENT_MERCHANT_NAME;
const AMOUNT = import.meta.env.VITE_PAYMENT_AMOUNT;

const backgrounds = [
  "https://images.unsplash.com/photo-1574017144578-85168ddb5040?q=80&w=699&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1550575904-40938d5a4fca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
  "https://images.unsplash.com/photo-1645856052484-2e5506e20942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0",
];

export default function Payment() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [txnRef, setTxnRef] = useState("");
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
  if (!currentUser) return;

  const unsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
    if (!docSnap.exists()) return;
    const data = docSnap.data();

    const status = data.payment?.status;
    if (status === "pending") navigate("/pending", { replace: true });
    else if (status === "approved") navigate("/dashboard", { replace: true });
    else if (status === "rejected") alert("Payment rejected. Please try again.");
  });

  return () => unsub();
}, [currentUser, navigate]);

  useEffect(() => {
    const interval = setInterval(
      () => setBgIndex((prev) => (prev + 1) % backgrounds.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return null;

  const upiLink = `upi://pay?pa=${MERCHANT_VPA}&pn=${MERCHANT_NAME}&am=${AMOUNT}&cu=INR`;

  const handleConfirm = async () => {
    if (!txnRef.trim()) return alert("Enter the UPI transaction ID to confirm payment.");

    const validTxn = /^[0-9A-Za-z]{12,20}$/;
    if (!validTxn.test(txnRef.trim())) return alert("Invalid transaction ID format!");

    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        payment: {
          paid: true,
          status: "pending",
          txnId: txnRef.trim(),
          amount: Number(AMOUNT),
          method: "UPI-QR",
          submittedAt: serverTimestamp(),
        },
        isNew: false,
        isRejected: false,
      },
      { merge: true }
    );

    alert("Payment submitted! We’ll verify and unlock access soon.");
    navigate("/pending");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center  px-4">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {backgrounds.map((url, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === bgIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* QR Code Container */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-xl max-w-sm w-full flex flex-col items-center text-center">
        <Heart className="w-10 h-10 text-orange-400 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-600">
          Pay ₹{AMOUNT} to continue
        </h1>
        <p className="text-gray-700 mb-4 text-sm sm:text-base">
          Scan the QR code below with any UPI app (GPay / Paytm / PhonePe)
        </p>
        <div className="bg-white p-4 rounded-xl mb-2">
          <QRCode value={upiLink} size={180} />
        </div>
        <p className="text-gray-600 text-sm mb-4">{MERCHANT_VPA}</p>

        <input
          type="text"
          placeholder="Enter UPI Transaction ID"
          value={txnRef}
          onChange={(e) => setTxnRef(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-black"
        />

        <button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md"
        >
          I have paid
        </button>
      </div>
    </div>
  );
}
