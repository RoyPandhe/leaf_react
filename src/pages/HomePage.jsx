// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
    </div>
  );
};

export default HomePage;
