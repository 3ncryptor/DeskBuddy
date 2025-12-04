import React from 'react';
import './LiveStageCounts.css';

const LiveStageCounts = ({ analyticsData, autoRefresh, lastUpdated }) => {
  // Extract stage counts from analytics data
  const getStageCounts = () => {
    if (!analyticsData.summary) {
      return {
        arrival: 0,
        hostel: 0,
        documents: 0,
        kit: 0,
        notStarted: 0,
        total: 0
      };
    }

    const { stageDistribution, totalStudents } = analyticsData.summary;
    
    // Calculate students who have passed each stage (cumulative)
    const arrivalPassed = (stageDistribution?.arrival || 0) + (stageDistribution?.hostel || 0) + (stageDistribution?.documents || 0) + (stageDistribution?.completed || 0);
    const hostelPassed = (stageDistribution?.hostel || 0) + (stageDistribution?.documents || 0) + (stageDistribution?.completed || 0);
    const documentsPassed = (stageDistribution?.documents || 0) + (stageDistribution?.completed || 0);
    const kitPassed = stageDistribution?.completed || 0;
    
    return {
      arrival: arrivalPassed,
      hostel: hostelPassed,
      documents: documentsPassed,
      kit: kitPassed,
      notStarted: stageDistribution?.notStarted || 0,
      total: totalStudents || 0
    };
  };

  const stageCounts = getStageCounts();

  const stages = [
    {
      key: 'notStarted',
      label: 'Not Started',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2v6l4 2-4 2v6h12v-6l-4-2 4-2V2" />
        </svg>
      ),
      color: '#6b7280',
      description: 'Students yet to arrive',
      type: 'pending',
      gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)'
    },
    {
      key: 'arrival',
      label: 'Arrival Passed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
          <path d="M10 11v6"/>
        </svg>
      ),
      color: '#3b82f6',
      description: 'Students who completed arrival',
      type: 'completed',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
    },
    {
      key: 'hostel',
      label: 'Hostel Passed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      color: '#8b5cf6',
      description: 'Students who completed hostel verification',
      type: 'completed',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    },
    {
      key: 'documents',
      label: 'Documents Passed',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      color: '#f59e0b',
      description: 'Students who completed document verification',
      type: 'completed',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    },
    {
      key: 'kit',
      label: 'Kit Received',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73L12 2 4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73L12 22l8-4.27A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        </svg>
      ),
      color: '#10b981',
      description: 'Students who received their kit',
      type: 'completed',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)'
    }
  ];

  return (
    <div className="live-stage-counts">
      <div className="live-stage-counts-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="header-text">
            <h3>Live Stage Counts</h3>
            <p>Real-time student progression through onboarding stages</p>
          </div>
        </div>
        <div className="header-status">
          {autoRefresh && (
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>LIVE</span>
            </div>
          )}
          {lastUpdated && (
            <div className="last-updated">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
      
      <div className="stage-counts-grid">
        {stages.map((stage, index) => {
          const percentage = stageCounts.total > 0 
            ? ((stageCounts[stage.key] / stageCounts.total) * 100).toFixed(1)
            : '0.0';
          
          return (
            <div 
              key={stage.key}
              className="stage-count-card"
              style={{ 
                '--stage-color': stage.color,
                '--stage-gradient': stage.gradient,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="card-header">
                <div className="stage-icon" style={{ background: stage.gradient }}>
                  {stage.icon}
                </div>
                <div className="stage-status">
                  <div className="stage-label">{stage.label}</div>
                  <div className="stage-description">{stage.description}</div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="stage-count">
                  <span className="count-number">{stageCounts[stage.key]}</span>
                  <span className="count-total">/ {stageCounts.total}</span>
                </div>
                
                <div className="stage-metrics">
                  <div className="percentage-badge">
                    {percentage}%
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${percentage}%`,
                          background: stage.gradient
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="stage-type-indicator">
                  {stage.type === 'completed' ? (
                    <span className="type-complete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Completed</span>
                  ) : (
                    <span className="type-pending"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v6l4 2-4 2v6h12v-6l-4-2 4-2V2"/></svg> Pending</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveStageCounts;
