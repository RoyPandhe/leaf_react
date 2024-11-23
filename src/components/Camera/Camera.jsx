import React, { useRef, useState, useCallback } from 'react';
import './Camera.css';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // State untuk menyimpan gambar yang diambil
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

  const captureImage = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    // Konversi canvas menjadi file
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });

      try {
        // Ambil presigned URL untuk upload ke S3
        const presignedUrlResponse = await fetch(`https://82of8sp36i.execute-api.us-east-1.amazonaws.com/dev/upload?fileName=${file.name}`, {
          method: 'GET',  // Pastikan metode yang benar (GET/POST)
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!presignedUrlResponse.ok) {
          throw new Error('Failed to get presigned URL');
        }

        const presignedUrlData = await presignedUrlResponse.json();
        console.log("Presigned URL Response:", presignedUrlData);
        const presignedUrl = presignedUrlData.presignedUrl;

        // Upload file ke S3 menggunakan presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.ok) {
          // Jika upload sukses, kirim file ke parent component
          onCapture(file);
        } else {
          console.error("Failed to upload image to S3.");
          alert("Failed to upload the image.");
        }
      } catch (error) {
        console.error("Error during image upload:", error);
        alert('Error capturing or uploading the image. Please try again.');
      }

      // Menyimpan gambar yang diambil dalam state untuk ditampilkan
      const imageUrl = URL.createObjectURL(blob);  // Membuat URL sementara untuk gambar
      setCapturedImage(imageUrl); // Menyimpan URL gambar di state

      stopCamera();
    }, 'image/jpeg');
  }, [onCapture, stopCamera]);

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

      {/* Menampilkan gambar yang diambil */}
      {capturedImage && (
        <div className="captured-image-container">
          <h3>Captured Image</h3>
          <img src={capturedImage} alt="Captured" className="captured-image" />
        </div>
      )}
    </div>
  );
};

export default Camera;
