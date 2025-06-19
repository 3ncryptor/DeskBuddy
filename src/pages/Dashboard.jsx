import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
import ArrivalPNG from '../assets/Arrival.png';
import DocumentScanPNG from '../assets/DocumentScan.png';
import HostelScanPNG from '../assets/HostelScan.png';
import ScanQR from '../assets/scanQR.svg';

const Dashboard = () => {
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

  const cards = [
    { 
      label: "Arrival Check-In", 
      route: "/arrival", 
      color: "var(--success-color)", 
      svg: ArrivalPNG,
      description: "Process student arrivals and initial check-ins"
    },
    { 
      label: "Hostel Verification", 
      route: "/hostel", 
      color: "var(--primary-color)", 
      svg: HostelScanPNG,
      description: "Verify hostel assignments and room allocations"
    },
    { 
      label: "Document Verification", 
      route: "/documents", 
      color: "var(--accent-color)", 
      svg: DocumentScanPNG,
      description: "Review and validate student documents"
    },
    { 
      label: "Orientation Kit", 
      route: "/kit", 
      color: "var(--secondary-color)", 
      svg: ArrivalPNG,
      description: "Distribute orientation materials and kits"
    },
    { 
      label: "Send QR to Student", 
      route: "/sendqr",
      color: "var(--warning-color)", 
      svg: ScanQR,
      description: "Generate and send QR codes to students"
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">DeskBuddy</h1>
              <p className="dashboard-subtitle">
                Welcome back, {getUserName()}!
              </p>
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

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-description">
              Select an action below to manage student check-ins and verifications
            </p>
          </div>

          <div className="card-grid">
            {cards.map((card, index) => (
              <div
                key={index}
                className="dashboard-card"
                onClick={() => navigate(card.route)}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ backgroundColor: `${card.color}15` }}>
                    <img src={card.svg} alt={card.label} />
                  </div>
                  <div className="card-accent" style={{ backgroundColor: card.color }}></div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{card.label}</h3>
                  <p className="card-description">{card.description}</p>
                </div>
                <div className="card-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
