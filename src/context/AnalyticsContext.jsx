import React, { createContext, useContext, useEffect, useState } from 'react';

const AnalyticsContext = createContext();

const ANALYTICS_STORAGE_KEY = 'deskbuddy_analytics_logs';

export function AnalyticsProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setLogs(parsedLogs);
      } else {
        // No data available yet - start with empty array
        setLogs([]);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Fallback to empty array
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(logs));
    }
  }, [logs, loading]);

  // Add a new scan log
  const addLog = (log) => {
    const newLog = {
      ...log,
      timestamp: log.timestamp || new Date().toISOString(),
      id: `${log.studentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  };

  // Reset to empty data
  const resetToEmptyData = () => {
    setLogs([]);
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  };

  // Export logs as CSV
  const exportLogs = () => {
    if (!logs.length) return;
    const header = Object.keys(logs[0]);
    const csvRows = [header.join(',')];
    logs.forEach(log => {
      csvRows.push(header.map(key => `"${(log[key] ?? '').toString().replace(/"/g, '""')}"`).join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get analytics summary
  const getAnalyticsSummary = () => {
    if (!logs.length) return null;

    // Total scans: count each individual scan event
    const totalScans = logs.length;
    
    // Unique students: count unique student IDs
    const uniqueStudents = new Set(logs.map(log => log.studentId).filter(Boolean)).size;
    
    // Unique volunteers: count unique volunteer names
    const uniqueVolunteers = new Set(logs.map(log => log.volunteerName).filter(Boolean)).size;
    
    // Stage distribution
    const stageCounts = {};
    logs.forEach(log => {
      const stage = log.stage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    // Volunteer performance
    const volunteerCounts = {};
    logs.forEach(log => {
      const volunteer = log.volunteerName || 'Unknown';
      volunteerCounts[volunteer] = (volunteerCounts[volunteer] || 0) + 1;
    });

    // Student journey analysis
    const studentJourneys = {};
    logs.forEach(log => {
      const studentId = log.studentId;
      if (studentId) {
        if (!studentJourneys[studentId]) {
          studentJourneys[studentId] = {
            name: log.studentName,
            stages: new Set(),
            totalScans: 0
          };
        }
        studentJourneys[studentId].stages.add(log.stage);
        studentJourneys[studentId].totalScans += 1;
      }
    });

    // Calculate completion rates
    const totalStudents = Object.keys(studentJourneys).length;
    const completedStudents = Object.values(studentJourneys).filter(
      journey => journey.stages.has('Arrival') && 
                journey.stages.has('Kit') && 
                journey.stages.has('Hostel') && 
                journey.stages.has('Documents')
    ).length;

    return {
      totalScans,
      uniqueStudents,
      uniqueVolunteers,
      stageCounts,
      volunteerCounts,
      studentJourneys,
      completionRate: totalStudents > 0 ? (completedStudents / totalStudents * 100).toFixed(1) : 0
    };
  };

  return (
    <AnalyticsContext.Provider value={{ 
      logs, 
      loading,
      addLog, 
      clearLogs,
      resetToEmptyData,
      exportLogs,
      getAnalyticsSummary
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
} 