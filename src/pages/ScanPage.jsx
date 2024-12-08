import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import Camera from "../components/Camera/Camera";
import Results from "../components/Results/Results";
import "./ScanPage.css";

const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'camera'

  // Load image from sessionStorage when the page is loaded
  useEffect(() => {
    const storedImageKey = sessionStorage.getItem("selectedImageKey");
    if (storedImageKey) {
      setSelectedImage(storedImageKey);
    }
  }, []);

  // Save image key to sessionStorage when it is selected
  const handleImageSelect = (imageKey) => {
    setSelectedImage(imageKey);
    sessionStorage.setItem("selectedImageKey", imageKey); // Store image key in sessionStorage
    setResults(null); // Clear previous results when new image is selected
    setIsLoading(false); // Disable loading state when image is selected
  };

  const handleScan = async () => {
    if (!selectedImage) {
      alert("Please upload an image or capture one using the camera.");
      return;
    }

    setIsLoading(true);
    try {
      // Call the API Gateway endpoint to identify the plant
      const response = await fetch(
        "https://2deffx0k0d.execute-api.us-east-1.amazonaws.com/dev/identify-plant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bucket: "your-s3-bucket-name", // Replace with your S3 bucket name
            image_key: selectedImage, // Pass the image key stored in session
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to identify plant");
      }

      const data = await response.json();
      setResults(data); // Set the results from the API response
    } catch (error) {
      console.error("Error scanning plant:", error);
      alert("Error identifying plant. Please try again.");
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
          className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === "camera" ? "active" : ""}`}
          onClick={() => setActiveTab("camera")}
        >
          Use Camera
        </button>
      </div>

      <div className="scan-content">
        {activeTab === "upload" ? (
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
            {isLoading ? "Identifying..." : "Identify Plant"}
          </button>
        )}

        {results && <Results data={results} loading={isLoading} />}
      </div>
    </div>
  );
};

export default ScanPage;
