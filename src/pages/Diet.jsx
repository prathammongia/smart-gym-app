import React, { useState, useEffect } from "react";
import "./Diet.css";

function DietPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [gender, setGender] = useState("");
  const [dietPref, setDietPref] = useState("");
  const [workoutStyle, setWorkoutStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("/diet_plans.json")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("❌ Failed to load JSON:", err));
  }, []);

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = (setter) => (e) => {
    setter(e.target.value);
    setTimeout(() => {
      setStep((prev) => Math.min(prev + 1, 6));
    }, 300);
  };

  const generatePlan = () => {
    setLoading(true);

    const match = plans.find(
      (item) =>
        item.Goal.trim().toLowerCase() === goal.trim().toLowerCase() &&
        item.FitnessLevel.trim().toLowerCase() === level.trim().toLowerCase() &&
        item.DietaryPreference.trim().toLowerCase() === dietPref.trim().toLowerCase() &&
        item.WorkoutStyle.trim().toLowerCase() === workoutStyle.trim().toLowerCase()
    );

    setTimeout(() => {
      setResult(match || { error: "❌ No matching plan found." });
      setLoading(false);
    }, 800);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="fade-in">
            <h3>1. What's your goal?</h3>
            <select value={goal} onChange={handleNext(setGoal)}>
              <option value="">Select</option>
              <option value="Build Muscle">Build Muscle</option>
              <option value="Lose Fat">Lose Fat</option>
              <option value="Improve Endurance">Improve Endurance</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div className="fade-in">
            <h3>2. Fitness Level</h3>
            <select value={level} onChange={handleNext(setLevel)}>
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div className="fade-in">
            <h3>3. Gender</h3>
            <select value={gender} onChange={handleNext(setGender)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div className="fade-in">
            <h3>4. Dietary Preference</h3>
            <select value={dietPref} onChange={handleNext(setDietPref)}>
              <option value="">Select</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
            </select>
          </div>
        );
      case 5:
        return (
          <div className="fade-in">
            <h3>5. Preferred Workout Style</h3>
            <select value={workoutStyle} onChange={handleNext(setWorkoutStyle)}>
              <option value="">Select</option>
              <option value="Gym-Based">Gym-Based</option>
              <option value="Home Workout">Home Workout</option>
              <option value="Cardio-Focused">Cardio-Focused</option>
              <option value="Strength Training">Strength Training</option>
            </select>
          </div>
        );
      case 6:
        return (
          <div className="fade-in">
            <h3>✅ All set!</h3>
            <button onClick={generatePlan} className="diet-button" disabled={loading}>
              🚀 Generate Plan
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="diet-container">
      <h2 className="diet-heading">💪 Smart Gym Diet & Workout Planner</h2>

      {step > 1 && (
        <button className="back-arrow" onClick={goBack}>
          ⬅
        </button>
      )}

      

      {renderStep()}

      {loading && <p className="diet-loading">⏳ Generating your plan...</p>}

      {result && (
        <div className="diet-result">
          {result.error ? (
            <p className="diet-error">{result.error}</p>
          ) : (
            <>
              <h3>🏋️‍♂️ Workout Plan</h3>
              <p>Days/Week: {result.WorkoutPlan.DaysPerWeek}</p>
              <ul>
                {result.WorkoutPlan.Plan.map((day, i) => (
                  <li key={i}>{day}</li>
                ))}
              </ul>

              <h3>🍽️ Diet Plan</h3>
              <ul>
                {Object.entries(result.DietPlan).map(([meal, desc]) => (
                  <li key={meal}>
                    <strong>{meal}:</strong> {desc}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DietPage;
