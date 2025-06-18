import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Html5QrScanner from "../../components/Html5QrScanner";
import StudentInfoCard from "../../components/StudentInfoCard";
import ConfirmButton from "../../components/ConfirmButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import Confetti from "../../components/Confetti";
import ScanErrorAnimation from "../../components/ScanErrorAnimation";
import { useToast } from "../../components/ToastProvider";
import "../../styles/Scanner.css";
import { toast } from "react-hot-toast";

const ArrivalScan = () => {
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
  const [showScanNext, setShowScanNext] = useState(false);
  const { addToast } = useToast();
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [scanErrorTrigger, setScanErrorTrigger] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

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
    console.log("=== QR SCAN SUCCESS ===");
    console.log("Raw QR data received:", rawData);
    console.log("Current state - scanSuccess:", scanSuccess, "isLoading:", isLoading);
    
    try {
      // Prevent multiple rapid scans
      if (scanSuccess || isLoading) {
        console.log("Scan blocked - already processing");
        return;
      }
      
      console.log("Parsing QR data...");
      const parsed = JSON.parse(rawData);
      console.log("Parsed data:", parsed);
      
      if (!parsed.studentId) {
        console.log("No studentId found in QR data");
        throw new Error("Invalid QR code format - missing studentId");
      }
      
      console.log("Valid studentId found:", parsed.studentId);
      
      // Show success animation
      setScanSuccess(true);
      setIsLoading(true);
      setConfettiTrigger(false);
      setScanErrorTrigger(false);
      setShowCheckmark(true);
      console.log("Set loading states - scanSuccess: true, isLoading: true");
      
      // Show checkmark pulse for 600ms, then fetch student data
      setTimeout(async () => {
        setShowCheckmark(false);
        console.log("Starting API call to fetch student data...");
        try {
          setStudentId(parsed.studentId);
          const apiUrl = `/api/student/${parsed.studentId}`;
          console.log("Making API call to:", apiUrl);
          
          const res = await fetch(apiUrl);
          console.log("API response status:", res.status);
          
          if (!res.ok) {
            if (res.status === 409) {
              toast.error(
                <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
                  <span style={{fontSize:'1.5rem'}}>⚠️</span>
                  <span><b>Duplicate Scan:</b> This student has already been scanned for this stage.</span>
                </span>,
                { duration: 4000 }
              );
              setScanErrorTrigger(true);
              setScanSuccess(false);
              setIsLoading(false);
              setShowCheckmark(false);
              return;
            } else if (res.status === 403) {
              throw new Error("Student not found or access denied");
            } else if (res.status === 404) {
              throw new Error("Student not found in database");
            } else {
              throw new Error(`Server error: ${res.status}`);
            }
          }
          
          const result = await res.json();
          console.log("Student data received:", result);
          setStudentData(result);
          setConfettiTrigger(true);
          addToast({
            type: "success",
            title: "Student Found!",
            message: `Student ID: ${parsed.studentId}`,
            duration: 3000
          });
          
        } catch (error) {
          setScanErrorTrigger(true);
          addToast({
            type: "error",
            title: "Error Fetching Student",
            message: error.message,
            duration: 3500
          });
          // Use toast instead of alert for better UX
          toast.error(
            <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
              <span style={{fontSize:'1.5rem'}}>❌</span>
              <span><b>Error:</b> {error.message}</span>
            </span>,
            { duration: 4000 }
          );
        } finally {
          setScanSuccess(false);
          setIsLoading(false);
          setShowCheckmark(false);
          console.log("Reset loading states - scanSuccess: false, isLoading: false");
        }
      }, 600); // Checkmark pulse duration
      
    } catch (error) {
      setScanErrorTrigger(true);
      addToast({
        type: "error",
        title: "Invalid QR Code",
        message: error.message,
        duration: 3500
      });
      // Use toast instead of alert for better UX
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>Invalid QR code:</b> {error.message}</span>
        </span>,
        { duration: 4000 }
      );
      setScanSuccess(false);
      setIsLoading(false);
      setShowCheckmark(false);
    }
  };

  const handleReset = (mode) => {
    if (mode === "refresh") {
      // Only refresh the student card, don't reset everything
      setShowScanNext(true);
      // Optionally, re-fetch student data here if needed
    } else {
      setStudentId(null);
      setStudentData(null);
      setScanning(false);
      setScanSuccess(false);
      setIsLoading(false);
      setShowScanNext(false);
    }
  };

  const handleScanNext = () => {
    setStudentId(null);
    setStudentData(null);
    setScanning(false);
    setScanSuccess(false);
    setIsLoading(false);
    setShowScanNext(false);
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
                onClick={() => navigate("/arrival")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Arrival
              </button>
              <div className="page-info">
                <h1 className="page-title">Arrival QR Scanner</h1>
                <p className="page-description">
                  Scan student QR codes to process arrivals and check-ins
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
                  {showCheckmark && (
                    <div className="checkmark-pulse-overlay">
                      <div className="checkmark-circle">
                        <svg width="64" height="64" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="30" fill="#10b981" opacity="0.15" />
                          <circle cx="32" cy="32" r="24" fill="#10b981" opacity="0.25" />
                          <polyline points="22,34 30,42 44,26" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {isLoading && (
                    <div className="loading-overlay premium">
                      <LoadingSpinner message="Fetching student details..." />
                    </div>
                  )}
                  <Confetti trigger={confettiTrigger} />
                  <ScanErrorAnimation trigger={scanErrorTrigger} />
                </div>
              </div>
              <div className="scanner-controls">
              <button 
                className={`scanner-action-btn ${isButtonDisabled() ? 'disabled' : ''}`} 
                onClick={handleScanToggle}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>
              </div>
              {!cameraId && (
                <p className="scanner-hint">Please select a camera first</p>
              )}
            </div>
            <div className="scanner-right">
              {studentData && (
                <>
                  <StudentInfoCard student={studentData} currentStage="arrival" />
                  <ConfirmButton
                    studentId={studentId}
                    stage="arrival"
                    onReset={handleReset}
                    showScanNext={showScanNext}
                    onScanNext={handleScanNext}
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

export default ArrivalScan;
