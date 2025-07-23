import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut } from "lucide-react";
import "./Profile.css";

export default function Profile({ onClose }) {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    email: "",
    dietProfile: {},
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCloseAndNavigate = (path) => {
    if (onClose) {
      onClose(); // Slide out
    }
    setTimeout(() => {
      navigate(path);
    }, 300); // Matches transition duration in App.jsx (0.3s)
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">👤 <span>Your Profile</span></h2>
        <button onClick={handleLogout} className="profile-btn">
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="profile-summary">
        <p><strong>Full Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Weight:</strong> {profile.weight} kg</p>
      </div>

      <div className="profile-buttons">
        <button
          onClick={() => handleCloseAndNavigate("/EditProfile")}
          className="profile-btn"
        >
          <Pencil size={16} />
          Edit Profile
        </button>
        <button
          onClick={() => handleCloseAndNavigate("/CheckInHistory")}
          className="profile-btn"
        >
          📜 Check-In History
        </button>
      </div>
    </div>
  );
}
