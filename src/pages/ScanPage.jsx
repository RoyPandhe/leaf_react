// src/pages/ScanPage.jsx
import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload/ImageUpload';
import Camera from '../components/Camera/Camera';
import Results from '../components/Results/Results';
import './ScanPage.css';

const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'

  // Load image from sessionStorage when the page is loaded
  useEffect(() => {
    const storedImage = sessionStorage.getItem('selectedImage');
    if (storedImage) {
      setSelectedImage(JSON.parse(storedImage));
    }
  }, []);

  // Save image to sessionStorage when it is selected
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    sessionStorage.setItem('selectedImage', JSON.stringify(file)); // Store image in sessionStorage
    setResults(null); // Clear previous results when new image is selected
    setIsLoading(false); // Disable loading state when image is selected
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      // Create FormData to send the image to the server
      const formData = new FormData();
      formData.append("image", selectedImage);
      
      // Call backend API to process the image
      const response = await fetch('/api/scan', {  // Replace with your API endpoint
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant');
      }

      const data = await response.json();
      setResults(data); // Set the results from the API response
    } catch (error) {
      console.error('Error scanning plant:', error);
      alert('Error identifying plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scan-page">
      <h1>Scan Your Leaf</h1>
      
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

        {results && <Results data={results} loading={isLoading} />}
      </div>
    </div>
  );
};

export default ScanPage;
