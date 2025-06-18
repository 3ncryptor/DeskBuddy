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
    { label: "Arrival Check-In", route: "/arrival", color: "#28a745", svg: ArrivalPNG },
    { label: "Hostel Verification", route: "/hostel", color: "#007bff", svg: HostelScanPNG },
    { label: "Document Verification", route: "/documents", color: "#ffc107", svg: DocumentScanPNG },
    { label: "Orientation Kit", route: "/kit", color: "#6610f2", svg: ArrivalPNG },
    { label: "Send QR to Student", route: "/send-qr", color: "#fd7e14", svg: ScanQR },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-welcome">Welcome{getUserName() ? `, ${getUserName()}` : ''}!</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ borderLeft: `7px solid ${card.color}` }}
            onClick={() => navigate(card.route)}
          >
            <div className="card-svg-placeholder">
              <img src={card.svg} alt={card.label + ' icon'} />
            </div>
            <p className="card-label">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
