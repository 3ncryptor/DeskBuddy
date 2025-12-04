import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

const ScansByStageChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#64748b'],
          borderWidth: 3,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          hoverOffset: 8,
        }]
      };
    }

    const stageCounts = {};
    data.forEach(log => {
      const stage = log.stage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });
    
    const colors = [
      'rgba(59, 130, 246, 0.9)', 'rgba(245, 158, 11, 0.9)', 
      'rgba(16, 185, 129, 0.9)', 'rgba(139, 92, 246, 0.9)',
      'rgba(239, 68, 68, 0.9)', 'rgba(6, 182, 212, 0.9)', 
      'rgba(132, 204, 22, 0.9)', 'rgba(249, 115, 22, 0.9)'
    ];
    
    const hoverColors = [
      'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 
      'rgba(16, 185, 129, 1)', 'rgba(139, 92, 246, 1)',
      'rgba(239, 68, 68, 1)', 'rgba(6, 182, 212, 1)', 
      'rgba(132, 204, 22, 1)', 'rgba(249, 115, 22, 1)'
    ];
    
    return {
      labels: Object.keys(stageCounts),
      datasets: [{
        data: Object.values(stageCounts),
        backgroundColor: colors.slice(0, Object.keys(stageCounts).length),
        hoverBackgroundColor: hoverColors.slice(0, Object.keys(stageCounts).length),
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverOffset: 12,
        spacing: 2
      }]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutCubic'
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#1e293b',
          padding: 20,
          usePointStyle: true,
          font: { 
            size: 12,
            family: 'Inter, system-ui, sans-serif',
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        },
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return [`Scans: ${context.parsed}`, `Percentage: ${percentage}%`];
          }
        },
        filter: function(tooltipItem) {
          return tooltipItem.parsed > 0;
        }
      }
    },
    cutout: '65%',
    radius: '90%',
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        hoverBorderWidth: 4,
        hoverBorderColor: 'rgba(255, 255, 255, 1)'
      }
    },
    onHover: (event, activeElements, chart) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
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

    const stageCounts = {};
    data.forEach(log => {
      const stage = log.stage || 'Unknown';
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });
    
    const total = Object.values(stageCounts).reduce((a, b) => a + b, 0);
    const sortedStages = Object.entries(stageCounts)
      .sort(([,a], [,b]) => b - a);
    
    const mostPopular = sortedStages[0];
    const leastPopular = sortedStages[sortedStages.length - 1];
    
    return (
      <div style={{ padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6', color: '#1e293b' }}>
        <p><strong>Total Scans:</strong> {total}</p>
        <p><strong>Most Popular Stage:</strong> {mostPopular[0]} ({mostPopular[1]} scans, {((mostPopular[1] / total) * 100).toFixed(1)}%)</p>
        <p><strong>Least Popular Stage:</strong> {leastPopular[0]} ({leastPopular[1]} scans, {((leastPopular[1] / total) * 100).toFixed(1)}%)</p>
        <p><strong>Stage Distribution:</strong> The data shows {Object.keys(stageCounts).length} different stages with varying completion rates.</p>
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
        {/* 3D inner glow effect */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          borderRadius: '16px',
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <Doughnut data={chartData} options={options} />
      </div>
      {analysis}
    </div>
  );
};

export default ScansByStageChart; 