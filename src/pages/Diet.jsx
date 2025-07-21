import React, { useState } from "react";
import axios from "axios";

function Diet() {
  const [goal, setGoal] = useState("Build Muscle");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setResult("");

    const apiKey = "tgp_v1_llV_B5fr8-je5TH9N9aAYELdfDaT1B5KME9YM5JLex4tgp_v1_llV_B5fr8-je5TH9N9aAYELdfDaT1B5KME9YM5JLex4"; // Replace this with your Together.ai key
    const prompt = `Generate a detailed gym workout routine and diet chart for a ${level} who wants to ${goal}.`;

    try {
      const response = await axios.post(
        "https://api.together.xyz/v1",
        {
          model: "mistralai/Mixtral-8x7B-Instruct",
          prompt,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 0.9,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = response.data?.choices?.[0]?.text?.trim();
      setResult(text || "No result from AI.");
    } catch (error) {
      console.error(error);
      setResult("❌ Error fetching plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💪 AI Gym & Diet Plan</h2>

      <label style={styles.label}>🎯 Goal:</label>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={styles.input}
        placeholder="e.g., Build Muscle"
      />

      <label style={styles.label}>🏋️ Level:</label>
      <input
        type="text"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        style={styles.input}
        placeholder="e.g., Beginner"
      />

      <button
        style={styles.button}
        onClick={generatePlan}
        disabled={loading}
      >
        🚀 Generate Plan
      </button>

      {loading && <p style={{ color: "#0f0", marginTop: 20 }}>Generating...</p>}

      {result && (
        <div style={styles.resultContainer}>
          <pre style={styles.resultText}>{result}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#111",
    color: "#0f0",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginTop: "15px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #0f0",
    marginTop: "5px",
    backgroundColor: "#000",
    color: "#fff",
  },
  button: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#0f0",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
  resultContainer: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #0f0",
    borderRadius: "5px",
    backgroundColor: "#000",
    whiteSpace: "pre-wrap",
  },
  resultText: {
    fontSize: "14px",
    color: "#0f0",
  },
};

export default Diet;
