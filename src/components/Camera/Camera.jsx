import React, { useRef, useState, useCallback, useEffect } from 'react';
import './Camera.css';

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

    // Menyesuaikan ukuran canvas dengan ukuran video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mengatur filter untuk meningkatkan kecerahan gambar
    ctx.filter = 'brightness(1.2)';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Mengonversi canvas menjadi file gambar
    canvas.toBlob(async (blob) => {
      const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });

      // Simpan URL gambar untuk ditampilkan
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);
      onCapture(file); // Kirim file gambar ke parent component

      // Proses upload ke S3 melalui pre-signed URL
      const presignedUrl = await getPresignedUrl(file.name);
      if (presignedUrl) {
        await uploadToS3UsingPresignedUrl(file, presignedUrl);
      }

      stopCamera(); // Hentikan kamera setelah foto diambil
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
