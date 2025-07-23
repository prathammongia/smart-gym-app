// src/pages/Profile.jsx
import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile({ onClose }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose?.(); // optional drawer close
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToHistory = () => {
    onClose?.(); // optional drawer close
    navigate("/check-in-history");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

      <div className="mb-4">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Last Login:</strong> {user?.metadata?.lastSignInTime}</p>
      </div>

      <div className="mt-6 text-right space-x-2">
        <button
          onClick={goToHistory}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Check-In History
        </button>
        <button
          onClick={handleLogout}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
