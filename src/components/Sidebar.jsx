import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';
import logo from '../assets/Login.svg'; // Placeholder logo

const ADMIN_USERS = ['Piyush', 'Aryan'];

const Sidebar = ({ onToggleTheme, theme }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [mobileOpen]);

  const getUserName = () => {
    if (!user) return '';
    if (user.displayName) return user.displayName.toLowerCase();
    if (user.email) return user.email.split('@')[0].toLowerCase();
    return '';
  };

  const userName = getUserName();
  const isAdmin = ADMIN_USERS.includes(userName);
  const role = isAdmin ? 'Administrator' : 'Volunteer';

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/arrival', label: 'Arrival', icon: '🛬' },
    { to: '/hostel', label: 'Hostel', icon: '🏨' },
    { to: '/documents', label: 'Documents', icon: '📄' },
    { to: '/kit', label: 'Kit', icon: '🎒' },
    { to: '/sendqr', label: 'Send QR', icon: '📧' },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      {!mobileOpen && (
        <button
          className="sidebar-hamburger"
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}
      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}
      <aside className={`sidebar${theme === 'dark' ? ' dark' : ''}${mobileOpen ? ' open' : ''}`}> 
        <div className="sidebar-logo">
          <img src={logo} alt="Desk Buddy Logo" />
          <span className="sidebar-title">DeskBuddy</span>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                'sidebar-link' + (isActive || location.pathname.startsWith(link.to) ? ' active' : '')
              }
              onClick={() => setMobileOpen(false)} // close on nav click
            >
              <span className="sidebar-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{userName}</span>
              <span className="sidebar-user-role">{role}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout}>Sign Out</button>
          <div className="sidebar-toggle">
            <label className="toggle-switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={onToggleTheme} />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 