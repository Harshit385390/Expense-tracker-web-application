import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ userName, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/income', icon: '💰', label: 'Income' },
    { path: '/expense', icon: '💸', label: 'Expense' },
    { path: '/transactions', icon: '📋', label: 'All Transactions' },
  ];

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Expense Tracker</h1>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="user-info">
          <h3>{userName || 'User'}</h3>
          <p>Welcome back!</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        
        <button 
          onClick={handleLogoutClick}
          className="nav-item"
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;