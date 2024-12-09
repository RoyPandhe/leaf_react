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

  // Parse the description string into an array if it's not already an array
  const descriptionList = Array.isArray(data.description) 
    ? data.description 
    : data.description.split('|').map(item => item.trim());

  // Determine confidence color based on category
  const isNonEdible = data.category === 'Non Edible';
  const confidenceColorClass = isNonEdible ? 'confidence-fill-red' : 'confidence-fill-green';

  return (
    <div className="results-container">
      <div className="result-card">
        {/* Confidence Meter */}
        <div className="confidence-meter">
          <div 
            className={`confidence-fill ${confidenceColorClass}`}
            style={{ width: `${data.confidence}%` }}
          />
          <span>{Math.round(data.confidence)}% Confidence</span>
        </div>

        {/* Plant Names and Category */}
        <div className="plant-names">
          <h2 className="plant-name">{data.name_indo}</h2>
          <h3 className="scientific-name">{data.name_latin}</h3>
          <div className={`category-badge ${isNonEdible ? 'non-edible' : 'edible'}`}>
            {data.category}
          </div>
        </div>
        
        {/* Description List */}
        <div className="description">
          <h4>Description:</h4>
          <ul className="description-list">
            {descriptionList.map((item, index) => (
              <li key={index} className="description-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Results;
