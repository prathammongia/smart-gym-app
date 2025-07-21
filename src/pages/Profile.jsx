import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const [userCheckIns, setUserCheckIns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const user = auth.currentUser;

    if (!user) return;

    const userRef = ref(db, `users/${user.uid}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setIsAdmin(data?.role === "admin");
    });

    const checkInsRef = ref(db, "check-ins-history");

    const cleanupAndLoad = () => {
      onValue(
        checkInsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            setUserCheckIns([]);
            return;
          }

          const now = Date.now();
          const fiveMinutesAgo = now - 5 * 60 * 1000;
          const filtered = [];

          Object.entries(data).forEach(([id, details]) => {
            const { timestamp = 0, uid } = details;

            if (timestamp <= fiveMinutesAgo) {
              remove(ref(db, `check-ins-history/${id}`));
              return;
            }

            if (uid === user.uid && timestamp > fiveMinutesAgo) {
              filtered.push({ id, ...details });
            }
          });

          filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setUserCheckIns(filtered);
        },
        { onlyOnce: true }
      );
    };

    cleanupAndLoad();
    const interval = setInterval(cleanupAndLoad, 30000); // refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

      <div className="mb-4">
        <p><strong>Email:</strong> {getAuth().currentUser?.email}</p>
        <p><strong>UID:</strong> {getAuth().currentUser?.uid}</p>
        <p>
          <strong>Last Login:</strong>{" "}
          {getAuth().currentUser?.metadata?.lastSignInTime}
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Check-In History (Last 5 Minutes)
      </h2>

      {userCheckIns.length === 0 ? (
        <p className="italic text-gray-600">No recent check-ins.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">Muscle Group</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {userCheckIns.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.muscleGroup || "N/A"}</td>
                <td className="p-2">
                  {item.timestamp
                    ? new Date(item.timestamp).toLocaleString()
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
