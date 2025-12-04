import React from "react";
import { motion } from "framer-motion";
import "../styles/ModernStudentInfoCard.css";
import avatar from "../assets/avitar.webp"; // Keep the avatar

const stageLabels = {
  arrival: {
    label: "Arrival",
    statusKey: "arrival",
    verifiedByKey: "arrivalVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
      </svg>
    ),
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)"
  },
  hostel: {
    label: "Hostel",
    statusKey: "hostelVerified",
    verifiedByKey: "hostelVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)"
  },
  documents: {
    label: "Documents",
    statusKey: "documentsVerified",
    verifiedByKey: "documentsVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M16 13H8"/>
        <path d="M16 17H8"/>
      </svg>
    ),
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)"
  },
  kit: {
    label: "Kit",
    statusKey: "kitReceived",
    verifiedByKey: "kitReceivedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
      </svg>
    ),
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)"
  },
};

const StudentInfoCard = ({ student, currentStage }) => {
  const stage = stageLabels[currentStage];
  let status = null;
  let completionPercentage = 0;
  let completedStages = 0;
  let totalStages = 4;

  if (student) {
    // Calculate completion percentage
    const stages = Object.values(stageLabels);
    completedStages = stages.filter((s) => student[s.statusKey]).length;
    completionPercentage = (completedStages / totalStages) * 100;
  }

  if (stage && student) {
    const completed = !!student[stage.statusKey];
    const verifiedBy = student[stage.verifiedByKey];
    status = {
      label: stage.label,
      completed,
      verifiedBy,
      icon: stage.icon,
    };
  }

  // Determine card color based on group
  const getCardColorClass = () => {
    if (!student) return "neutral";
    
    // Get the group from student data
    const group = student.group;
    if (!group) return "neutral";
    
    // Convert group to lowercase for case-insensitive comparison
    const groupLower = group.toLowerCase();
    
    // Check if group contains "red" or "blue" keywords
    if (groupLower.includes("red")) {
      return "group-red";
    } else if (groupLower.includes("blue")) {
      return "group-blue";
    }
    
    // Default fallback based on completion if group doesn't match
    if (completionPercentage === 100) return "completed";
    if (completionPercentage >= 50) return "in-progress";
    return "pending";
  };

  if (!student) {
    return (
      <div className="modern-student-card empty-state beige-theme">
        <div className="modern-student-card-content">
          <div className="empty-state-header">
          <div className="empty-avatar">
            <img src={avatar} alt="Student Avatar" className="empty-avatar-img" />
            <div className="empty-avatar-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
          <div className="empty-header-content">
            <h3>No Student Selected</h3>
            <p>Scan a QR code to view student information</p>
          </div>
        </div>
        
        <div className="empty-scan-indicator">
          <div className="scan-pulse"></div>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="14" rx="2" ry="2"/>
            <polyline points="7 8 12 13 17 8"/>
          </svg>
          <span>Ready to Scan</span>
        </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`modern-student-card ${getCardColorClass()}`}
      style={{
        '--group-gradient': student.group?.toLowerCase().includes('red') 
          ? 'linear-gradient(135deg, #ef4444, #f87171)'
          : student.group?.toLowerCase().includes('blue')
          ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
          : 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="modern-student-card-content">
      {/* Header with Avatar and Student Info */}
      <motion.div 
        className="student-card-header"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="student-info-section">
          <motion.img 
            src={avatar} 
            alt="Student Avatar" 
            className="student-avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          />
          <div className="student-info">
            <motion.div 
              className="student-name-box"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="student-name">{student.name}</h2>
            </motion.div>
            <motion.div 
              className="student-id-box"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="student-id">{student.studentId}</p>
            </motion.div>
            <div className="completion-metrics">
              <span className="stages-count">{completedStages} of {totalStages} stages completed</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Width Progress Bar */}
      <motion.div 
        className="full-width-progress-container"
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="progress-labels">
          <span>Progress</span>
          <span>{completedStages}/{totalStages}</span>
        </div>
        <div className="full-width-progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: "0%" }}
            whileInView={{ width: `${completionPercentage}%` }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            style={{ 
              background: completionPercentage === 100 
                ? 'linear-gradient(135deg, #10b981, #34d399)' 
                : completionPercentage >= 50 
                ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' 
                : 'linear-gradient(135deg, #f59e0b, #fbbf24)'
            }}
          >
            <div className="progress-shine"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Student Details Grid */}
      <motion.div 
        className="student-details-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div 
          className="detail-card amount"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="detail-icon" 
            style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </motion.div>
          <div className="detail-content">
            <span className="detail-label">Due Amount</span>
            <span className="detail-value">
              {typeof student.dueAmount === 'number' 
                ? `₹${student.dueAmount.toLocaleString()}` 
                : 'Not available'
              }
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Current Stage Spotlight */}
      {status && (
        <motion.div 
          className="current-stage-spotlight"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.4 }} 
             style={{
               '--stage-color': stageLabels[currentStage]?.color,
               '--stage-gradient': stageLabels[currentStage]?.gradient
             }}>
          <div className="spotlight-header">
            <div className="spotlight-icon" style={{ background: stageLabels[currentStage]?.gradient }}>
              {status.icon}
            </div>
            <div className="spotlight-content">
              <h4>{status.label} Stage</h4>
              <p>Current verification status</p>
            </div>
            <div className={`spotlight-status ${status.completed ? 'completed' : 'pending'}`}>
              {status.completed ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  In Progress
                </>
              )}
            </div>
          </div>
          {status.completed && status.verifiedBy && (
            <div className="spotlight-footer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Verified by {status.verifiedBy}
            </div>
          )}
        </motion.div>
      )}

      {/* Stages Progress Cards */}
      <motion.div 
        className="stages-progress-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="stages-header">
          <h4>Verification Stages</h4>
          <div className="stages-summary">
            <span className="completed-count">{completedStages}</span>
            <span className="total-stages">/ {totalStages} completed</span>
          </div>
        </div>
        
        <div className="stages-grid">
          {Object.entries(stageLabels).map(([key, stageInfo], index) => {
            const isCompleted = student[stageInfo.statusKey];
            const isCurrent = key === currentStage;
            const verifiedBy = student[stageInfo.verifiedByKey];
            
            return (
              <motion.div
                key={key}
                className={`stage-progress-card ${
                  isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
                }`}
                style={{
                  '--stage-color': stageInfo.color,
                  '--stage-gradient': stageInfo.gradient
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="card-header">
                  <div className="stage-icon" 
                       style={{ 
                         background: isCompleted || isCurrent ? stageInfo.gradient : undefined 
                       }}>
                    {stageInfo.icon}
                  </div>
                  <div className="stage-status">
                    <div className="stage-label">{stageInfo.label}</div>
                    <div className="stage-description">
                      {isCompleted ? 'Verification completed' : isCurrent ? 'Currently verifying' : 'Pending verification'}
                    </div>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="stage-type-indicator">
                    {isCompleted ? (
                      <span className="type-complete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg> 
                        Completed
                      </span>
                    ) : isCurrent ? (
                      <span className="type-current">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg> 
                        In Progress
                      </span>
                    ) : (
                      <span className="type-pending">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                        </svg> 
                        Pending
                      </span>
                    )}
                  </div>
                  {isCompleted && verifiedBy && (
                    <div className="verified-by">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {verifiedBy}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentInfoCard;
