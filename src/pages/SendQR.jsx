import React, { useState } from "react";
import "../styles/SendQR.css";
import scanQR from "../assets/scanQR.svg";
import { toastErrorStyle, toastSuccessStyle } from '../styles/toastStyles';
import toast from 'react-hot-toast';

const SendQR = () => {
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").filter(Boolean);
      const headers = lines[0].split(",").map((h) => h.trim());
      const students = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const student = {};
        headers.forEach((header, idx) => {
          student[header] = values[idx];
        });
        return student;
      });
      setCsvData(students);
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>📄</span>
          <span><b>CSV loaded:</b> {students.length} students found!</span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
    };

    reader.readAsText(file);
  };

  const handleSend = async () => {
    if (csvData.length === 0) {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>⚠️</span>
          <span><b>Please upload a CSV file first.</b></span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/send-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: csvData }),
      });

      if (!res.ok) throw new Error();
      toast.success(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>✅</span>
          <span><b>QR emails sent successfully!</b></span>
        </span>,
        { style: toastSuccessStyle, icon: null, duration: 3500 }
      );
    } catch {
      toast.error(
        <span style={{display:'flex',alignItems:'center',gap:'0.7rem'}}>
          <span style={{fontSize:'1.5rem'}}>❌</span>
          <span><b>Failed to send QR emails.</b> Please try again.</span>
        </span>,
        { style: toastErrorStyle, icon: null, duration: 3500 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      const event = { target: { files: [file] } };
      handleCSVUpload(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sendqr-page">
      <div className="sendqr-container premium-glass">
        <div className="sheen"></div>
        <div className="sendqr-header" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <div className="sendqr-heading-icon-badge">
            <img src={scanQR} alt="Send QR" className="sendqr-heading-icon large" />
          </div>
        </div>

        <div className="sendqr-content">
          {/* File Upload Section */}
          <div className="upload-section">
            <div className="upload-area" onDrop={handleFileDrop} onDragOver={handleDragOver}>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16L12 8M12 8L15 11M12 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15V16C3 18.8284 3 20.2426 3.87868 21.1213C4.75736 22 6.17157 22 9 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Upload CSV File</h3>
              <p>Drag and drop your CSV file here or click to browse</p>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleCSVUpload}
                className="file-input"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="upload-button">
                Choose File
              </label>
            </div>
            
            {fileName && (
              <div className="file-info">
                <div className="file-name">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {fileName}
                </div>
              </div>
            )}
          </div>

          {/* Students Preview Section */}
          {csvData.length > 0 && (
            <div className="students-preview">
              <div className="preview-header">
                <h3>Students Loaded</h3>
                <div className="student-count">
                  <span className="count-number">{csvData.length}</span>
                  <span className="count-label">students</span>
                </div>
              </div>
              
              <div className="students-list">
                {csvData.slice(0, 5).map((student, index) => (
                  <div key={index} className="student-item">
                    <div className="student-avatar">
                      {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="student-info">
                      <span className="student-name">
                        {student.name || student.email || `Student ${index + 1}`}
                      </span>
                      <span className="student-email">
                        {student.email || 'No email provided'}
                      </span>
                    </div>
                  </div>
                ))}
                {csvData.length > 5 && (
                  <div className="more-students">
                    +{csvData.length - 5} more students
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Send Button Section */}
          {csvData.length > 0 && (
            <div className="send-section">
              <button 
                onClick={handleSend} 
                className={`send-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Send QR Codes to All Students
                  </>
                )}
              </button>
              <p className="send-info">
                This will send QR codes to all {csvData.length} students via email
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendQR;
