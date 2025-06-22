import React, { useState, useMemo, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import logo from '../assets/Login.svg';
import '../styles/Analytics.css';
import pdfExportService from '../services/pdfExportService';
import { useToast } from '../components/ToastProvider';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Import modular components
import SummaryCard from '../components/analytics/SummaryCard';
import AdvancedFilter from '../components/analytics/AdvancedFilter';
import ChartCard from '../components/analytics/ChartCard';
import DataTable from '../components/analytics/DataTable';
import ExportButton from '../components/analytics/ExportButton';

// Import chart components
import ScansByStageChart from '../components/analytics/charts/ScansByStageChart';
import ScansByVolunteerChart from '../components/analytics/charts/ScansByVolunteerChart';
import ScansOverTimeChart from '../components/analytics/charts/ScansOverTimeChart';
import HourlyDistributionChart from '../components/analytics/charts/HourlyDistributionChart';

const Analytics = () => {
  const { logs, loading, resetToEmptyData } = useAnalytics();
  const { addToast } = useToast();
  
  // Chart refs for PDF export
  const scansByStageRef = useRef(null);
  const scansByVolunteerRef = useRef(null);
  const scansOverTimeRef = useRef(null);
  const hourlyDistributionRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    stage: '',
    volunteer: '',
    dateRange: '',
    searchTerm: ''
  });

  // Time frame for hourly distribution
  const [timeFrame, setTimeFrame] = useState('24h');

  // View all toggle for data table
  const [viewAll, setViewAll] = useState(false);

  // Calculate analytics summary
  const stats = useMemo(() => {
    if (!logs.length) {
      return {
        totalScans: 0,
        uniqueStudents: 0,
        uniqueVolunteers: 0
      };
    }

    // Total scans: count each individual scan event
    const totalScans = logs.length;
    
    // Unique students: count unique student IDs
    const uniqueStudents = new Set(logs.map(log => log.studentId).filter(Boolean)).size;
    
    // Unique volunteers: count unique volunteer names
    const uniqueVolunteers = new Set(logs.map(log => log.volunteerName).filter(Boolean)).size;

    return {
      totalScans,
      uniqueStudents,
      uniqueVolunteers
    };
  }, [logs]);

  // Filter logs based on current filters
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Filter by stage
    if (filters.stage) {
      filtered = filtered.filter(log => log.stage === filters.stage);
    }

    // Filter by volunteer
    if (filters.volunteer) {
      filtered = filtered.filter(log => log.volunteerName === filters.volunteer);
    }

    // Filter by date range
    if (filters.dateRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
      }
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        (log.studentName && log.studentName.toLowerCase().includes(searchLower)) ||
        (log.studentId && log.studentId.toLowerCase().includes(searchLower)) ||
        (log.volunteerName && log.volunteerName.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [logs, filters]);

  // Get unique stages and volunteers for filter options
  const filterOptions = useMemo(() => {
    const stages = [...new Set(logs.map(log => log.stage).filter(Boolean))];
    const volunteers = [...new Set(logs.map(log => log.volunteerName).filter(Boolean))];
    
    return { stages, volunteers };
  }, [logs]);

  const handleExport = async (type) => {
    if (type === 'csv') {
      // CSV export logic
      const csvContent = [
        ['Student Name', 'Student ID', 'Stage', 'Volunteer', 'Timestamp'],
        ...filteredLogs.map(log => [
          log.studentName || '',
          log.studentId || '',
          log.stage || '',
          log.volunteerName || '',
          new Date(log.timestamp).toLocaleString()
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      
      addToast({
        type: 'success',
        title: 'CSV exported successfully!',
        duration: 3000
      });
    } else if (type === 'pdf') {
      try {
        // Show loading toast
        addToast({
          type: 'info',
          title: 'Generating PDF report...',
          message: 'This may take a few moments',
          duration: 5000
        });

        // Prepare chart refs
        const chartsRefs = {
          scansByStage: scansByStageRef,
          scansByVolunteer: scansByVolunteerRef,
          scansOverTime: scansOverTimeRef,
          hourlyDistribution: hourlyDistributionRef
        };

        // Prepare analytics data
        const analyticsData = {
          ...stats,
          logs: filteredLogs
        };

        // Generate PDF
        await pdfExportService.generateAnalyticsReport(analyticsData, chartsRefs);
        
        addToast({
          type: 'success',
          title: 'PDF report generated successfully!',
          duration: 4000
        });
      } catch (error) {
        console.error('PDF export failed:', error);
        addToast({
          type: 'error',
          title: 'PDF export failed',
          message: 'Please try again or contact support',
          duration: 5000
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '1.2rem',
          color: '#64748b'
        }}>
          Loading analytics data...
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header - Matching Dashboard Style */}
      <div className="dashboard-glass-header">
        <div className="dashboard-header-left">
          <img src={logo} alt="DeskBuddy Logo" className="dashboard-header-logo" />
          <div>
            <div className="dashboard-header-title">Analytics Dashboard</div>
            <div className="dashboard-header-welcome">Real-time scan activity and volunteer performance analytics</div>
          </div>
        </div>
        <div className="dashboard-header-right">
          <button 
            onClick={resetToEmptyData}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: '#64748b',
              cursor: 'pointer',
              marginRight: '1rem',
              fontSize: '0.875rem'
            }}
          >
            Clear All Data
          </button>
          <ExportButton onExport={handleExport} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        <SummaryCard
          title="Total Scans"
          value={stats.totalScans}
          icon="📊"
          color="#667eea"
          delay={0}
        />
        <SummaryCard
          title="Students"
          value={stats.uniqueStudents}
          icon="👥"
          color="#10b981"
          delay={100}
        />
        <SummaryCard
          title="Volunteers Active"
          value={stats.uniqueVolunteers}
          icon="🤝"
          color="#f59e0b"
          delay={200}
        />
      </div>

      {/* Show message when no data */}
      {!logs.length ? (
        <div className="no-data">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
          </svg>
          <p>No analytics data available yet</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Start scanning students to see real-time analytics and performance metrics
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="filters-card">
            <AdvancedFilter
              searchTerm={filters.searchTerm}
              onSearchChange={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
              selectedStage={filters.stage || 'all'}
              onStageChange={(value) => setFilters(prev => ({ ...prev, stage: value }))}
              selectedVolunteer={filters.volunteer || 'all'}
              onVolunteerChange={(value) => setFilters(prev => ({ ...prev, volunteer: value }))}
              stages={['all', ...filterOptions.stages]}
              volunteers={['all', ...filterOptions.volunteers]}
            />
          </div>

          {/* Charts Section */}
          <div className="chart-display-card">
            <div className="chart-header">
              <h3>Analytics Overview</h3>
              <p>Visual insights into scan patterns and volunteer performance</p>
            </div>
            
            <div className="charts-grid">
              <ChartCard title="Scans by Stage" icon="📋">
                <div ref={scansByStageRef}>
                  <ScansByStageChart data={filteredLogs} />
                </div>
              </ChartCard>
              
              <ChartCard title="Scans by Volunteer" icon="👤">
                <div ref={scansByVolunteerRef}>
                  <ScansByVolunteerChart data={filteredLogs} />
                </div>
              </ChartCard>
              
              <ChartCard title="Scans Over Time" icon="📈">
                <div ref={scansOverTimeRef}>
                  <ScansOverTimeChart data={filteredLogs} />
                </div>
              </ChartCard>
              
              <ChartCard 
                title="Peak Hours Analysis" 
                icon="⏰"
                subtitle={`Last ${timeFrame === '24h' ? '24 hours' : timeFrame === '7d' ? '7 days' : '30 days'}`}
              >
                <div className="chart-controls">
                  <select 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e3e8f7',
                      background: 'white',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>
                <div ref={hourlyDistributionRef}>
                  <HourlyDistributionChart data={filteredLogs} timeFrame={timeFrame} />
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Data Table */}
          <div className="data-table-container">
            <DataTable 
              data={filteredLogs} 
              searchTerm={filters.searchTerm}
              onSearchChange={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
              showAllData={viewAll}
              onShowAllDataChange={setViewAll}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics; 