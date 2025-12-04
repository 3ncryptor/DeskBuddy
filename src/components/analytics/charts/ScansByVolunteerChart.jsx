import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAnalytics } from '../../../context/AnalyticsContext';

const ScansByVolunteerChart = ({ data }) => {
  const { analyticsData } = useAnalytics();
  
  const chartData = useMemo(() => {
    // Use backend volunteer stats if available, otherwise fall back to processed logs
    const volunteerData = analyticsData?.volunteerStats?.volunteers;
    
    if (!volunteerData || volunteerData.length === 0) {
      // Fallback to processing logs data
      if (!data || data.length === 0) {
        return {
          labels: ['No Data'],
          datasets: [{
            label: 'Scans by Volunteer',
            data: [0],
            backgroundColor: '#64748b',
            borderColor: '#64748b',
            borderWidth: 1,
          }]
        };
      }

      const volunteerCounts = {};
      data.forEach(log => {
        const volunteer = log.volunteerName || 'Unknown';
        volunteerCounts[volunteer] = (volunteerCounts[volunteer] || 0) + 1;
      });
      
      // Sort by count and take top 10
      const sortedVolunteers = Object.entries(volunteerCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      const colors = [
        '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6',
        '#ef4444', '#06b6d4', '#84cc16', '#f97316',
        '#ec4899', '#6366f1'
      ];
      
      return {
        labels: sortedVolunteers.map(([name]) => name),
        datasets: [{
          label: 'Students Processed',
          data: sortedVolunteers.map(([, count]) => count),
          backgroundColor: colors.slice(0, sortedVolunteers.length),
          borderColor: colors.slice(0, sortedVolunteers.length).map(color => color),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }
    
    // Use backend volunteer stats data
    const topVolunteers = volunteerData.slice(0, 10);
    const colors = [
      '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6',
      '#ef4444', '#06b6d4', '#84cc16', '#f97316',
      '#ec4899', '#6366f1'
    ];
    
    return {
      labels: topVolunteers.map(volunteer => volunteer.name),
      datasets: [{
        label: 'Students Processed',
        data: topVolunteers.map(volunteer => volunteer.totalStudents),
        backgroundColor: colors.slice(0, topVolunteers.length),
        borderColor: colors.slice(0, topVolunteers.length).map(color => color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  }, [data, analyticsData?.volunteerStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutCubic',
      delay: (context) => context.dataIndex * 150
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600',
          family: 'Inter, system-ui, sans-serif'
        },
        bodyFont: {
          size: 12,
          weight: '500',
          family: 'Inter, system-ui, sans-serif'
        },
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return [
              `Scans: ${context.parsed.y}`,
              `Contribution: ${percentage}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: { 
            size: 10,
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          maxRotation: 45,
          padding: 8
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: { 
            size: 11,
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          stepSize: 1,
          padding: 12
        }
      }
    },
    onHover: (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    layout: {
      padding: {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15
      }
    }
  };

  const analysis = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
          <p>No data available for analysis</p>
        </div>
      );
    }

    const volunteerCounts = {};
    data.forEach(log => {
      const volunteer = log.volunteerName || 'Unknown';
      volunteerCounts[volunteer] = (volunteerCounts[volunteer] || 0) + 1;
    });
    
    const total = Object.values(volunteerCounts).reduce((a, b) => a + b, 0);
    const sortedVolunteers = Object.entries(volunteerCounts)
      .sort(([,a], [,b]) => b - a);
    
    const topVolunteer = sortedVolunteers[0];
    const avgScans = (total / Object.keys(volunteerCounts).length).toFixed(1);
    
    return (
      <div style={{ padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: '#1e293b' }}>
        <p><strong>Total Volunteers:</strong> {Object.keys(volunteerCounts).length}</p>
        <p><strong>Top Performer:</strong> {topVolunteer[0]} ({topVolunteer[1]} scans, {((topVolunteer[1] / total) * 100).toFixed(1)}%)</p>
        <p><strong>Average Scans per Volunteer:</strong> {avgScans}</p>
        <p><strong>Performance Distribution:</strong> Shows volunteer activity levels and identifies high performers.</p>
      </div>
    );
  }, [data]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        padding: '1.5rem',
        transition: 'all 0.3s ease'
      }}>
        {/* Enhanced glow effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          borderRadius: '16px',
          background: 'radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          opacity: 0.8
        }} />
        <Bar data={chartData} options={options} />
      </div>
      {analysis}
    </div>
  );
};

export default ScansByVolunteerChart; 