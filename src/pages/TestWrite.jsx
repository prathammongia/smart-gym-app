// src/pages/TestWrite.jsx
import React, { useState } from 'react';
import { db } from '../firebase'; // Make sure this path is correct
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const TestWrite = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const handleCheckIn = async () => {
    if (!name.trim()) {
      setStatus('Please enter a name.');
      return;
    }

    try {
      await addDoc(collection(db, 'check-ins'), {
        name: name.trim(),
        timestamp: Timestamp.now(),
      });
      setStatus('✅ Check-in successful!');
      setName('');
    } catch (error) {
      console.error('Error writing to Firestore:', error);
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Test Firestore Write</h2>
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleCheckIn}
      >
        Test Check-In
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
};

export default TestWrite;
