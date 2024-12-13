import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'; // CSS untuk header
import logo from './ECO-1.png'; // Mengimpor file PNG dari folder yang sama

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State untuk menu hamburger
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>

        <button
          className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div className={`hamburger ${menuOpen ? 'open' : ''}`} />
        </button>

        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)} // Close menu on link click
          >
            Home
          </Link>
          <Link 
            to="/scan" 
            className={`nav-link ${location.pathname === '/scan' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Identify Leaf
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
