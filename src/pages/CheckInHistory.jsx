// // src/pages/CheckInHistory.jsx
// import React, { useEffect, useState } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { getAuth } from "firebase/auth";

// export default function CheckInHistory() {
//   const [history, setHistory] = useState([]);
//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     if (!user) return;
//     const db = getDatabase();
//     const historyRef = ref(db, "check-ins-history");

//     onValue(historyRef, (snapshot) => {
//       const data = snapshot.val();
//       if (!data) {
//         setHistory([]);
//         return;
//       }

//       const userHistory = Object.entries(data)
//         .filter(([_, value]) => value.uid === user.uid)
//         .map(([id, value]) => ({ id, ...value }))
//         .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

//       setHistory(userHistory);
//     });
//   }, [user]);

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-4">📋 Full Check-In History</h1>

//       {history.length === 0 ? (
//         <p className="italic text-gray-600">No check-in records found.</p>
//       ) : (
//         <table className="w-full text-left border">
//           <thead>
//             <tr className="border-b bg-gray-100">
//               <th className="p-2">Muscle Group</th>
//               <th className="p-2">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="p-2">{item.muscleGroup || "N/A"}</td>
//                 <td className="p-2">
//                   {item.timestamp
//                     ? new Date(item.timestamp).toLocaleString()
//                     : "N/A"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function CheckInHistory() {
  const [history, setHistory] = useState([]);
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

      // Sort recent to oldest
      recentHistory.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(recentHistory);

      // Delete old entries
      oldKeysToDelete.forEach((key) => {
        remove(ref(db, `check-ins-history/${key}`));
      });
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  useEffect(() => {
    loadHistory(); // Load initially

    const interval = setInterval(() => {
      loadHistory(); // Reload every 30s
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">📋 Full Check-In History</h1>

      {history.length === 0 ? (
        <p className="italic text-gray-600">No check-in records found.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">Muscle Group</th>
              <th className="p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
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
