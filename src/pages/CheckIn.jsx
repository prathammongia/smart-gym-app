// import React, { useState } from "react";
// import { db } from "../firebase";
// import { ref, push } from "firebase/database";
// import './CheckIn.css';

// function CheckIn() {
//   const [name, setName] = useState("");
//   const [muscleGroup, setMuscleGroup] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleCheckIn = () => {
//     if (!name || !muscleGroup) {
//       setSuccessMessage("Please fill in all fields.");
//       return;
//     }

//     const checkInRef = ref(db, "check-ins");
//     push(checkInRef, {
//       name,
//       muscleGroup,
//       timestamp: Date.now(),
//     });

//     setSuccessMessage("✅ Checked in successfully!");
//     setName("");
//     setMuscleGroup("");
//   };

//   return (
//     <div className="checkin-container">
//       <h1 className="checkin-title">Gym Check-In</h1>

//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="checkin-input"
//       />

//       <select
//         value={muscleGroup}
//         onChange={(e) => setMuscleGroup(e.target.value)}
//         className="checkin-select"
//       >
//         <option value="">Select Muscle Group</option>
//         <option value="Chest">Chest</option>
//         <option value="Back">Back</option>
//         <option value="Legs">Legs</option>
//         <option value="Arms">Arms</option>
//         <option value="Shoulders">Shoulders</option>
//         <option value="Core">Core</option>
//       </select>

//       <button onClick={handleCheckIn} className="circle-button">
//         Check In
//       </button>

//       {/* ✅ Success or error message */}
//       {successMessage && (
//         <p className="checkin-message">{successMessage}</p>
//       )}
//     </div>
//   );
// }

// export default CheckIn;



import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";
import './CheckIn.css';

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
      Core: 0
    }
  });

  const handleToggleChange = (e) => {
    const checked = e.target.checked;
    setUserInGym(checked);

    if (checked) {
      // ✅ User is checking in
      setGymData(prev => ({
        ...prev,
        peopleInGym: prev.peopleInGym + 1
      }));

      push(ref(db, 'check-ins'), {
        timestamp: Date.now(),
        action: 'check-in',
        muscleGroup: selectedBodyPart || null
      });
    } else {
      // ✅ User is checking out
      setGymData(prev => ({
        ...prev,
        peopleInGym: prev.peopleInGym - 1,
        bodyParts: {
          ...prev.bodyParts,
          [selectedBodyPart]: selectedBodyPart
            ? prev.bodyParts[selectedBodyPart] - 1
            : 0
        }
      }));

      push(ref(db, 'check-ins'), {
        timestamp: Date.now(),
        action: 'check-out',
        muscleGroup: selectedBodyPart || null
      });

      setSelectedBodyPart("");
    }
  };

  const handleBodyPartChange = (e) => {
    const newPart = e.target.value;

    // Adjust the distribution
    if (selectedBodyPart) {
      setGymData(prev => ({
        ...prev,
        bodyParts: {
          ...prev.bodyParts,
          [selectedBodyPart]: prev.bodyParts[selectedBodyPart] - 1
        }
      }));
    }

    setGymData(prev => ({
      ...prev,
      bodyParts: {
        ...prev.bodyParts,
        [newPart]: prev.bodyParts[newPart] + 1
      }
    }));

    setSelectedBodyPart(newPart);

    // ✅ Record muscle group change
    push(ref(db, 'check-ins'), {
      timestamp: Date.now(),
      action: 'select-body-part',
      muscleGroup: newPart
    });
  };

  return (
    <div className="container">
      <h1>Gym Sync</h1>

      <div className="toggle-container">
        <label className="toggle-label" htmlFor="inGymToggle">In Gym</label>
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
        <p>People in Gym: <span id="peopleCount">{gymData.peopleInGym}</span></p>
        <p>Body Part Distribution:</p>
        <ul id="bodyPartList">
          {Object.entries(gymData.bodyParts).map(([part, count]) => (
            <li key={part}>{part}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CheckIn;
