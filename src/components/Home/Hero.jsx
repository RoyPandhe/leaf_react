import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>
            Discover the World of
            <span className="highlight"> Leaves</span>
          </h1>
          <p>
          Effortlessly identify highland plant leaves, uncover their unique traits, and explore their ecological benefits with cutting-edge AI technology
          </p>
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
            <img 
              src="/assets/hero-plant.png" 
              alt="Plant identification illustration" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
