import React, { useState } from "react";
import Html5QrScanner from "../../components/Html5QrScanner";
import StudentInfoCard from "../../components/StudentInfoCard";
import ConfirmButton from "../../components/ConfirmButton";
import "../../styles/Scanner.css";

const ArrivalScan = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const [cameras, setCameras] = useState([]);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Camera list is set by Html5QrScanner

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
    <div className="scanner-flex-layout">
      <div className="scanner-left">
        <h2 className="scanner-heading">Arrival QR Scanner</h2>
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
              stage="arrival"
              onReset={handleReset}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ArrivalScan;
