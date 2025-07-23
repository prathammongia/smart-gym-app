// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Home from './pages/Home';
// import CheckIn from './pages/CheckIn';
// import Profile from './pages/Profile';
// import Admin from './pages/Admin';
// import { getDatabase, ref, set } from "firebase/database";
// import { app } from "./firebase" 

// function App() {
//   return (
//     <Router>
//       <nav>
//         <Link to="/">Home</Link>
//         <Link to="/check-in">Check-In</Link>
//         <Link to="/profile">Profile</Link>
//         <Link to="/admin">Admin</Link>
//       </nav>

//       <div className="container">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/check-in" element={<CheckIn />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/admin" element={<Admin />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { app } from "./firebase"; // your initialized Firebase app

// import Home from './pages/Home';
// import CheckIn from './pages/CheckIn';
// import Profile from './pages/Profile';
// import Admin from './pages/Admin';
// import Login from './pages/Login';
// import Diet from './pages/Diet';

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const auth = getAuth(app); // Get the auth instance from Firebase app

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, [auth]);

//   if (loading) {
//     return <div style={{ color: "#0f0", textAlign: "center" }}>Loading...</div>;
//   }

//   return (
//     <Router>
//       {user && (
//         <nav>
//           <Link to="/">Home</Link>
//           <Link to="/check-in">Check-In</Link>
//           <Link to="/profile">Profile</Link>
//           <Link to="/admin">Admin</Link>
//           <Link to="/diet">Diet Plan</Link>
//         </nav>
//       )}

//       <div className="container">
//         <Routes>
//           <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
//           <Route path="/check-in" element={user ? <CheckIn /> : <Navigate to="/login" replace />} />
//           <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
//           <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" replace />} />
//           <Route path="/diet" element={user ? <Diet /> : <Navigate to="/login" replace />} />
//           <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "./firebase";

import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Diet from "./pages/Diet";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";
import CheckInHistory from "./pages/CheckInHistory"; // ✅ NEW

function NavigationBar({ onToggleProfile, role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <Link to="/" style={{ marginRight: "20px" }}>
        Home
      </Link>
      {role === "user" && (
        <>
          <Link to="/check-in" style={{ marginRight: "20px" }}>
            Check-In
          </Link>
          <Link to="/diet" style={{ marginRight: "20px" }}>
            Diet Plan
          </Link>
        </>
      )}
      {role === "admin" && (
        <Link to="/admin" style={{ marginRight: "20px" }}>
          Admin Dashboard
        </Link>
      )}

      <div style={{ marginLeft: "auto" }}>
        <button
          onClick={onToggleProfile}
          style={{
            background: "none",
            border: "none",
            color: "green",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

function AppContent({ user, role, showProfile, setShowProfile }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "480px",
        height: "100vh",
        margin: "0 auto",
        overflow: "hidden",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div
        className="main-container"
        style={{
          padding: "80px 20px 20px",
          height: "100%",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
            .main-container::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <Routes>
          <Route path="/" element={<Home />} />
          {role === "user" && (
            <>
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/diet" element={<Diet />} />
              <Route
                path="/check-in-history"
                element={<CheckInHistory />} // ✅ NEW
              />
            </>
          )}
          {role === "admin" && (
            <>
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/check-in-history"
                element={<CheckInHistory />} // ✅ Shared if admin wants access too
              />
            </>
          )}
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: showProfile ? 0 : "-100%",
          height: "100%",
          width: "80%",
          backgroundColor: "white",
          transition: "right 0.3s ease-in-out",
          zIndex: 2,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {role === "admin" ? (
          <AdminProfile
            onClose={() => setShowProfile(false)}
            onLogout={() => setShowProfile(false)}
          />
        ) : (
          <Profile
            onClose={() => setShowProfile(false)}
            onLogout={() => setShowProfile(false)}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const auth = getAuth(app);
  const db = getDatabase(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const roleRef = ref(db, `users/${currentUser.uid}/role`);
          const snapshot = await get(roleRef);
          setRole(snapshot.exists() ? snapshot.val() : "user");
        } catch {
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setShowProfile(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</div>;
  }

  return (
    <Router>
      {user ? (
        <>
          <NavigationBar
            onToggleProfile={() => setShowProfile((prev) => !prev)}
            role={role}
          />
          <AppContent
            user={user}
            role={role}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
          />
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
















// Converted from React Native to React Web (JSX)
// import React, { useEffect, useState } from 'react';
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';
// import { get, onValue, push, ref, remove, set } from 'firebase/database';
// import { auth, db } from './firebase';
// import "./App.css";
// export default function IndexScreen() {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [selectedRole, setSelectedRole] = useState('user');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [checkIns, setCheckIns] = useState([]);
//   const [users, setUsers] = useState({});
//   const [userCheckIns, setUserCheckIns] = useState([]);
//   const [userInGym, setUserInGym] = useState(false);
//   const [selectedBodyPart, setSelectedBodyPart] = useState('');
//   const [gymData, setGymData] = useState({
//     peopleInGym: 0,
//     bodyParts: {
//       Chest: 0,
//       Back: 0,
//       Legs: 0,
//       Arms: 0,
//       Shoulders: 0,
//       Core: 0,
//     },
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       setUser(firebaseUser);
//       if (!firebaseUser) {
//         setRole(null);
//         return;
//       }

//       const snapshot = await get(ref(db, `users/${firebaseUser.uid}`));
//       const data = snapshot.val();
//       setRole(data?.role);

//       if (data?.role === 'user') {
//         loadUserCheckIns(firebaseUser.uid);
//         checkUserStatus(firebaseUser.uid);
//         subscribeToGymData();
//       } else if (data?.role === 'admin') {
//         loadAdminData();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const loadUserCheckIns = (uid) => {
//     const historyRef = ref(db, 'check-ins-history');
//     onValue(historyRef, (snapshot) => {
//       const now = Date.now();
//       const data = snapshot.val() || {};
//       const entries = Object.entries(data)
//         .filter(([id, entry]) => entry.uid === uid && now - entry.timestamp < 7 * 24 * 60 * 60 * 1000)
//         .map(([id, entry]) => ({ id, ...entry }))
//         .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
//       setUserCheckIns(entries);
//     });
//   };

//   const checkUserStatus = async (uid) => {
//     const snapshot = await get(ref(db, `check-ins/${uid}`));
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       setUserInGym(true);
//       setSelectedBodyPart(data.muscleGroup || '');
//     } else {
//       setUserInGym(false);
//     }
//   };

//   const subscribeToGymData = () => {
//     const checkInsRef = ref(db, 'check-ins');
//     onValue(checkInsRef, (snapshot) => {
//       const data = snapshot.val() || {};
//       const newBodyParts = {
//         Chest: 0,
//         Back: 0,
//         Legs: 0,
//         Arms: 0,
//         Shoulders: 0,
//         Core: 0,
//       };
//       let total = 0;
//       Object.values(data).forEach((entry) => {
//         total++;
//         const part = entry.muscleGroup;
//         if (newBodyParts[part] !== undefined) newBodyParts[part]++;
//       });
//       setGymData({ peopleInGym: total, bodyParts: newBodyParts });
//     });
//   };

//   const loadAdminData = () => {
//     onValue(ref(db, 'check-ins'), (snapshot) => {
//       const data = snapshot.val();
//       const entries = Object.entries(data || {}).map(([id, entry]) => ({ id, ...entry }));
//       setCheckIns(entries.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)));
//     });
//     onValue(ref(db, 'users'), (snapshot) => {
//       setUsers(snapshot.val() || {});
//     });
//   };

//   const handleToggleChange = async (checked) => {
//     if (!user) return;
//     const uid = user.uid;
//     if (checked && selectedBodyPart === '') {
//       alert('Please select a body part before checking in.');
//       return;
//     }
//     setUserInGym(checked);
//     if (checked) {
//       const data = { uid, timestamp: Date.now(), muscleGroup: selectedBodyPart };
//       await set(ref(db, `check-ins/${uid}`), data);
//       await push(ref(db, 'check-ins-history'), data);
//     } else {
//       await remove(ref(db, `check-ins/${uid}`));
//       setSelectedBodyPart('');
//     }
//   };

//   const handleBodyPartChange = async (e) => {
//     const part = e.target.value;
//     setSelectedBodyPart(part);
//     if (!userInGym || !user) return;
//     const data = { uid: user.uid, timestamp: Date.now(), muscleGroup: part };
//     await set(ref(db, `check-ins/${user.uid}`), data);
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setRole(null);
//   };

//   const handleAuth = async () => {
//     try {
//       if (isRegistering) {
//         const cred = await createUserWithEmailAndPassword(auth, email, password);
//         await set(ref(db, `users/${cred.user.uid}`), {
//           name,
//           age,
//           role: selectedRole,
//           email,
//         });
//         alert('Registered successfully!');
//       } else {
//         const cred = await signInWithEmailAndPassword(auth, email, password);
//         const snapshot = await get(ref(db, `users/${cred.user.uid}`));
//         const data = snapshot.val();
//         setRole(data?.role);
//       }
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (!user) {
//     return (
//       <div style={{ padding: 40, maxWidth: 400, margin: 'auto' }}>
//         <h2>🏋️ Welcome to Smart Gym</h2>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/>
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br/>
//         {isRegistering && (
//           <>
//             <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br/>
//             <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} /><br/>
//             <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </>
//         )}<br/>
//         <button onClick={handleAuth}>{isRegistering ? 'Register' : 'Login'}</button>
//         <p onClick={() => setIsRegistering(!isRegistering)} style={{ color: 'blue', cursor: 'pointer' }}>
//           {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
//         </p>
//       </div>
//     );
//   }

//   if (role === 'user') {
//     return (
//       <div style={{ padding: 40 }}>
//         <h2>👤 Profile</h2>
//         <p>Email: {user.email}</p>
//         <p>Last Login: {user.metadata?.lastSignInTime}</p>

//         <h3>Check-In History</h3>
//         <ul>
//           {userCheckIns.map((item) => (
//             <li key={item.id}>{item.muscleGroup} - {new Date(item.timestamp ?? 0).toLocaleString()}</li>
//           ))}
//         </ul>

//         <h3>🏋️ Gym Check-In</h3>
//         <label>
//           In Gym:
//           <input type="checkbox" checked={userInGym} onChange={(e) => handleToggleChange(e.target.checked)} />
//         </label>
//         <br/>
//         <select value={selectedBodyPart} onChange={handleBodyPartChange} disabled={userInGym}>
//           <option value="">Select body part</option>
//           {['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'].map((part) => (
//             <option key={part} value={part}>{part}</option>
//           ))}
//         </select>
//         <p>People in Gym: {gymData.peopleInGym}</p>
//         {Object.entries(gymData.bodyParts).map(([key, val]) => (
//           <p key={key}>{key}: {val}</p>
//         ))}
//         <button onClick={handleLogout}>🚪 Logout</button>
//       </div>
//     );
//   }

//   if (role === 'admin') {
//     return (
//       <div style={{ padding: 40 }}>
//         <h2>🔐 Admin Dashboard</h2>
//         <ul>
//           {checkIns.map((item) => (
//             <li key={item.id}>
//               {users[item.uid]?.name ?? 'Unknown'} - {item.muscleGroup} - {new Date(item.timestamp ?? 0).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//         <button onClick={handleLogout}>🚪 Logout</button>
//       </div>
//     );
//   }

//   return null;
// }
