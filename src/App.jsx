import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "./firebase";
import { AnimatePresence, motion } from "framer-motion";

// Pages
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Diet from "./pages/Diet";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";
import CheckInHistory from "./pages/CheckInHistory";
import EditProfile from "./pages/EditProfile";

// Navigation
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
      <Link to="/" style={{ marginRight: "20px" }}>Home</Link>

      {role === "user" && (
        <>
          <Link to="/check-in" style={{ marginRight: "20px" }}>Check-In</Link>
          <Link to="/diet" style={{ marginRight: "20px" }}>Diet Plan</Link>
        </>
      )}

      {role === "admin" && (
        <Link to="/admin" style={{ marginRight: "20px" }}>Admin Dashboard</Link>
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

// Main App Content with Sliding Transitions
function AppContent({ user, role, showProfile, setShowProfile }) {
  const location = useLocation();

  // ✅ Auto-close profile panel on route change
  useEffect(() => {
    setShowProfile(false);
  }, [location.pathname]);

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

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              {role === "user" && (
                <>
                  <Route path="/check-in" element={<CheckIn />} />
                  <Route path="/diet" element={<Diet />} />
                  <Route path="/CheckInHistory" element={<CheckInHistory />} />
                  <Route path="/EditProfile" element={<EditProfile />} />
                </>
              )}
              {role === "admin" && (
                <>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/CheckInHistory" element={<CheckInHistory />} />
                </>
              )}
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide-out Profile Panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: showProfile ? 0 : "-100%",
          height: "100%",
          width: "80%",
          backgroundColor: "white",
          transition: "right 0.25s ease-in-out",
          zIndex: 2,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
        }}
      >
        {role === "admin" ? (
          <AdminProfile onClose={() => setShowProfile(false)} />
        ) : (
          <Profile onClose={() => setShowProfile(false)} />
        )}
      </div>
    </div>
  );
}

// App Root
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
