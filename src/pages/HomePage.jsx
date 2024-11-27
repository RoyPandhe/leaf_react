// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import About from '../components/Home/About';
import Philosophy from '../components/Home/Philosophy';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <About />
      <Philosophy />
    </div>
  );
};

export default HomePage;
