import React from 'react';
import './AnalysisToggle.css';

const AnalysisToggle = ({ activeTab, onTabChange }) => {
  return (
    <div className="analysis-toggle-container">
      <div className="toggle-background">
        <div className={`toggle-slider ${activeTab === 'advanced' ? 'advanced' : 'basic'}`} />
        <button
          className={`toggle-option ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => onTabChange('basic')}
        >
          <div className="option-content">
            <span className="option-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>
            <span>Basic Analysis</span>
          </div>
        </button>
        <button
          className={`toggle-option ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => onTabChange('advanced')}
        >
          <div className="option-content">
            <span className="option-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 20l-6-6" />
                <circle cx="11" cy="11" r="4" />
                <path d="M3 21l6-6" />
              </svg>
            </span>
            <span>Advanced Analysis</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AnalysisToggle; 