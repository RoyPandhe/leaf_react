import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import Camera from "../components/Camera/Camera";
import Results from "../components/Results/Results";
import "./ScanPage.css";

const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

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
    sessionStorage.setItem("selectedImageKey", imageKey);
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  const handleScan = async () => {
    if (!selectedImage) {
      setError("Please upload an image or capture one using the camera.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Debug log the request
      const requestBody = {
        bucket: "user-uploaded-leaf-image", // Make sure this is your actual bucket name
        image_key: selectedImage,
      };
      console.log("Sending request with:", requestBody);

      const response = await fetch(
        "https://h0ckkuldh5.execute-api.us-east-1.amazonaws.com/dev/identify-plant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Debug log the response
      console.log("Response status:", response.status);

      // Always try to parse the response body
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to identify plant");
      }

      // Validate response data
      if (!data.name_indo && !data.name_latin) {
        throw new Error("Invalid response format from server");
      }

      setResults(data);
      setError(null);
    } catch (error) {
      console.error("Error details:", error);
      setError(error.message || "Error identifying plant. Please try again.");
      setResults(null);
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

        {error && <div className="error-message">{error}</div>}

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
