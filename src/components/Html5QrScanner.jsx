import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrScanner = ({ onScanSuccess, cameraId, scanning, onCameras }) => {
  const qrRef = useRef();
  const html5Qr = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Enumerate cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras().then((devices) => {
      if (onCameras) onCameras(devices);
    }).catch((err) => {
      console.error("Error getting cameras:", err);
    });
  }, [onCameras]);

  // Start/stop scanner based on scanning prop
  useEffect(() => {
    if (!scanning) {
      if (html5Qr.current && isInitialized) {
        setIsStarting(false);
        html5Qr.current.stop()
          .then(() => {
            // Don't clear the DOM content to avoid black screen
            html5Qr.current = null;
            setIsInitialized(false);
          })
          .catch((err) => {
            console.error("Error stopping scanner:", err);
            // Force cleanup even if stop fails
            if (html5Qr.current) {
              html5Qr.current = null;
            }
            setIsInitialized(false);
            setIsStarting(false);
          });
      }
      return;
    }

    // Don't start if already scanning or starting
    if (isInitialized || isStarting) return;

    const startScanner = async () => {
      try {
        setIsStarting(true);
        
        // Only clear if there's no existing video
        if (qrRef.current && !qrRef.current.querySelector('video')) {
          qrRef.current.innerHTML = '';
        }

        // Create new scanner instance
        const qr = new Html5Qrcode(qrRef.current.id);
        html5Qr.current = qr;

        // Enhanced configuration for better quality and fixed dimensions
        const config = {
          fps: 30, // Higher FPS for smoother video
          qrbox: { width: 0, height: 0 }, // No QR box overlay
          aspectRatio: 1.0, // Square aspect ratio
          disableFlip: false,
          videoConstraints: {
            width: { min: 1280, ideal: 1920, max: 2560 }, // Higher resolution
            height: { min: 720, ideal: 1080, max: 1440 },
            facingMode: "environment"
          }
        };

        await qr.start(
          cameraId || { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
            // Don't stop immediately, let user control
          },
          (errorMessage) => {
            // Ignore scanning errors, just keep scanning
            console.log("Scanning...", errorMessage);
          }
        );

        setIsInitialized(true);
        setIsStarting(false);
      } catch (err) {
        console.error("Error starting scanner:", err);
        setIsInitialized(false);
        setIsStarting(false);
        // Clean up failed instance
        if (html5Qr.current) {
          html5Qr.current = null;
        }
      }
    };

    startScanner();

    return () => {
      if (html5Qr.current && isInitialized) {
        html5Qr.current.stop()
          .then(() => {
            html5Qr.current = null;
          })
          .catch(() => {
            // Force cleanup on unmount
            if (html5Qr.current) {
              html5Qr.current = null;
            }
          });
      }
    };
  }, [scanning, cameraId, onScanSuccess, isInitialized, isStarting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5Qr.current) {
        html5Qr.current.stop().catch(() => {});
        html5Qr.current = null;
      }
    };
  }, []);

  return (
    <div 
      id="qr-reader" 
      ref={qrRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(240,244,255,0.85)'
      }} 
    />
  );
};

export default Html5QrScanner;
