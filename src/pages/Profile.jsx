import { useEffect, useState } from 'react';

function Profile() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('checkIns') || '[]');
    setHistory(stored.reverse()); // newest first
  }, []);

  return (
    <div>
      <h1>Your Workout History</h1>

      {history.length === 0 ? (
        <p>No check-ins yet. Visit the Check-In page to get started.</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              📅 {entry.date} — 🏋️‍♂️ {entry.group}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
