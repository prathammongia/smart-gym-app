import React, { useState } from "react";
import axios from "axios";

function DietPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [dietPref, setDietPref] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");


  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  // Never hardcode API keys - always use environment variables

  const generatePlan = async () => {
    setLoading(true);
    setResult("");

    const prompt = `Generate a 7-day structured workout and diet plan for a ${level} ${gender} who wants to ${goal}. Their dietary preference is ${dietPref} and they prefer ${workoutStyle} workouts. Return result in 2 sections: Workout Plan and Diet Plan. Format clearly with headings and days.`;

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices?.[0]?.message?.content || "No plan received.";
      setResult(reply);
    } catch (error) {
      console.error(error);
      setResult("❌ Error fetching plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>1. What's your goal?</h3>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="">Select</option>
              <option value="build muscle">Build Muscle</option>
              <option value="lose fat">Lose Fat</option>
              <option value="improve endurance">Improve Endurance</option>
            </select>
          </>
        );
      case 2:
        return (
          <>
            <h3>2. What's your fitness level?</h3>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Select</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </>
        );
      case 3:
        return (
          <>
            <h3>3. Gender</h3>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </>
        );
      case 4:
        return (
          <>
            <h3>4. Dietary Preference</h3>
            <select value={dietPref} onChange={(e) => setDietPref(e.target.value)}>
              <option value="">Select</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </>
        );
      case 5:
        return (
          <>
            <h3>5. Preferred Workout Style</h3>
            <select value={workoutStyle} onChange={(e) => setWorkoutStyle(e.target.value)}>
              <option value="">Select</option>
              <option value="gym-based">Gym-Based</option>
              <option value="home workout">Home Workout</option>
              <option value="cardio-focused">Cardio-Focused</option>
              <option value="strength training">Strength Training</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💪 AI-Powered Workout & Diet Planner</h2>

      {step <= 5 && (
        <>
          {renderStep()}
          <div style={styles.navButtons}>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} style={styles.buttonOutline}>
                ⬅ Back
              </button>
            )}
            {step < 5 && (
              <button onClick={() => setStep(step + 1)} style={styles.button}>
                Next ➡
              </button>
            )}
            {step === 5 && (
              <button onClick={generatePlan} style={styles.button} disabled={loading}>
                🚀 Generate Plan
              </button>
            )}
          </div>
        </>
      )}

      {loading && <p style={styles.loading}>⏳ Generating your plan...</p>}

      {result && (
        <div style={styles.result}>
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
    padding: "30px",
    backgroundColor: "#101820",
    color: "#f0f0f0",
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(0,255,140,0.3)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#00ff90",
    marginBottom: "30px",
    fontFamily: "Orbitron, sans-serif",
  },
  navButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#00ff90",
    color: "#000",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    border: "2px solid #00ff90",
    color: "#00ff90",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  loading: {
    marginTop: "20px",
    color: "#00ff90",
    fontWeight: "bold",
    textAlign: "center",
  },
  result: {
    marginTop: "30px",
    backgroundColor: "#0d0d0d",
    border: "1px solid #00ff90",
    padding: "20px",
    borderRadius: "10px",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
  },
  resultText: {
    color: "#ccffcc",
    fontFamily: "monospace",
    fontSize: "14px",
  },
};

export default DietPage;
