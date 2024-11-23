import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Instant Recognition',
      description: 'Advanced AI technology identifies plants in seconds'
    },
    {
      icon: '📸',
      title: 'Multiple Input Methods',
      description: 'Use your camera or upload existing photos'
    },
    {
      icon: '📚',
      title: 'Detailed Information',
      description: 'Learn about plant characteristics and care tips'
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      description: 'Simple and intuitive interface for everyone'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2>Why Choose PlantAI?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
