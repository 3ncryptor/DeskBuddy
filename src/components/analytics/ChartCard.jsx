import React, { useState, useRef, useEffect } from 'react';

const ChartCard = ({ title, subtitle, icon, children, color = '#2563eb' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      });
    }
  };

  const getGradient = (baseColor) => {
    const gradients = {
      '#2563eb': 'linear-gradient(135deg, #2563eb, #3b82f6)',
      '#10b981': 'linear-gradient(135deg, #10b981, #34d399)',
      '#f59e0b': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      '#8b5cf6': 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    };
    return gradients[baseColor] || gradients['#2563eb'];
  };

  return (
    <div 
      ref={cardRef}
      className={`analytics-chart-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        '--chart-color': color,
        '--chart-gradient': getGradient(color),
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`
      }}
    >
      {/* Animated particles */}
      <div className="chart-particles">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              animationDelay: `${i * 0.8}s`,
              background: color
            }} 
          />
        ))}
      </div>
      
      {/* Interactive glow effect */}
      <div 
        className="interactive-glow" 
        style={{
          background: `radial-gradient(circle 300px at var(--mouse-x) var(--mouse-y), ${color}15, transparent)`,
          opacity: isHovered ? 1 : 0
        }} 
      />
      
      <div className="chart-card-header">
        <div className="header-content">
          <div className="chart-icon-container">
            <div 
              className="chart-icon" 
              style={{ background: getGradient(color) }}
            >
              {icon}
            </div>
            <div className="icon-pulse" style={{ background: `${color}30` }} />
          </div>
          <div className="chart-title-section">
            <h3 className="chart-title">{title}</h3>
            {subtitle && <p className="chart-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="chart-status">
          <div className="status-indicator">
            <div className="status-dot" style={{ background: color }}></div>
            <span>Active</span>
          </div>
        </div>
      </div>
      
      <div className="chart-content-area">
        <div className="chart-wrapper">
          {children}
        </div>
      </div>
      
      {/* Shimmer effect on hover */}
      <div className="shimmer-overlay" />
    </div>
  );
};

export default ChartCard; 