import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut, Save } from "lucide-react";
import "./Profile.css"; // You should apply the CSS I provided earlier

export default function Profile() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    weight: "",
    email: "",
    dietProfile: {
      goal: "",
      level: "",
      gender: "",
      dietPref: "",
      workoutStyle: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setProfile((prev) => ({
            ...prev,
            ...userData,
            dietProfile: {
              ...prev.dietProfile,
              ...(userData.dietProfile || {}),
            },
          }));
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in profile.dietProfile) {
      setProfile((prev) => ({
        ...prev,
        dietProfile: {
          ...prev.dietProfile,
          [name]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await set(ref(db, `users/${userId}`), profile);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="profile-container">
      <button onClick={handleLogout} className="logout-btn">
        <LogOut size={18} />
        Logout
      </button>

      <div className="profile-header">
        <h2>👤 Profile</h2>
        {editing ? (
          <button onClick={handleSave} className="edit-btn save-btn">
            <Save size={16} />
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="edit-btn">
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      <form className="profile-form">
        <div>
          <label>Full Name</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            value={profile.email}
            readOnly
          />
        </div>

        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={profile.weight}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Goal</label>
          <input
            name="goal"
            value={profile.dietProfile.goal}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Level</label>
          <input
            name="level"
            value={profile.dietProfile.level}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Gender</label>
          <input
            name="gender"
            value={profile.dietProfile.gender}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Diet Preference</label>
          <input
            name="dietPref"
            value={profile.dietProfile.dietPref}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>

        <div>
          <label>Workout Style</label>
          <input
            name="workoutStyle"
            value={profile.dietProfile.workoutStyle}
            onChange={handleChange}
            readOnly={!editing}
          />
        </div>
      </form>
    </div>
  );
}
