import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'; // CSS untuk header
import logo from './ECO.png'; // Mengimpor file PNG dari folder yang sama

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">EcoVision<span className="highlight">AI</span></span>
        </Link>

        <nav className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/scan" 
            className={`nav-link ${location.pathname === '/scan' ? 'active' : ''}`}
          >
            Identify Plant
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
