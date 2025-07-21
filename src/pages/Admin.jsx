




import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function Admin() {
  const [checkIns, setCheckIns] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    // Listen to 'check-ins'
    const checkInsRef = ref(db, "check-ins");
    const unsubscribeCheckIns = onValue(checkInsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([id, details]) => ({
          id,
          ...details,
        }));
        // Sort newest first
        const sorted = entries.sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        );
        setCheckIns(sorted);
      } else {
        setCheckIns([]);
      }
    });

    // Listen to 'users' database
    const usersRef = ref(db, "users");
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(data);
    });

    return () => {
      unsubscribeCheckIns();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {checkIns.length === 0 ? (
        <p>No check-ins found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Muscle Group</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {checkIns.map((entry) => {
              const name = entry.uid && users[entry.uid]?.name
                ? users[entry.uid].name
                : "Unknown";

              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{name}</td>
                  <td className="p-2 border">{entry.muscleGroup || "N/A"}</td>
                  <td className="p-2 border">
                    {entry.timestamp
                      ? new Date(entry.timestamp).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
