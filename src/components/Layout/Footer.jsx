// src/components/Layout/Footer.jsx
import React from 'react';
import './Footer.css'; // Pastikan mengimpor stylesheet

// Import ikon sosial media
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © 2024 ECOVision. All Rights Reserved.
        </p>
        <div className="footer-socials">
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
