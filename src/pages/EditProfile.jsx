import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import "./Profile.css";

export default function EditProfile() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [dietPref, setDietPref] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const snapshot = await get(ref(db, `users/${user.uid}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setAge(userData.age || "");
          setWeight(userData.weight || "");
          setRole(userData.role || "");

          const diet = userData.dietProfile || {};
          setGoal(diet.goal || "");
          setLevel(diet.level || "");
          setGender(diet.gender || "");
          setDietPref(diet.dietPref || "");
          setWorkoutStyle(diet.workoutStyle || "");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const updatedProfile = {
      name,
      email,
      age,
      weight,
      role, // preserve role
      dietProfile: {
        goal,
        level,
        gender,
        dietPref,
        workoutStyle,
      },
    };

    try {
      await set(ref(db, `users/${userId}`), updatedProfile);
      setSuccessMessage("✅ Profile saved successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="profile-header">
        <h2>✏️ Edit Profile</h2>
        <button onClick={handleSave} className="profile-btn save-btn">
          <Save size={16} />
          Save
        </button>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form className="profile-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            readOnly
          />
        </div>

        <div className="form-group">
          <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
            <option value="">Your Goal</option>
            <option value="Build Muscle">Build Muscle</option>
            <option value="Lose Fat">Lose Fat</option>
            <option value="Improve Endurance">Improve Endurance</option>
          </select>
        </div>

        <div className="form-group">
          <select value={level} onChange={(e) => setLevel(e.target.value)} required>
            <option value="">Fitness Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>

        <div className="form-group">
          <select value={dietPref} onChange={(e) => setDietPref(e.target.value)} required>
            <option value="">Dietary Preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
          </select>
        </div>

        <div className="form-group">
          <select value={workoutStyle} onChange={(e) => setWorkoutStyle(e.target.value)} required>
            <option value="">Workout Style</option>
            <option value="Gym-Based">Gym-Based</option>
            <option value="Home Workout">Home Workout</option>
            <option value="Cardio-Focused">Cardio-Focused</option>
            <option value="Strength Training">Strength Training</option>
          </select>
        </div>
      </form>
    </motion.div>
  );
}
