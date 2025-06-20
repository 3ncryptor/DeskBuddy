import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from './ToastProvider';

export function useScanHandler() {
  const [scanning, setScanning] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const [cameras, setCameras] = useState([]);
  const [showCameraDropdown, setShowCameraDropdown] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showScanNext, setShowScanNext] = useState(false);
  const [scanErrorTrigger, setScanErrorTrigger] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const { addToast } = useToast();
  const processingRef = useRef(false);
  const isMounted = useRef(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleScanSuccess = useCallback(async (rawData) => {
    if (processingRef.current) return;
    processingRef.current = true;
    try {
      if (scanSuccess || isLoading) return;
      let parsed;
      try {
        parsed = JSON.parse(rawData);
      } catch {
        throw new Error("Invalid QR code format");
      }
      if (!parsed.studentId) throw new Error("Invalid QR code: missing studentId");
      if (isMounted.current) {
        setScanSuccess(true);
        setIsLoading(true);
        setScanErrorTrigger(false);
        setShowCheckmark(true);
      }
      setTimeout(async () => {
        if (isMounted.current) setShowCheckmark(false);
        try {
          if (isMounted.current) setStudentId(parsed.studentId);
          const res = await fetch(`${API_BASE_URL}/api/student/${parsed.studentId}`);
          if (!res.ok) {
            if (res.status === 409) {
              addToast({
                type: "error",
                title: "Duplicate Scan",
                message: "This student has already been scanned for this stage.",
                duration: 4000
              });
              if (isMounted.current) {
                setScanErrorTrigger(true);
                setScanSuccess(false);
                setIsLoading(false);
                setShowCheckmark(false);
              }
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
          if (isMounted.current) {
            setStudentData(result);
            addToast({
              type: "success",
              title: "Student Found!",
              message: `Student ID: ${parsed.studentId}`,
              duration: 3000
            });
          }
        } catch (error) {
          if (isMounted.current) {
            setScanErrorTrigger(true);
            addToast({
              type: "error",
              title: "Error Fetching Student",
              message: error.message,
              duration: 3500
            });
            setScanSuccess(false);
            setIsLoading(false);
            setShowCheckmark(false);
          }
        } finally {
          if (isMounted.current) {
            setScanSuccess(false);
            setIsLoading(false);
          }
        }
      }, 600);
    } catch (error) {
      if (isMounted.current) {
        setScanErrorTrigger(true);
        addToast({
          type: "error",
          title: "Invalid QR Code",
          message: error.message,
          duration: 3500
        });
        setScanSuccess(false);
        setIsLoading(false);
        setShowCheckmark(false);
      }
    } finally {
      setTimeout(() => { processingRef.current = false; }, 1000);
    }
  }, [scanSuccess, isLoading, addToast]);

  const handleReset = useCallback((mode) => {
    if (mode === "refresh") {
      if (isMounted.current) setShowScanNext(true);
    } else {
      if (isMounted.current) {
        setStudentId(null);
        setStudentData(null);
        setScanning(false);
        setScanSuccess(false);
        setIsLoading(false);
        setShowScanNext(false);
      }
    }
    processingRef.current = false;
  }, []);

  const handleScanNext = useCallback(() => {
    if (isMounted.current) {
      setStudentId(null);
      setStudentData(null);
      setScanning(false);
      setScanSuccess(false);
      setIsLoading(false);
      setShowScanNext(false);
    }
  }, []);

  const handleCameraSelect = useCallback((id) => {
    setCameraId(id);
    setShowCameraDropdown(false);
    if (scanning) setScanning(false);
  }, [scanning]);

  const handleScanToggle = useCallback(() => {
    setScanning((prev) => !prev);
    setScanSuccess(false);
    setIsLoading(false);
  }, []);

  return {
    scanning,
    setScanning,
    cameraId,
    setCameraId,
    cameras,
    setCameras,
    showCameraDropdown,
    setShowCameraDropdown,
    studentId,
    setStudentId,
    studentData,
    setStudentData,
    scanSuccess,
    setScanSuccess,
    isLoading,
    setIsLoading,
    showScanNext,
    setShowScanNext,
    scanErrorTrigger,
    setScanErrorTrigger,
    showCheckmark,
    setShowCheckmark,
    handleScanSuccess,
    handleReset,
    handleScanNext,
    handleCameraSelect,
    handleScanToggle,
  };
} 