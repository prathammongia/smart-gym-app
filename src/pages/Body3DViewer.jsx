import React from "react";
import "./Body3DViewer.css"; // for styling

const musclePositions = {
  Chest: { top: "28%", left: "48%" },
  Abs: { top: "38%", left: "49%" },
  Biceps: { top: "30%", left: "36%" },
  Triceps: { top: "30%", left: "60%" },
  Shoulders: { top: "20%", left: "47%" },
  Quads: { top: "58%", left: "45%" },
  Calves: { top: "78%", left: "47%" },
  Back: { top: "28%", left: "49%" }, // Used for back view
  Glutes: { top: "52%", left: "48%" },
  Hamstrings: { top: "60%", left: "47%" },
};

export default function Body3DViewer({ highlights = [] }) {
  const isBack = highlights.includes("Back") || highlights.includes("Glutes") || highlights.includes("Hamstrings");
  const imageSrc = isBack ? "/images/chest.png" : "/images/chest.jfif";

  return (
    <div className="body-container">
      <img src={imageSrc} alt="Human Body" className="body-image" />
      {highlights.map((muscle, i) => {
        const pos = musclePositions[muscle];
        if (!pos) return null;
        return (
          <div
            key={i}
            className="highlight-dot"
            style={{ top: pos.top, left: pos.left }}
            title={muscle}
          />
        );
      })}
    </div>
  );
}
