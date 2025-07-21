import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminProfile({ onClose }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-4">👤 Admin Profile</h1>
        <p><strong>Email:</strong> {user?.email}</p>
        {/* <p><strong>UID:</strong> {user?.uid}</p> */}
        <p><strong>Role:</strong> Admin</p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
        {/* <button
          onClick={onClose}
          className="ml-4 border border-gray-400 px-4 py-2 rounded"
        >
          Close
        </button> */}
      </div>
    </div>
  );
}
