import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Html5QrScanner from "../../components/Html5QrScanner";
import StudentInfoCard from "../../components/StudentInfoCard";
import ConfirmButton from "../../components/ConfirmButton";
import "../../styles/Scanner.css";

const HostelScan = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const [cameras, setCameras] = useState([]);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleScanSuccess = async (rawData) => {
    try {
      // Prevent multiple rapid scans
      if (scanSuccess || isLoading) return;
      
      const parsed = JSON.parse(rawData);
      if (!parsed.studentId) throw new Error("Invalid QR code format");
      
      // Show success animation
      setScanSuccess(true);
      setIsLoading(true);
      
      // Wait for animation to complete
      setTimeout(async () => {
        try {
          setStudentId(parsed.studentId);
          const res = await fetch(`/api/student/${parsed.studentId}`);
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const result = await res.json();
          setStudentData(result);
          setScanning(false);
        } catch (error) {
          console.error("Error fetching student data:", error);
          alert("Error fetching student data. Please try again.");
        } finally {
          setScanSuccess(false);
          setIsLoading(false);
        }
      }, 600); // Match animation duration
      
    } catch (error) {
      console.error("QR scan error:", error);
      alert("Invalid QR scanned. Please try again.");
      setScanSuccess(false);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStudentId(null);
    setStudentData(null);
    setScanning(false);
    setScanSuccess(false);
    setIsLoading(false);
  };

  const handleCameraSelect = (cameraId) => {
    setCameraId(cameraId);
    setShowCameraDropdown(false);
    // Stop scanning when camera changes
    if (scanning) {
      setScanning(false);
    }
  };

  const handleScanToggle = () => {
    setScanning((prev) => !prev);
    setScanSuccess(false);
    setIsLoading(false);
  };

  const getCurrentCameraName = () => {
    if (!cameraId) return "Select Camera";
    const camera = cameras.find(cam => cam.id === cameraId);
    return camera ? camera.label || camera.id : "Select Camera";
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (scanning) return "Stop Scanning";
    return "Start Scanning";
  };

  const isButtonDisabled = () => {
    return !cameraId || isLoading;
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container">
        <header className="scanner-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="btn btn-secondary back-btn"
                onClick={() => navigate("/hostel")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Hostel
              </button>
              <div className="page-info">
                <h1 className="page-title">Hostel Check-in Scanner</h1>
                <p className="page-description">
                  Scan student QR codes to process hostel check-ins and room assignments
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

        <main className="scanner-main">
          <div className="scanner-flex-layout">
            <div className="scanner-left">
              <div className="scanner-container">
                <div className="camera-dropdown-container">
                  <button 
                    className="camera-dropdown-btn"
                    onClick={() => setShowCameraDropdown(!showCameraDropdown)}
                    disabled={isLoading}
                  >
                    <span className="camera-icon">📹</span>
                    <span className="camera-text">{getCurrentCameraName()}</span>
                    <span className={`dropdown-arrow ${showCameraDropdown ? 'rotated' : ''}`}>▼</span>
                  </button>
                  {showCameraDropdown && (
                    <div className="camera-dropdown-menu">
                      {cameras.map((cam) => (
                        <button
                          key={cam.id}
                          className={`camera-option ${cameraId === cam.id ? 'selected' : ''}`}
                          onClick={() => handleCameraSelect(cam.id)}
                        >
                          {cam.label || cam.id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`scanner-box ${scanning ? 'scanning' : ''} ${scanSuccess ? 'scan-success' : ''} ${isLoading ? 'loading' : ''}`}>
                  <Html5QrScanner
                    onScanSuccess={handleScanSuccess}
                    cameraId={cameraId}
                    scanning={scanning}
                    onCameras={setCameras}
                  />
                  {scanning && <div className="laser-line"></div>}
                  {scanSuccess && <div className="scan-pulse"></div>}
                  {isLoading && <div className="loading-overlay">Loading student data...</div>}
                </div>
              </div>
              <button 
                className={`scanner-action-btn ${isButtonDisabled() ? 'disabled' : ''}`} 
                onClick={handleScanToggle}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>
              {!cameraId && (
                <p className="scanner-hint">Please select a camera first</p>
              )}
            </div>
            <div className="scanner-right">
              {studentData && (
                <>
                  <StudentInfoCard student={studentData} />
                  <ConfirmButton
                    studentId={studentId}
                    stage="hostel"
                    onReset={handleReset}
                  />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HostelScan;
