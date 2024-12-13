import React, { useRef, useState, useCallback, useEffect } from 'react';
import './Camera.css';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const streamRef = useRef(null);

  // Fungsi untuk memulai kamera
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

  // Fungsi untuk menghentikan kamera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop(); // Hentikan semua track
      });
      streamRef.current = null; // Bersihkan referensi stream
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null; // Setel ulang srcObject video
    }

    setIsStreaming(false); // Perbarui state isStreaming
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current) return;
  
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    ctx.filter = 'brightness(1.2)';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob(async (blob) => {
      // Generate unique filename
      const uniqueFileName = `image-${uuidv4()}.jpg`;
      const file = new File([blob], uniqueFileName, { type: "image/jpeg" });
  
      // Save captured image URL for preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
  
      try {
        // Get presigned URL and upload
        const presignedUrl = await getPresignedUrl(uniqueFileName);
        if (presignedUrl) {
          await uploadToS3UsingPresignedUrl(file, presignedUrl);
          // Pass only the filename/key to parent component
          onCapture(uniqueFileName);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to upload image');
      }
  
      stopCamera();
    }, 'image/jpeg');
  }, [onCapture, stopCamera]);

  const getPresignedUrl = async (fileName) => {
    const apiEndpoint = 'https://82of8sp36i.execute-api.us-east-1.amazonaws.com/dev/upload';

    try {
      const response = await fetch(`${apiEndpoint}?fileName=${fileName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pre-signed URL');
      }

      const data = await response.json();
      return data.presignedUrl;
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
      alert(`Error fetching pre-signed URL: ${error.message}`);
      return null;
    }
  };

  const uploadToS3UsingPresignedUrl = async (file, presignedUrl) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to S3');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
    }
  };

  const deleteImage = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      {error && <div className="camera-error">{error}</div>}

      {!capturedImage ? (
        <>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" class="svg-icon"><g stroke-width="2" stroke-linecap="round" stroke="#fff" fill-rule="evenodd" clip-rule="evenodd"><path d="m4 9c0-1.10457.89543-2 2-2h2l.44721-.89443c.33879-.67757 1.03131-1.10557 1.78889-1.10557h3.5278c.7576 0 1.4501.428 1.7889 1.10557l.4472.89443h2c1.1046 0 2 .89543 2 2v8c0 1.1046-.8954 2-2 2h-12c-1.10457 0-2-.8954-2-2z"></path><path d="m15 13c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3z"></path></g></svg>
                  <span class="lable">Take a Photo</span>
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
        </>
      ) : (
        <div className="captured-image-container">
          <h3>Captured Image</h3>
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <button
            type="button"
            onClick={deleteImage}
            className="delete-button"
          >
            Delete Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
