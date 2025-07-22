import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, set, remove, get, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./CheckIn.css";

function CheckIn() {
  const [userInGym, setUserInGym] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [customBodyPart, setCustomBodyPart] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [prevMuscleGroup, setPrevMuscleGroup] = useState(""); // track for updates

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
      "Not Specified": 0,
    },
  });

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const checkInRef = ref(db, `check-ins/${user.uid}`);
    get(checkInRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserInGym(true);
        setPrevMuscleGroup(data.muscleGroup || "Not Specified");

        if (
          ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core"].includes(
            data.muscleGroup
          )
        ) {
          setSelectedBodyPart(data.muscleGroup);
        } else if (data.muscleGroup) {
          setSelectedBodyPart("Other");
          setCustomBodyPart(data.muscleGroup);
        }
      } else {
        setUserInGym(false);
      }
    });
  }, [user]);

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
        "Not Specified": 0,
      };

      Object.values(data).forEach((entry) => {
        total++;
        const part = entry.muscleGroup;
        if (bodyPartsCount[part] !== undefined) {
          bodyPartsCount[part]++;
        } else if (!part) {
          bodyPartsCount["Not Specified"]++;
        } else {
          bodyPartsCount["Other"]++;
        }
      });

      setGymData({
        peopleInGym: total,
        bodyParts: bodyPartsCount,
      });
    });

    return () => unsubscribe();
  }, []);

  // 🔁 Update DB if muscle group changes after toggle
  useEffect(() => {
    const updateMuscleGroup = async () => {
      if (!user || !userInGym) return;

      let muscleGroup = "Not Specified";

      if (selectedBodyPart === "Other" && customBodyPart) {
        muscleGroup = customBodyPart.trim();
      } else if (
        ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core"].includes(
          selectedBodyPart
        )
      ) {
        muscleGroup = selectedBodyPart;
      }

      // Prevent unnecessary DB update
      if (muscleGroup === prevMuscleGroup) return;

      const data = {
        uid: user.uid,
        timestamp: Date.now(),
        muscleGroup,
      };

      await set(ref(db, `check-ins/${user.uid}`), data);
      await set(
        ref(db, `check-ins-history/${Date.now()}-${user.uid}`),
        data
      );

      setPrevMuscleGroup(muscleGroup); // update tracker
    };

    updateMuscleGroup();
  }, [selectedBodyPart, customBodyPart, userInGym]);

  const handleToggleChange = async (e) => {
    const checked = e.target.checked;
    if (!user) return;

    setUserInGym(checked);

    if (checked) {
      // Temporarily set "Not Specified" until user picks a part
      const data = {
        uid: user.uid,
        timestamp: Date.now(),
        muscleGroup: "Not Specified",
      };
      await set(ref(db, `check-ins/${user.uid}`), data);
      await set(
        ref(db, `check-ins-history/${Date.now()}-${user.uid}`),
        data
      );
      setPrevMuscleGroup("Not Specified");
    } else {
      await remove(ref(db, `check-ins/${user.uid}`));
      setSelectedBodyPart("");
      setCustomBodyPart("");
      setPrevMuscleGroup("");
    }
  };

  const handleBodyPartChange = (e) => {
    const newPart = e.target.value;
    setSelectedBodyPart(newPart);
    if (newPart === "Other") {
      setShowModal(true);
    }
  };

  const submitCustomBodyPart = () => {
    if (!customBodyPart.trim()) return;
    setShowModal(false);
    // `customBodyPart` already being listened in useEffect above
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
        value={selectedBodyPart}
        onChange={handleBodyPartChange}
        disabled={!userInGym}
      >
        <option value="">-- Not Selected --</option>
        <option value="Chest">Chest</option>
        <option value="Back">Back</option>
        <option value="Legs">Legs</option>
        <option value="Arms">Arms</option>
        <option value="Shoulders">Shoulders</option>
        <option value="Core">Core</option>
        <option value="Other">Other</option>
      </select>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Custom Body Part</h2>
            <input
              type="text"
              value={customBodyPart}
              onChange={(e) => setCustomBodyPart(e.target.value)}
              placeholder="e.g. Cardio, Stretching"
            />
            <button onClick={submitCustomBodyPart}>Submit</button>
          </div>
        </div>
      )}

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
