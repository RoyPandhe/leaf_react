import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h3>Smart Agriculture</h3>
          <h1>
          Get to know the leaves of Java's mountains: consume or avoid? 
          Detection with Modern Image Processing
            
          </h1>
          
          <div className="hero-buttons">
            <Link to="/scan" className="btn btn-primary">
              Start Identifying
            </Link>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-container">
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
