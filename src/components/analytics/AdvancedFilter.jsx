import React, { useState } from 'react';
import './AdvancedFilter.css';

const AdvancedFilter = ({ 
  searchTerm, 
  onSearchChange, 
  selectedStage, 
  onStageChange, 
  selectedVolunteer, 
  onVolunteerChange,
  stages,
  volunteers 
}) => {
  const activeFiltersCount = [
    searchTerm && 1,
    selectedStage !== 'all' && 1,
    selectedVolunteer !== 'all' && 1
  ].filter(Boolean).length;

  return (
    <div className="compact-filters">
      {/* Quick Search */}
      <div className="filter-item">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search students, volunteers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Stage Filter */}
      <div className="filter-item">
        <select
          className="filter-select"
          value={selectedStage}
          onChange={(e) => onStageChange(e.target.value)}
        >
          {stages.map(stage => (
            <option key={stage} value={stage}>
              {stage === 'all' ? 'All Stages' : stage.charAt(0).toUpperCase() + stage.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Volunteer Filter */}
      <div className="filter-item">
        <select
          className="filter-select"
          value={selectedVolunteer}
          onChange={(e) => onVolunteerChange(e.target.value)}
        >
          {volunteers.map(volunteer => (
            <option key={volunteer} value={volunteer}>
              {volunteer === 'all' ? 'All Volunteers' : volunteer}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Count */}
      {activeFiltersCount > 0 && (
        <div className="filters-badge">
          <span className="badge-text">{activeFiltersCount} Active</span>
          <button 
            className="clear-filters"
            onClick={() => {
              onSearchChange('');
              onStageChange('all');
              onVolunteerChange('all');
            }}
            title="Clear all filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter; 