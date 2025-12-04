import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const ScansOverTimeChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Scans Over Time',
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

    const timeData = {};
    data.forEach(log => {
      try {
      const date = new Date(log.timestamp).toLocaleDateString();
      timeData[date] = (timeData[date] || 0) + 1;
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });
    
    const sortedDates = Object.keys(timeData).sort();
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Daily Scan Activity',
        data: sortedDates.map(date => timeData[date]),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
          gradient.addColorStop(1, 'rgba(245, 158, 11, 0.05)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(245, 158, 11, 1)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderWidth: 4,
        shadowColor: 'rgba(245, 158, 11, 0.3)',
        shadowBlur: 10
      }]
    };
  }, [data]);

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
            return `${context.parsed.y} scans on ${context.label}`;
          }
        },
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
          font: { size: 11 }
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
    elements: {
      point: {
        hoverRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      line: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 4,
        shadowOffsetX: 1,
        shadowOffsetY: 1
      }
    },
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

    const timeData = {};
    data.forEach(log => {
      try {
      const date = new Date(log.timestamp).toLocaleDateString();
      timeData[date] = (timeData[date] || 0) + 1;
      } catch {
        console.error('Invalid timestamp:', log.timestamp);
      }
    });
    
    const sortedDates = Object.keys(timeData).sort();
    const values = sortedDates.map(date => timeData[date]);
    const total = values.reduce((a, b) => a + b, 0);
    const maxScans = Math.max(...values);
    const minScans = Math.min(...values);
    const avgScans = (total / values.length).toFixed(1);
    
    const peakDate = sortedDates[values.indexOf(maxScans)];
    const lowDate = sortedDates[values.indexOf(minScans)];
    
    return (
      <div style={{ padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: '#1e293b' }}>
        <p><strong>Total Scans:</strong> {total}</p>
        <p><strong>Peak Day:</strong> {peakDate} ({maxScans} scans)</p>
        <p><strong>Lowest Day:</strong> {lowDate} ({minScans} scans)</p>
        <p><strong>Average per Day:</strong> {avgScans} scans</p>
        <p><strong>Trend Analysis:</strong> Shows scanning activity patterns over time.</p>
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
          background: 'radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          opacity: 0.9
        }} />
        <Line data={chartData} options={options} />
      </div>
      {analysis}
    </div>
  );
};

export default ScansOverTimeChart; 