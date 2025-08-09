import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useAnalytics } from '../../../context/AnalyticsContext';

const HourlyDistributionChart = ({ data, timeFrame: propTimeFrame }) => {
  const { analyticsData } = useAnalytics();
  const [timeFrame, setTimeFrame] = useState(propTimeFrame || '60'); // Default to 60 minutes

  const chartData = useMemo(() => {
    // Use backend peak hours data if available
    const peakHoursData = analyticsData?.peakHours;
    
    if (peakHoursData && peakHoursData.intervalData) {
      // Use backend hourly distribution data
      const allStagesData = peakHoursData.intervalData;
      const labels = allStagesData.arrival?.map(interval => interval.label) || [];
      
      const datasets = [];
      const colors = {
        arrival: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)' },
        hostel: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' },
        documents: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' },
        kit: { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)' }
      };
      
      // Only show stages that have data
      Object.entries(allStagesData).forEach(([stage, intervals]) => {
        if (intervals && Array.isArray(intervals) && intervals.length > 0) {
          const hasData = intervals.some(interval => interval.count > 0);
          if (hasData) {
            datasets.push({
              label: stage.charAt(0).toUpperCase() + stage.slice(1),
              data: intervals.map(interval => interval.count),
              borderColor: colors[stage]?.border || '#64748b',
              backgroundColor: colors[stage]?.bg || 'rgba(100, 116, 139, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: colors[stage]?.border || '#64748b',
              pointBorderColor: 'white',
              pointBorderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
            });
          }
        }
      });
      
      return { labels, datasets };
    }
    
    // Fallback to processing logs data
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Scans by Time Frame',
          data: [0],
          borderColor: '#64748b',
          backgroundColor: 'rgba(100, 116, 139, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#64748b',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      };
    }

    const timeFrameMinutes = parseInt(timeFrame);
    const intervalsPerHour = 60 / timeFrameMinutes;
    
    // Find the actual time range of the data
    let minHour = 23, maxHour = 0;
    data.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        minHour = Math.min(minHour, hour);
        maxHour = Math.max(maxHour, hour);
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });

    // Add some padding to the range (1 hour before and after)
    const startHour = Math.max(0, minHour - 1);
    const endHour = Math.min(23, maxHour + 1);
    const totalHours = endHour - startHour + 1;
    const totalIntervals = totalHours * intervalsPerHour;
    
    // Initialize time intervals data for the actual range
    const intervalData = {};
    for (let i = 0; i < totalIntervals; i++) {
      intervalData[i] = 0;
    }

    // Count scans by time interval
    data.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const totalMinutes = (hour - startHour) * 60 + minute;
        const intervalIndex = Math.floor(totalMinutes / timeFrameMinutes);
        
        if (intervalIndex >= 0 && intervalIndex < totalIntervals) {
          intervalData[intervalIndex] = (intervalData[intervalIndex] || 0) + 1;
        }
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });

    // Generate labels based on time frame for the actual range
    const labels = Object.keys(intervalData).map(intervalIndex => {
      const intervalNum = parseInt(intervalIndex);
      const totalMinutes = intervalNum * timeFrameMinutes;
      const hour = startHour + Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      if (timeFrameMinutes === 60) {
        // 60-minute intervals (hourly)
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        if (hour > 12) return `${hour - 12} PM`;
        return `${hour} AM`;
      } else {
        // Smaller intervals
        if (hour === 0) return `12:${minute.toString().padStart(2, '0')} AM`;
        if (hour === 12) return `12:${minute.toString().padStart(2, '0')} PM`;
        if (hour > 12) return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`;
        return `${hour}:${minute.toString().padStart(2, '0')} AM`;
      }
    });

    const values = Object.values(intervalData);
    const maxValue = Math.max(...values);

    // Create gradient context for the area
    const createGradient = (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(102, 126, 234, 0.9)');
      gradient.addColorStop(0.3, 'rgba(102, 126, 234, 0.6)');
      gradient.addColorStop(0.7, 'rgba(102, 126, 234, 0.3)');
      gradient.addColorStop(1, 'rgba(102, 126, 234, 0.05)');
      return gradient;
    };

    return {
      labels,
      datasets: [{
        label: `Scans by ${timeFrame}-min intervals`,
        data: values,
        borderColor: '#667eea',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(102, 126, 234, 0.2)';
          return createGradient(ctx);
        },
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: values.map((value) => {
          const intensity = maxValue > 0 ? value / maxValue : 0;
          return `rgba(102, 126, 234, ${0.7 + intensity * 0.3})`;
        }),
        pointBorderColor: 'white',
        pointBorderWidth: 3,
        pointRadius: values.map((value) => {
          const intensity = maxValue > 0 ? value / maxValue : 0;
          return 8 + intensity * 8; // Point size varies from 8 to 16 based on value
        }),
        pointHoverRadius: 16,
        pointHoverBackgroundColor: '#667eea',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 4,
        // 3D effects for the line
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }]
    };
  }, [data, timeFrame, analyticsData?.peakHours]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y} scans at ${context.label}`;
          }
        },
        // 3D tooltip effects
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(8px)'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#64748b',
          font: { size: timeFrame === '60' ? 10 : 8 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          stepSize: 1
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverRadius: 12,
        // 3D point effects
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      line: {
        // 3D line effects
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 4,
        shadowOffsetX: 1,
        shadowOffsetY: 1
      }
    },
    // 3D chart container effects
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
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

    const timeFrameMinutes = parseInt(timeFrame);
    const intervalsPerHour = 60 / timeFrameMinutes;
    
    // Find the actual time range of the data
    let minHour = 23, maxHour = 0;
    data.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        minHour = Math.min(minHour, hour);
        maxHour = Math.max(maxHour, hour);
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });

    // Add some padding to the range (1 hour before and after)
    const startHour = Math.max(0, minHour - 1);
    const endHour = Math.min(23, maxHour + 1);
    const totalHours = endHour - startHour + 1;
    const totalIntervals = totalHours * intervalsPerHour;
    
    // Calculate interval statistics for the actual range
    const intervalData = {};
    for (let i = 0; i < totalIntervals; i++) {
      intervalData[i] = 0;
    }

    data.forEach(log => {
      try {
        const date = new Date(log.timestamp);
        const hour = date.getHours();
        const minute = date.getMinutes();
        const totalMinutes = (hour - startHour) * 60 + minute;
        const intervalIndex = Math.floor(totalMinutes / timeFrameMinutes);
        
        if (intervalIndex >= 0 && intervalIndex < totalIntervals) {
          intervalData[intervalIndex] = (intervalData[intervalIndex] || 0) + 1;
        }
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });

    const values = Object.values(intervalData);
    const total = values.reduce((a, b) => a + b, 0);
    const maxScans = Math.max(...values);
    const peakInterval = Object.keys(intervalData).find(interval => intervalData[interval] === maxScans);
    
    // Convert peak interval to readable format
    const getReadableTime = (intervalIndex) => {
      const intervalNum = parseInt(intervalIndex);
      const totalMinutes = intervalNum * timeFrameMinutes;
      const hour = startHour + Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      if (timeFrameMinutes === 60) {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        if (hour > 12) return `${hour - 12} PM`;
        return `${hour} AM`;
      } else {
        if (hour === 0) return `12:${minute.toString().padStart(2, '0')} AM`;
        if (hour === 12) return `12:${minute.toString().padStart(2, '0')} PM`;
        if (hour > 12) return `${hour - 12}:${minute.toString().padStart(2, '0')} PM`;
        return `${hour}:${minute.toString().padStart(2, '0')} AM`;
      }
    };

    // Find busiest time periods (adjusted for different time frames)
    const getPeriodStats = () => {
      if (timeFrameMinutes === 60) {
        // For hourly data, use 6-hour periods
        const morningRush = values.slice(6, 12).reduce((a, b) => a + b, 0); // 6 AM - 12 PM
        const afternoonRush = values.slice(12, 18).reduce((a, b) => a + b, 0); // 12 PM - 6 PM
        const eveningRush = values.slice(18, 22).reduce((a, b) => a + b, 0); // 6 PM - 10 PM
        const nightTime = values.slice(22, 24).reduce((a, b) => a + b, 0) + values.slice(0, 6).reduce((a, b) => a + b, 0); // 10 PM - 6 AM

        return [
          { name: 'Morning (6 AM - 12 PM)', count: morningRush },
          { name: 'Afternoon (12 PM - 6 PM)', count: afternoonRush },
          { name: 'Evening (6 PM - 10 PM)', count: eveningRush },
          { name: 'Night (10 PM - 6 AM)', count: nightTime }
        ];
      } else {
        // For smaller intervals, use 4-hour periods
        const intervalsPerPeriod = 4 * intervalsPerHour;
        const periods = [];
        const periodNames = ['Early Morning', 'Late Morning', 'Early Afternoon', 'Late Afternoon', 'Evening', 'Night'];
        
        for (let i = 0; i < 6; i++) {
          const start = i * intervalsPerPeriod;
          const end = Math.min(start + intervalsPerPeriod, values.length);
          const count = values.slice(start, end).reduce((a, b) => a + b, 0);
          periods.push({ name: periodNames[i], count });
        }
        
        return periods;
      }
    };

    const periods = getPeriodStats();
    const busiestPeriod = periods.reduce((max, period) => 
      period.count > max.count ? period : max
    );

    // Get time range display
    const getTimeRangeDisplay = () => {
      const startDisplay = startHour === 0 ? '12 AM' : startHour === 12 ? '12 PM' : startHour > 12 ? `${startHour - 12} PM` : `${startHour} AM`;
      const endDisplay = endHour === 0 ? '12 AM' : endHour === 12 ? '12 PM' : endHour > 12 ? `${endHour - 12} PM` : `${endHour} AM`;
      return `${startDisplay} - ${endDisplay}`;
    };

    return (
      <div style={{ padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: '#1e293b' }}>
        <p><strong>Time Range:</strong> {getTimeRangeDisplay()}</p>
        <p><strong>Peak Time:</strong> {getReadableTime(peakInterval)} ({maxScans} scans)</p>
        <p><strong>Busiest Period:</strong> {busiestPeriod.name} ({busiestPeriod.count} scans)</p>
        <p><strong>Total Scans:</strong> {total}</p>
        <p><strong>Average per {timeFrame}-min interval:</strong> {(total / totalIntervals).toFixed(1)} scans</p>
        <p><strong>Insight:</strong> {timeFrame}-minute intervals help identify precise peak arrival times for optimal staffing.</p>
      </div>
    );
  }, [data, timeFrame]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Time Frame Selector */}
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <label style={{ 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#1e293b',
          whiteSpace: 'nowrap'
        }}>
          Time Frame:
        </label>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '6px',
            fontSize: '0.9rem',
            backgroundColor: 'white',
            color: '#1e293b',
            cursor: 'pointer',
            minWidth: '120px'
          }}
        >
          <option value="60">60 minutes</option>
          <option value="45">45 minutes</option>
          <option value="30">30 minutes</option>
          <option value="15">15 minutes</option>
        </select>
      </div>
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        padding: '1rem',
        // 3D container effects
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        borderRadius: '16px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          0 4px 16px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        position: 'relative'
      }}>
        {/* 3D inner glow effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          borderRadius: '16px',
          background: 'radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        <Line data={chartData} options={options} />
      </div>
      {analysis}
    </div>
  );
};

export default HourlyDistributionChart; 