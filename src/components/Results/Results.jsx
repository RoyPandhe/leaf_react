// src/components/Results/Results.jsx
import React from 'react';
import './Results.css';

const Results = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="results-container loading">
        <div className="loader"></div>
        <p>Analyzing your plant...</p>
      </div>
    );
  }

  if (!data) return <p>No results found. Please try again.</p>;

  return (
    <div className="results-container">
      <div className="result-card">
        <div className="confidence-meter">
          <div 
            className="confidence-fill"
            style={{ width: `${data.confidence}%` }}
          />
          <span>{Math.round(data.confidence)}% Confidence</span>
        </div>
        
        <div className="labels-container">
          {data.labels && data.labels.map((label, index) => (
            <span key={index} className="label-tag">
              {label}
            </span>
          ))}
        </div>

        <div className="description">
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
