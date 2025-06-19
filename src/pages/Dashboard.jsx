import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
import ArrivalPNG from '../assets/Arrival.png';
import DocumentScanPNG from '../assets/DocumentScan.png';
import HostelScanPNG from '../assets/HostelScan.png';
import ScanQR from '../assets/scanQR.svg';
import logo from '../assets/Login.svg';

const ADMIN_USERS = ['piyush', 'aryan'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getUserName = () => {
    if (!user) return '';
    if (user.displayName) return user.displayName.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return '';
  };
  const userName = getUserName();
  const isAdmin = ADMIN_USERS.includes(userName.toLowerCase());
  const role = isAdmin ? 'Administrator' : 'Volunteer';

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
    <div className="dashboard dashboard-new">
      {/* Engaging Glassy Header */}
      <div className="dashboard-glass-header simple-animated-header">
        <div className="dashboard-header-left">
          <img src={logo} alt="DeskBuddy Logo" className="dashboard-header-logo animated-logo" />
          <div>
            <div className="dashboard-header-title reveal-title">DeskBuddy</div>
            <div className="dashboard-header-welcome">Welcome back, <span className="dashboard-header-username">{userName}</span>!</div>
          </div>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-header-avatar-img animated-avatar simple-human-avatar">
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="45" cy="45" r="44" fill="#F4F4F4" stroke="#E3E8F7" strokeWidth="2"/>
              <ellipse cx="45" cy="38" rx="18" ry="18" fill="#F9D7B5"/>
              <ellipse cx="45" cy="70" rx="24" ry="12" fill="#E3E8F7"/>
              <ellipse cx="45" cy="38" rx="10" ry="10" fill="#F7C89A"/>
              <ellipse cx="38" cy="36" rx="2.2" ry="2.5" fill="#222b45"/>
              <ellipse cx="52" cy="36" rx="2.2" ry="2.5" fill="#222b45"/>
              <path d="M41 44 Q45 48 49 44" stroke="#B8875A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>
      {/* Quick Actions Section */}
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
  );
};

export default Dashboard;
