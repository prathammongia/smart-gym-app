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

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Diet from './pages/Diet'; // ✅ New import

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/check-in">Check-In</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/diet">Diet Plan</Link> {/* ✅ New link */}
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/diet" element={<Diet />} /> {/* ✅ New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


