



// import React, { useState } from "react";
// import { db } from "../firebase";
// import { ref, push } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import './CheckIn.css';

// function CheckIn() {
//   const [userInGym, setUserInGym] = useState(false);
//   const [selectedBodyPart, setSelectedBodyPart] = useState("");
//   const [gymData, setGymData] = useState({
//     peopleInGym: 0,
//     bodyParts: {
//       Chest: 0,
//       Back: 0,
//       Legs: 0,
//       Arms: 0,
//       Shoulders: 0,
//       Core: 0
//     }
//   });

//   const handleToggleChange = (e) => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return alert("User not logged in");

//     const uid = user.uid;
//     const checked = e.target.checked;
//     setUserInGym(checked);

//     const data = {
//       uid,
//       timestamp: Date.now(),
//       action: checked ? 'check-in' : 'check-out',
//       muscleGroup: selectedBodyPart || null,
//     };

//     if (checked) {
//       setGymData(prev => ({
//         ...prev,
//         peopleInGym: prev.peopleInGym + 1
//       }));
//     } else {
//       setGymData(prev => ({
//         ...prev,
//         peopleInGym: prev.peopleInGym - 1,
//         bodyParts: {
//           ...prev.bodyParts,
//           [selectedBodyPart]: selectedBodyPart
//             ? prev.bodyParts[selectedBodyPart] - 1
//             : 0
//         }
//       }));
//       setSelectedBodyPart("");
//     }

//     push(ref(db, 'check-ins'), data);
//   };

//   const handleBodyPartChange = (e) => {
//     const newPart = e.target.value;
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return alert("User not logged in");

//     const uid = user.uid;

//     if (selectedBodyPart) {
//       setGymData(prev => ({
//         ...prev,
//         bodyParts: {
//           ...prev.bodyParts,
//           [selectedBodyPart]: prev.bodyParts[selectedBodyPart] - 1
//         }
//       }));
//     }

//     setGymData(prev => ({
//       ...prev,
//       bodyParts: {
//         ...prev.bodyParts,
//         [newPart]: prev.bodyParts[newPart] + 1
//       }
//     }));

//     setSelectedBodyPart(newPart);

//     push(ref(db, 'check-ins'), {
//       uid,
//       timestamp: Date.now(),
//       action: 'select-body-part',
//       muscleGroup: newPart
//     });
//   };

//   return (
//     <div className="container">
//       <h1>Gym Sync</h1>

//       <div className="toggle-container">
//         <label className="toggle-label" htmlFor="inGymToggle">In Gym</label>
//         <label className="toggle-switch">
//           <input
//             type="checkbox"
//             id="inGymToggle"
//             checked={userInGym}
//             onChange={handleToggleChange}
//           />
//           <span className="slider"></span>
//         </label>
//       </div>

//       <label htmlFor="bodyPartSelect">Select Body Part Training Today:</label>
//       <select
//         id="bodyPartSelect"
//         disabled={!userInGym}
//         value={selectedBodyPart}
//         onChange={handleBodyPartChange}
//       >
//         <option value="">Select body part</option>
//         <option value="Chest">Chest</option>
//         <option value="Back">Back</option>
//         <option value="Legs">Legs</option>
//         <option value="Arms">Arms</option>
//         <option value="Shoulders">Shoulders</option>
//         <option value="Core">Core</option>
//       </select>

//       <div className="info" id="gymInfo">
//         <h3>Current Gym Status</h3>
//         <p>People in Gym: <span id="peopleCount">{gymData.peopleInGym}</span></p>
//         <p>Body Part Distribution:</p>
//         <ul id="bodyPartList">
//           {Object.entries(gymData.bodyParts).map(([part, count]) => (
//             <li key={part}>{part}: {count}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default CheckIn;




import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, set, remove, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./CheckIn.css";

function CheckIn() {
  const [userInGym, setUserInGym] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [gymData, setGymData] = useState({
    peopleInGym: 0,
    bodyParts: {
      Chest: 0,
      Back: 0,
      Legs: 0,
      Arms: 0,
      Shoulders: 0,
      Core: 0,
    },
  });

  // ✅ Check if user is already checked in
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const checkInRef = ref(db, `check-ins/${user.uid}`);
    get(checkInRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserInGym(true);
        setSelectedBodyPart(data.muscleGroup || "");
      } else {
        setUserInGym(false);
      }
    });
  }, []);

  const handleToggleChange = async (e) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    const uid = user.uid;
    const checked = e.target.checked;
    setUserInGym(checked);

    if (checked) {
      // ✅ Check-In
      const data = {
        uid,
        timestamp: Date.now(),
        muscleGroup: selectedBodyPart || null,
      };
      await set(ref(db, `check-ins/${uid}`), data);
    } else {
      // ✅ Check-Out
      await remove(ref(db, `check-ins/${uid}`));
      setSelectedBodyPart("");
    }
  };

  const handleBodyPartChange = async (e) => {
    const newPart = e.target.value;
    setSelectedBodyPart(newPart);

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const uid = user.uid;

    // ✅ Update existing check-in record with new muscle group
    const data = {
      uid,
      timestamp: Date.now(),
      muscleGroup: newPart,
    };
    await set(ref(db, `check-ins/${uid}`), data);
  };

  return (
    <div className="container">
      <h1>Gym Sync</h1>

      <div className="toggle-container">
        <label className="toggle-label" htmlFor="inGymToggle">
          In Gym
        </label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            id="inGymToggle"
            checked={userInGym}
            onChange={handleToggleChange}
          />
          <span className="slider"></span>
        </label>
      </div>

      <label htmlFor="bodyPartSelect">Select Body Part Training Today:</label>
      <select
        id="bodyPartSelect"
        disabled={!userInGym}
        value={selectedBodyPart}
        onChange={handleBodyPartChange}
      >
        <option value="">Select body part</option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Legs">Legs</option>
        <option value="Arms">Arms</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Core">Core</option>
      </select>

      <div className="info" id="gymInfo">
        <h3>Current Gym Status</h3>
        <p>
          People in Gym: <span id="peopleCount">{gymData.peopleInGym}</span>
        </p>
        <p>Body Part Distribution:</p>
        <ul id="bodyPartList">
          {Object.entries(gymData.bodyParts).map(([part, count]) => (
            <li key={part}>
              {part}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CheckIn;
