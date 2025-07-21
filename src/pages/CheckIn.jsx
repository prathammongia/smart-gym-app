import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, set, remove, get, onValue } from "firebase/database";
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
      Other: 0,
    },
  });

  const isValidBodyPart = selectedBodyPart !== "";

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

  useEffect(() => {
    const checkInsRef = ref(db, "check-ins");

    const unsubscribe = onValue(checkInsRef, (snapshot) => {
      const data = snapshot.val() || {};
      let total = 0;
      const bodyPartsCount = {
        Chest: 0,
        Back: 0,
        Legs: 0,
        Arms: 0,
        Shoulders: 0,
        Core: 0,
        Other: 0,
      };

      Object.values(data).forEach((entry) => {
        total++;
        const part = entry.muscleGroup;
        if (bodyPartsCount[part] !== undefined) {
          bodyPartsCount[part]++;
        } else {
          bodyPartsCount.Other++;
        }
      });

      setGymData({
        peopleInGym: total,
        bodyParts: bodyPartsCount,
      });
    });

    return () => unsubscribe();
  }, []);

  const handleToggleChange = async (e) => {
    const checked = e.target.checked;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !isValidBodyPart) return;

    const uid = user.uid;
    setUserInGym(checked);

    if (checked) {
      const data = {
        uid,
        timestamp: Date.now(),
        muscleGroup: selectedBodyPart,
      };
      await set(ref(db, `check-ins/${uid}`), data);
      await set(ref(db, `check-ins-history/${Date.now()}-${uid}`), data);
    } else {
      await remove(ref(db, `check-ins/${uid}`));
      setSelectedBodyPart("");
    }
  };

  const handleBodyPartChange = (e) => {
    setSelectedBodyPart(e.target.value);
  };

  return (
    <div className="container">
      <h1>Gym Sync</h1>

      <label htmlFor="bodyPartSelect">Select Body Part Training Today:</label>
      <select
        id="bodyPartSelect"
        value={selectedBodyPart}
        onChange={handleBodyPartChange}
        disabled={userInGym}
      >
        <option value="">Select body part</option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Legs">Legs</option>
        <option value="Arms">Arms</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Core">Core</option>
        <option value="Other">Other</option>
      </select>

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
            disabled={!isValidBodyPart}
          />
          <span className="slider"></span>
        </label>
      </div>

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
