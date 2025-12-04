import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Html5QrScanner from "../../components/Html5QrScanner";
import StudentInfoCard from "../../components/StudentInfoCard";
import ConfirmButton from "../../components/ConfirmButton";
import ScanErrorAnimation from "../../components/ScanErrorAnimation";
import { useScanHandler } from "../../components/useScanHandler";
import "../../styles/Scanner.css";
import Loader from '../../components/Loader';

const KitScan = () => {
  const navigate = useNavigate();
  const scan = useScanHandler('Kit');

  const handleReset = (mode) => {
    if (mode === "refresh") {
      scan.showScanNext = true;
    } else {
      scan.studentId = null;
      scan.studentData = null;
      scan.scanning = false;
      scan.scanSuccess = false;
      scan.isLoading = false;
      scan.showScanNext = false;
    }
    scan.processingRef.current = false;
  };

  const handleScanToggle = () => {
    scan.setScanning(prev => !prev);
    scan.setScanSuccess(false);
    scan.setIsLoading(false);
  };

  const getCurrentCameraName = () => {
    if (!scan.cameraId) return "Select Camera";
    const camera = scan.cameras.find(cam => cam.id === scan.cameraId);
    return camera ? camera.label || camera.id : "Select Camera";
  };

  const isButtonDisabled = () => {
    return !scan.cameraId || scan.isLoading;
  };

  return (
    <div className="modern-scanner-page">
      {/* Background Particles */}
      <div className="scanner-particles">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="scanner-particle" 
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
              animationDelay: `${i * 2}s`
            }} 
          />
        ))}
      </div>
      
      {/* Modern Header */}
      <header className="modern-scanner-header">
        <div className="scanner-header-content">
          <div className="scanner-header-left">
            <button 
              className="modern-back-button"
              onClick={() => navigate("/kit")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Kit
            </button>
            <div className="scanner-title-section">
              <h1 className="scanner-page-title">Kit Distribution Scanner</h1>
              <p className="scanner-page-description">
                Scan student QR codes to distribute welcome kits and materials
              </p>
            </div>
          </div>
          <div className="scanner-status-badge">
            <div className="status-dot"></div>
            Active
          </div>
        </div>
      </header>

      {/* Main Scanner Container */}
      <div className="modern-scanner-container">
        <div className="scanner-layout">
          {/* Scanner Section */}
          <div className="scanner-section">
            {/* Camera Dropdown */}
            <div className="modern-camera-dropdown">
              <label className="camera-dropdown-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                Select Camera
              </label>
              <button 
                className={`modern-camera-select ${scan.showCameraDropdown ? 'open' : ''}`}
                onClick={() => scan.setShowCameraDropdown(!scan.showCameraDropdown)}
                disabled={scan.isLoading}
              >
                <span>{getCurrentCameraName()}</span>
                <svg className="camera-dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {scan.showCameraDropdown && (
                <div className="camera-dropdown-menu">
                  {scan.cameras.map((cam) => (
                    <button
                      key={cam.id}
                      className={`camera-option ${scan.cameraId === cam.id ? 'selected' : ''}`}
                      onClick={() => scan.handleCameraSelect(cam.id)}
                    >
                      {cam.label || cam.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Scanner Box */}
            <div className={`modern-scanner-box ${scan.scanning ? 'scanning' : ''} ${scan.scanSuccess ? 'success' : ''}`}>
              {!scan.cameraId ? (
                <div className="scanner-overlay">
                  <div className="scanner-hint">
                    <svg className="scanner-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <div>Please select a camera first</div>
                  </div>
                </div>
              ) : (
                <>
                  <Html5QrScanner
                    onScanSuccess={scan.handleScanSuccess}
                    cameraId={scan.cameraId}
                    scanning={scan.scanning}
                    onCameras={scan.setCameras}
                  />
                  {scan.scanning && <div className="laser-line"></div>}
                  {scan.showCheckmark && (
                    <div className="scan-success-overlay">
                      <div className="success-checkmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {scan.isLoading && (
                    <div className="scanner-loading">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <ScanErrorAnimation trigger={scan.scanErrorTrigger} />
                </>
              )}
            </div>
            
            {/* Scanner Controls */}
            <div className="scanner-controls">
              <button 
                className={`modern-scanner-button ${scan.scanning ? 'stop' : ''}`}
                onClick={handleScanToggle}
                disabled={isButtonDisabled()}
              >
                {scan.isLoading ? (
                  <>
                    <div className="loading-spinner" style={{width: '20px', height: '20px', borderWidth: '2px'}}></div>
                    Loading...
                  </>
                ) : scan.scanning ? (
                  <>
                    <svg className="scanner-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <svg className="scanner-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Start Scanning
                  </>
                )}
              </button>
              
              {!scan.cameraId && (
                <div className="scanner-hint-text">
                  Please select a camera to begin scanning
                </div>
              )}
            </div>
          </div>
          
          {/* Info Section */}
          <div className="info-section">
            {scan.studentData ? (
              <>
                <StudentInfoCard student={scan.studentData} currentStage="kit" />
                <ConfirmButton
                  studentId={scan.studentId}
                  stage="kit"
                  onReset={handleReset}
                  studentData={scan.studentData}
                />
              </>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#64748b'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{margin: '0 auto 1rem auto', opacity: 0.5}}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                </svg>
                <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600'}}>Ready to Scan</h3>
                <p style={{margin: '0', fontSize: '0.95rem'}}>Scan a student's QR code to distribute their welcome kit and materials</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitScan;