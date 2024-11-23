// src/pages/ScanPage.jsx
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import Camera from '../components/Camera/Camera';
import Results from '../components/Results/Results';
import './ScanPage.css';

const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'

  // Add this handleImageSelect function
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setResults(null); // Clear previous results when new image is selected
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      // Here you would implement your API call to identify the plant
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResults({
        plantName: "Sample Plant",
        confidence: 95,
        scientificName: "Plantus Exampleus",
        family: "Sample Family",
        description: "This is a sample plant description."
      });
    } catch (error) {
      console.error('Error scanning plant:', error);
      alert('Error identifying plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scan-page">
      <h1>Scan Your Plant</h1>
      
      <div className="scan-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          Use Camera
        </button>
      </div>

      <div className="scan-content">
        {activeTab === 'upload' ? (
          <ImageUpload onImageSelect={handleImageSelect} />
        ) : (
          <Camera onCapture={handleImageSelect} />
        )}
        
        {selectedImage && (
          <button 
            type="button"
            className="scan-button"
            onClick={handleScan}
            disabled={isLoading}
          >
            {isLoading ? 'Identifying...' : 'Identify Plant'}
          </button>
        )}

        {results && <Results results={results} />}
      </div>
    </div>
  );
};

export default ScanPage;
