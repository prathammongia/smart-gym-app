import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./CheckInHistory.css";

export default function CheckInHistory() {
  const [history, setHistory] = useState([]);
  const [animate, setAnimate] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const loadHistory = async () => {
    if (!user) return;
    const db = getDatabase();
    const historyRef = ref(db, "check-ins-history");

    try {
      const snapshot = await get(historyRef);
      const data = snapshot.val();

      if (!data) {
        setHistory([]);
        return;
      }

      const now = Date.now();
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      const recentHistory = [];
      const oldKeysToDelete = [];

      Object.entries(data).forEach(([id, entry]) => {
        if (entry.uid === user.uid) {
          if (entry.timestamp >= fiveMinutesAgo) {
            recentHistory.push({ id, ...entry });
          } else {
            oldKeysToDelete.push(id);
          }
        }
      });

      recentHistory.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(recentHistory);

      oldKeysToDelete.forEach((key) => {
        remove(ref(db, `check-ins-history/${key}`));
      });
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  useEffect(() => {
    loadHistory();
    setAnimate(true); // Trigger the slide animation
    const interval = setInterval(loadHistory, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className={`checkin-slide-wrapper ${animate ? "slide-in" : ""}`}>
      <div className="checkin-history-container">
        <h1 className="checkin-history-title">📋 Check-In History</h1>

        {history.length === 0 ? (
          <p className="checkin-history-empty">No recent check-ins found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="checkin-history-table">
              <thead>
                <tr>
                  <th>Muscle Group</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.muscleGroup || "N/A"}</td>
                    <td>
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
