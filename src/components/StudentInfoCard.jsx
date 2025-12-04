import React from "react";
import "../styles/StudentInfoCard.css";
import avatar from "../assets/avitar.webp"; // fallback to .svg if .png not found

const stageLabels = {
  arrival: {
    label: "Arrival",
    statusKey: "arrival",
    verifiedByKey: "arrivalVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  hostel: {
    label: "Hostel",
    statusKey: "hostelVerified",
    verifiedByKey: "hostelVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  documents: {
    label: "Documents",
    statusKey: "documentsVerified",
    verifiedByKey: "documentsVerifiedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  kit: {
    label: "Kit",
    statusKey: "kitReceived",
    verifiedByKey: "kitReceivedBy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
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
      <div
        className={`student-card professional-card fade-in wide big ${getCardColorClass()}`}
      >
        <div className="student-card-header big">
          <div className="avatar-container">
            <img
              src={avatar}
              alt="Student Avatar"
              className="student-avatar big"
            />
            <div className="avatar-status neutral">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2h12M6 22h12M6 2v6a6 6 0 0 0 6 6v6M18 2v6a6 6 0 0 1-6 6"/>
              </svg>
            </div>
          </div>
          <div className="student-header-info">
            <span className="student-name big">No Student Data</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "0%" }}></div>
            </div>
          </div>
        </div>
        <div className="student-fields empty">
          <div className="student-row">
            <span className="student-label">Status:</span>
            <span className="student-value">Please scan a QR code</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`student-card professional-card fade-in wide big ${getCardColorClass()}`}
    >
      <div className="student-card-header big">
        <div className="avatar-container">
          <img
            src={avatar}
            alt="Student Avatar"
            className="student-avatar big"
          />
          <div
            className={`avatar-status ${
              completionPercentage === 100
                ? "completed"
                : completionPercentage >= 50
                ? "in-progress"
                : "pending"
            }`}
          >
            {completionPercentage === 100 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : completionPercentage >= 50 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3 7a9 9 0 0 0 18 0" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2h12M6 22h12M6 2v6a6 6 0 0 0 6 6v6M18 2v6a6 6 0 0 1-6 6"/>
              </svg>
            )}
          </div>
        </div>
        <div className="student-header-info">
          <span className="student-name big">{student.name}</span>
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {completedStages}/{totalStages} stages completed
            </div>
          </div>
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Student ID:</span>
          <span className="stat-value">{student.studentId}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Group:</span>
          <span className="stat-value">{student.group || "Not assigned"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Room:</span>
          <span className="stat-value">
            {student.roomNumber || "Not assigned"}
          </span>
        </div>
      </div>

      <div className="student-main-fields">
        <div className="student-row">
          <span className="student-label">Due Amount:</span>
          <span className="student-value">
            {typeof student.dueAmount === "number"
              ? `₹${student.dueAmount.toLocaleString()}`
              : "Not available"}
          </span>
        </div>
        <div className="student-row">
          <span className="student-label">Email:</span>
          <span className="student-value">
            {student.email || "Not available"}
          </span>
        </div>
        <div className="student-row">
          <span className="student-label">Program:</span>
          <span className="student-value">
            {student.program || "Not available"}
          </span>
        </div>
      </div>

      {status && (
        <div className="scan-status-section single">
          <div className="scan-status-title">
            {status.icon} {status.label} Status
          </div>
          <div className="scan-status-row single">
            <span className="scan-status-label">{status.label}:</span>
            <span
              className={`scan-status-chip animated-chip ${
                status.completed ? "yes" : "no"
              }`}
            >
              {status.completed ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                    <path d="M6 2h12M6 22h12M6 2v6a6 6 0 0 0 6 6v6M18 2v6a6 6 0 0 1-6 6"/>
                  </svg>
                  Pending
                </>
              )}
            </span>
            <span className="scan-status-by">
              {status.completed
                ? `by ${status.verifiedBy || "Unknown"}`
                : "Not assigned"}
            </span>
          </div>
        </div>
      )}

      <div className="all-stages-overview">
        <div className="stages-title">All Stages Overview</div>
        <div className="stages-grid">
          {Object.entries(stageLabels).map(([key, stageInfo]) => {
            const isCompleted = student[stageInfo.statusKey];
            const isCurrent = key === currentStage;
            return (
              <div
                key={key}
                className={`stage-item ${
                  isCompleted ? "completed" : isCurrent ? "current" : "pending"
                }`}
              >
                <span className="stage-icon">{stageInfo.icon}</span>
                <span className="stage-name">{stageInfo.label}</span>
                <span className="stage-status">
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : isCurrent ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3 7a9 9 0 0 0 18 0" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2h12M6 22h12M6 2v6a6 6 0 0 0 6 6v6M18 2v6a6 6 0 0 1-6 6"/>
                    </svg>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;
