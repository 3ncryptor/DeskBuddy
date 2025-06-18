import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-ring">
          <div className="spinner-ring-inner"></div>
        </div>
        <div className="spinner-logo">
          <div className="logo-circle">
            <span className="logo-text">DB</span>
          </div>
        </div>
        <div className="spinner-pulse"></div>
      </div>
      <div className="loading-message">
        <span className="message-text">{message}</span>
        <div className="message-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 