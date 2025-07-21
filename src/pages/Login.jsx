// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { app } from "../firebase";
// // import {
// //   getAuth,
// //   signInWithEmailAndPassword,
// //   createUserWithEmailAndPassword,
// // } from "firebase/auth";  // <-- change this line to "firebase/auth"

// // import "./Login.css";

// // function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [isRegistering, setIsRegistering] = useState(false);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   // Get the auth instance from your app
// //   const auth = getAuth(app);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     try {
// //       if (isRegistering) {
// //         await createUserWithEmailAndPassword(auth, email, password);
// //       } else {
// //         await signInWithEmailAndPassword(auth, email, password);
// //       }
// //       navigate("/");
// //     } catch (err) {
// //       console.error(err.message);
// //       setError(err.message);
// //     }
// //   };

// //   return (
// //     <div className="login-container">
// //       <h2>{isRegistering ? "Create Account" : "Login"}</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />

// //         {error && <p className="error">{error}</p>}

// //         <button type="submit">
// //           {isRegistering ? "Register" : "Login"}
// //         </button>
// //       </form>

// //       <p>
// //         {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
// //         <button
// //           onClick={() => {
// //             setIsRegistering(!isRegistering);
// //             setError("");
// //           }}
// //         >
// //           {isRegistering ? "Login" : "Register"}
// //         </button>
// //       </p>
// //     </div>
// //   );
// // }

// // export default Login;



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { app, db } from "../firebase";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
// import { ref, set } from "firebase/database";
// import "./Login.css";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [error, setError] = useState("");

//   // Extra registration fields
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [weight, setWeight] = useState("");

//   const navigate = useNavigate();
//   const auth = getAuth(app);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (isRegistering) {
//         // Register user with email and password
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//         // Save extra user info in Realtime Database under 'users/{uid}'
//         await set(ref(db, "users/" + userCredential.user.uid), {
//           name,
//           age,
//           weight,
//           email,
//           createdAt: new Date().toISOString(),
//         });
//       } else {
//         // Login existing user
//         await signInWithEmailAndPassword(auth, email, password);
//       }
//       navigate("/");
//     } catch (err) {
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

//         {/* Show these fields only during registration */}
//         {isRegistering && (
//           <>
//             <input
//               type="text"
//               placeholder="Name"
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
//               min={1}
//             />
//             <input
//               type="number"
//               placeholder="Weight (kg)"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//               required
//               min={1}
//             />
//           </>
//         )}

//         {error && <p className="error">{error}</p>}

//         <button type="submit">{isRegistering ? "Register" : "Login"}</button>
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
  get
} from "firebase/database";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getDatabase(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional info
        await set(ref(db, `users/${user.uid}`), {
          name,
          age,
          weight,
          role,
          email,
        });

        // Redirect after registration
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      } else {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user role from database
        const snapshot = await get(ref(db, `users/${user.uid}`));
        const userData = snapshot.val();

        if (userData?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }

    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <p>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError("");
          }}
        >
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
