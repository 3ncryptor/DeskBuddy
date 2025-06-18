import React, { useEffect, useState } from "react";
import "../styles/Confetti.css";

const Confetti = ({ trigger }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="confetti-container">
      {[...Array(18)].map((_, i) => (
        <div key={i} className={`confetti confetti-${i % 6}`}></div>
      ))}
    </div>
  );
};

export default Confetti; 