// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { app } from "../firebase";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import {
//   getDatabase,
//   ref,
//   set,
//   get
// } from "firebase/database";
// import "./Login.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [error, setError] = useState("");
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [weight, setWeight] = useState("");
//   const [role, setRole] = useState("user");

//   const navigate = useNavigate();
//   const auth = getAuth(app);
//   const db = getDatabase(app);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (isRegistering) {
//         // Register
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Save additional info
//         await set(ref(db, `users/${user.uid}`), {
//           name,
//           age,
//           weight,
//           role,
//           email,
//         });

//         // Redirect after registration
//         if (role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/");
//         }

//       } else {
//         // Login
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Get user role from database
//         const snapshot = await get(ref(db, `users/${user.uid}`));
//         const userData = snapshot.val();

//         if (userData?.role === "admin") {
//           navigate("/admin");
//         } else {
//           navigate("/");
//         }
//       }

//     } catch (err) {
//       console.error(err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>{isRegistering ? "Create Account" : "Login"}</h2>
//       <form onSubmit={handleSubmit}>

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {isRegistering && (
//           <>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />

//             <input
//               type="number"
//               placeholder="Age"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//               required
//             />

//             <input
//               type="number"
//               placeholder="Weight"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//               required
//             />

//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               required
//             >
//               <option value="">Select Role</option>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </>
//         )}

//         {error && <p className="error">{error}</p>}

//         <button type="submit">
//           {isRegistering ? "Register" : "Login"}
//         </button>
//       </form>

//       <p>
//         {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
//         <button
//           onClick={() => {
//             setIsRegistering(!isRegistering);
//             setError("");
//           }}
//         >
//           {isRegistering ? "Login" : "Register"}
//         </button>
//       </p>
//     </div>
//   );
// }

// export default Login;


// src/pages/Login.jsx
// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [role, setRole] = useState("user");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [dietPref, setDietPref] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const steps = [
    {
      key: "auth",
      content: (
        <>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </>
      ),
    },
    {
      key: "profile",
      content: (
        <>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </>
      ),
    },
    {
      key: "role",
      content: (
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      key: "goal",
      content: (
        <select value={goal} onChange={(e) => setGoal(e.target.value)} required>
          <option value="">Your Goal</option>
          <option value="Build Muscle">Build Muscle</option>
          <option value="Lose Fat">Lose Fat</option>
          <option value="Improve Endurance">Improve Endurance</option>
        </select>
      ),
    },
    {
      key: "level",
      content: (
        <select value={level} onChange={(e) => setLevel(e.target.value)} required>
          <option value="">Fitness Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      ),
    },
    {
      key: "gender",
      content: (
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-Binary">Non-Binary</option>
        </select>
      ),
    },
    {
      key: "dietPref",
      content: (
        <select value={dietPref} onChange={(e) => setDietPref(e.target.value)} required>
          <option value="">Dietary Preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
        </select>
      ),
    },
    {
      key: "workoutStyle",
      content: (
        <select value={workoutStyle} onChange={(e) => setWorkoutStyle(e.target.value)} required>
          <option value="">Workout Style</option>
          <option value="Gym-Based">Gym-Based</option>
          <option value="Home Workout">Home Workout</option>
          <option value="Cardio-Focused">Cardio-Focused</option>
          <option value="Strength Training">Strength Training</option>
        </select>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        if (!email || !password || !name || !age || !weight || !role || !goal || !level || !gender || !dietPref || !workoutStyle) {
          setError("Please complete all fields before submitting.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, `users/${user.uid}`), {
          name,
          age,
          weight,
          role,
          email,
          dietProfile: { goal, level, gender, dietPref, workoutStyle },
        });

        navigate(role === "admin" ? "/admin" : "/");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const snapshot = await get(ref(db, `users/${user.uid}`));
        const userData = snapshot.val();

        if (!userData) {
          setError("User profile not found in database.");
          return;
        }

        navigate(userData.role === "admin" ? "/admin" : "/");
      }
    } catch (err) {
      console.error("Login/Register Error:", err);
      setError("Authentication failed. Please check your credentials or try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? "Create Account" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {!isRegistering ? (
            <>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Login</button>
            </>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[step].key}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="slide-step"
                >
                  {steps[step].content}
                </motion.div>
              </AnimatePresence>

              <div className="step-buttons">
                {step > 0 && <button type="button" onClick={() => setStep(step - 1)}>⬅ Back</button>}
                {step < steps.length - 1 ? (
                  <button type="button" onClick={() => setStep(step + 1)}>Next ➡</button>
                ) : (
                  <button type="submit">Register</button>
                )}
              </div>
            </>
          )}
          {error && <p className="error">{error}</p>}
        </form>

        <p className="switch-mode">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setStep(0);
              setError("");
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
