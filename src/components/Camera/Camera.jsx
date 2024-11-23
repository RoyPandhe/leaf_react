// src/components/Camera/Camera.jsx
import React, { useRef, useState, useCallback } from 'react';
import './Camera.css';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStreaming(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please make sure you have granted camera permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    
    // Convert to file
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
      onCapture(file);
      stopCamera();
    }, 'image/jpeg');
  }, [onCapture, stopCamera]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      {error && <div className="camera-error">{error}</div>}
      
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        className="camera-preview"
      />

      <div className="camera-controls">
        {!isStreaming ? (
          <button 
            type="button"
            onClick={startCamera} 
            className="camera-button"
          >
            Start Camera
          </button>
        ) : (
          <>
            <button 
              type="button"
              onClick={captureImage} 
              className="capture-button"
            >
              Take Photo
            </button>
            <button 
              type="button"
              onClick={stopCamera} 
              className="stop-button"
            >
              Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Camera;
