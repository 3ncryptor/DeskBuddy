import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";
import ArrivalPNG from '../assets/Arrival.png';
import DocumentScanPNG from '../assets/DocumentScan.png';
import HostelScanPNG from '../assets/HostelScan.png';
import ScanQR from '../assets/scanQR.svg';
import logo from '../assets/Login.svg';

const ADMIN_USERS = ['aryan vibhuti', 'piyush', 'piyush yadav', 'aryan'];

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

  const cards = [
    { 
      label: "Arrival Check-In", 
      route: "/arrival", 
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      svg: ArrivalPNG,
      description: "Process student arrivals and initial check-ins",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'/><path d='M6 7h12'/><path d='M10 11v6'/></svg>",
      status: "Active"
    },
    { 
      label: "Hostel Verification", 
      route: "/hostel", 
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      svg: HostelScanPNG,
      description: "Verify hostel assignments and room allocations",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9,22 9,12 15,12 15,22'/></svg>",
      status: "Active"
    },
    { 
      label: "Document Verification", 
      route: "/documents", 
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      svg: DocumentScanPNG,
      description: "Review and validate student documents",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><polyline points='14,2 14,8 20,8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10,9 9,9 8,9'/></svg>",
      status: "Active"
    },
    { 
      label: "Orientation Kit", 
      route: "/kit", 
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      svg: ArrivalPNG,
      description: "Distribute orientation materials and kits",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><path d='M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z'/><polyline points='3.27,6.96 12,12.01 20.73,6.96'/><line x1='12' y1='22.08' x2='12' y2='12'/></svg>",
      status: "Active"
    },
    { 
      label: "Send QR to Student", 
      route: "/sendqr",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #f87171)",
      svg: ScanQR,
      description: "Generate and send QR codes to students",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='3' y='3' width='5' height='5'/><rect x='16' y='3' width='5' height='5'/><rect x='3' y='16' width='5' height='5'/><path d='m21 16-3.5-3.5-1 1'/><path d='m14 12 1 1'/><path d='m9 12 1 1'/><path d='m20 14 1 1'/><path d='m12 17 1 1'/><path d='m11 7 1 1'/></svg>",
      status: "Active"
    },
    {
      label: "Analytics Dashboard",
      route: "/analytics",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4, #67e8f9)",
      svg: DocumentScanPNG,
      description: "View comprehensive analytics and performance metrics",
      icon: "<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><line x1='18' y1='20' x2='18' y2='10'/><line x1='12' y1='20' x2='12' y2='4'/><line x1='6' y1='20' x2='6' y2='14'/></svg>",
      status: "Active"
    },
  ];

  return (
    <div className="dashboard dashboard-new">
      {/* Modern Glassmorphism Header */}
      <div className="modern-dashboard-header">
        {/* Header particles background */}
        <div className="header-particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="header-particle" 
              style={{ 
                animationDelay: `${i * 0.8}s`,
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`
              }} 
            />
          ))}
        </div>
        
        {/* Header content */}
        <div className="header-content-wrapper">
          <div className="header-left-section">
            <div className="logo-container">
              <div className="logo-glow"></div>
              <img 
                src={logo} 
                alt="DeskBuddy Logo" 
                className="modern-header-logo" 
              />
              <div className="logo-ring"></div>
            </div>
            
            <div className="header-text-section">
              <div className="brand-section">
                <h1 className="modern-header-title">
                  <span className="title-primary">Desk</span>
                  <span className="title-secondary">Buddy</span>
                </h1>
                <div className="brand-tagline">Student Management System</div>
              </div>
              
              <div className="welcome-section">
                <div className="welcome-text">
                  <span className="welcome-prefix">Welcome back,</span>
                  <span className="welcome-username">{userName}</span>
                  <div className="username-underline"></div>
                </div>
                <div className="user-status">
                  <div className="status-indicator-dot"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-right-section">
            <div className="header-actions">
              <div className="time-display">
                <div className="current-time">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="current-date">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <button
                className="modern-logout-button"
                onClick={logout}
                title="Sign Out"
              >
                <div className="logout-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <span className="logout-text">Sign Out</span>
                <div className="button-glow"></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Header shimmer effect */}
        <div className="header-shimmer"></div>
      </div>
      {/* Modern Quick Actions Section */}
      <main className="modern-dashboard-main">
        <div className="quick-actions-header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="header-text">
              <h2 className="section-title">Quick Actions</h2>
              <p className="section-description">
                Select an action below to manage student onboarding and verifications
              </p>
            </div>
          </div>
        </div>
        
        <div className="modern-actions-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="modern-action-card"
              onClick={() => navigate(card.route)}
              style={{
                '--card-color': card.color,
                '--card-gradient': card.gradient,
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Floating particles effect */}
              <div className="card-particles">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="particle" 
                    style={{ 
                      animationDelay: `${i * 0.5}s`,
                      background: card.color
                    }} 
                  />
                ))}
              </div>
              
              {/* Interactive glow effect */}
              <div className="interactive-glow" />
              
              <div className="card-header-modern">
                <div className="card-icon-section">
                  <div className="card-icon-container">
                    <div 
                      className="card-icon-modern" 
                      style={{ background: card.gradient }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: card.icon }} />
                    </div>
                    <div className="icon-glow" style={{ background: `${card.color}33` }} />
                  </div>
                </div>
                <div className="card-status-section">
                  <div className="status-indicator">
                    <div className="status-dot" style={{ background: card.color }}></div>
                    <span>{card.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="card-body-modern">
                <h3 className="card-title-modern">{card.label}</h3>
                <p className="card-description-modern">{card.description}</p>
              </div>
              
              <div className="card-footer-modern">
                <div className="action-hint">Click to access</div>
                <div className="arrow-container">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </div>
              </div>
              
              {/* Hover shimmer effect */}
              <div className="card-shimmer" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
