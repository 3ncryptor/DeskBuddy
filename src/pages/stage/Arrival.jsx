import React from "react";
import { useNavigate } from "react-router-dom";
import scanQR from '../../assets/scanQR.svg';
import HistoryPNG from '../../assets/History.png';
import "../../styles/StagePage.css";

const ArrivalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="modern-stage-page">
      {/* Floating particles background */}
      <div className="page-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="page-particle" 
            style={{ 
              animationDelay: `${i * 1.2}s`,
              top: `${10 + i * 12}%`,
              left: `${5 + i * 12}%`
            }} 
          />
        ))}
      </div>

      <div className="modern-stage-container">
        {/* Modern Header */}
        <header className="modern-stage-header">
          <div className="header-particles">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="header-particle" 
                style={{ 
                  animationDelay: `${i * 0.6}s`,
                  background: '#3b82f6'
                }} 
              />
            ))}
          </div>
          
          <div className="modern-header-content">
            <div className="header-left-modern">
              <button 
                className="modern-back-btn"
                onClick={() => navigate("/dashboard")}
              >
                <div className="back-btn-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </div>
                <span>Back to Dashboard</span>
                <div className="btn-glow"></div>
              </button>
              
              <div className="page-info-modern">
                <div className="page-header-section">
                  <div className="page-icon-container">
                    <div className="page-icon" style={{'--icon-color': '#3b82f6'}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                        <path d="M6 7h12"/>
                        <path d="M10 11v6"/>
                      </svg>
                    </div>
                    <div className="icon-ring"></div>
                  </div>
                  
                  <div className="page-text-section">
                    <h1 className="modern-page-title">
                      <span className="title-highlight">Arrival</span>
                      <span className="title-base">Check-In</span>
                    </h1>
                    <p className="modern-page-description">
                      Process student arrivals and manage check-in procedures efficiently
                    </p>
                    <div className="page-status">
                      <div className="status-dot"></div>
                      <span>Active Station</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header-shimmer"></div>
        </header>

        {/* Modern Main Content */}
        <main className="modern-stage-main">
          <div className="actions-grid">
            <div 
              className="modern-stage-card primary-card" 
              onClick={() => navigate("/arrival/scan")}
              style={{'--card-color': '#3b82f6', '--card-gradient': 'linear-gradient(135deg, #3b82f6, #60a5fa)'}}
            >
              {/* Card particles */}
              <div className="card-particles">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="particle" 
                    style={{ 
                      animationDelay: `${i * 0.5}s`,
                      background: '#3b82f6'
                    }} 
                  />
                ))}
              </div>
              
              <div className="interactive-glow"></div>
              
              <div className="card-header-modern">
                <div className="card-icon-section">
                  <div className="modern-card-icon">
                    <img src={scanQR} alt="Scan QR" />
                    <div className="icon-glow"></div>
                  </div>
                </div>
                <div className="card-status-section">
                  <div className="status-badge">
                    <div className="status-dot"></div>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
              
              <div className="card-body-modern">
                <h3 className="modern-card-title">Scan QR Code</h3>
                <p className="modern-card-description">
                  Scan student QR codes to process arrivals and check-ins seamlessly
                </p>
              </div>
              
              <div className="card-footer-modern">
                <div className="action-hint">Click to scan</div>
                <div className="arrow-container">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </div>
              </div>
              
              <div className="card-shimmer"></div>
            </div>

            <div className="modern-stage-card secondary-card">
              <div className="card-particles">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="particle" 
                    style={{ 
                      animationDelay: `${i * 0.5}s`,
                      background: '#94a3b8'
                    }} 
                  />
                ))}
              </div>
              
              <div className="card-header-modern">
                <div className="card-icon-section">
                  <div className="modern-card-icon secondary">
                    <img src={HistoryPNG} alt="History" />
                  </div>
                </div>
                <div className="card-status-section">
                  <div className="status-badge secondary">
                    <div className="status-dot"></div>
                    <span>Coming Soon</span>
                  </div>
                </div>
              </div>
              
              <div className="card-body-modern">
                <h3 className="modern-card-title">View History</h3>
                <p className="modern-card-description">
                  Access comprehensive arrival records and check-in history data
                </p>
              </div>
              
              <div className="card-footer-modern">
                <div className="action-hint">Available soon</div>
                <div className="arrow-container disabled">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6M9 9l6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArrivalPage;
