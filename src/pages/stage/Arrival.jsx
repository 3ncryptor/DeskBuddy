import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ArrivalPNG from '../../assets/Arrival.png';
import scanQR from '../../assets/scanQR.svg';
import HistoryPNG from '../../assets/History.png';
import "../../styles/StagePage.css";

const ArrivalPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Capitalize each word in the name
  const capitalizeName = (name) =>
    name.replace(/\b\w/g, (c) => c.toUpperCase());

  // Get display name for Google, fallback to email/password name or email
  const getUserName = () => {
    if (!user) return '';
    if (user.displayName) return capitalizeName(user.displayName);
    if (user.email) return capitalizeName(user.email.split('@')[0]);
    return 'User';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="stage-page">
      <div className="stage-container">
        <header className="stage-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="btn btn-secondary back-btn"
                onClick={() => navigate("/dashboard")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Dashboard
              </button>
              <div className="page-info">
                <h1 className="page-title">Arrival Check-In</h1>
                <p className="page-description">
                  Process student arrivals and initial check-ins
                </p>
              </div>
            </div>
            <div className="header-actions">
              <div className="user-info">
                <div className="user-avatar">
                  {getUserName().charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{getUserName()}</span>
                  <span className="user-role">Administrator</span>
                </div>
              </div>
              <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="stage-main">
          <div className="stage-cards">
            <div className="stage-card primary" onClick={() => navigate("/arrival/scan")}>
              <div className="card-icon">
                <img src={scanQR} alt="Scan QR" />
              </div>
              <div className="card-content">
                <h3 className="card-title">Scan QR Code</h3>
                <p className="card-description">
                  Scan student QR codes to process arrivals
                </p>
              </div>
              <div className="card-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>

            <div className="stage-card secondary">
              <div className="card-icon">
                <img src={HistoryPNG} alt="History" />
              </div>
              <div className="card-content">
                <h3 className="card-title">View History</h3>
                <p className="card-description">
                  Access arrival records and history
                </p>
                <span className="coming-soon">Coming Soon</span>
              </div>
              <div className="card-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArrivalPage;
