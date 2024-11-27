// src/components/Home/Philosophy.jsx
import React from 'react';
import './Philosophy.css'; // Pastikan mengimpor stylesheet
import ecovisionLogo from '../../images/ECO-1.png'; // Pastikan kamu punya logo ini di folder images

const Philosophy = () => {
  return (
    <section className="philosophy">
      <div className="philosophy-content">
        <img src={ecovisionLogo} alt="ECOVision Logo" className="philosophy-logo" />
        
        <p className="philosophy-description">
        "ECOVision embodies the harmony between technological advancement and environmental sustainability. By merging the concepts of ecology and vision, we aim to create a future where innovation and nature coexist in balance, driving progress while preserving the planet for future generations."
        </p>
        
      </div>
    </section>
  );
};

export default Philosophy;
