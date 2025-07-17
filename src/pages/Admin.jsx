// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function AdminDashboard() {
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    const checkInsRef = ref(db, "check-ins");

    const unsubscribe = onValue(checkInsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data).map(([id, details]) => ({
          id,
          ...details,
        }));

        // Sort by newest first
        const sorted = entries.sort(
          (a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)
        );

        setCheckIns(sorted);
      } else {
        setCheckIns([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
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
            {checkIns.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="p-2 border">{entry.name}</td>
                <td className="p-2 border">{entry.muscleGroup}</td>
                <td className="p-2 border">
                  {entry.timestamp
                    ? new Date(entry.timestamp).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
