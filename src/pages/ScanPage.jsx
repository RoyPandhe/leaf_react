import React, { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import Camera from "../components/Camera/Camera";
import Results from "../components/Results/Results";
import "./ScanPage.css";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-browser";

// AWS Configuration
const AWS_CONFIG = {
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.REACT_APP_AWS_ENDPOINT,
  stage: process.env.REACT_APP_AWS_STAGE
};

const ScanPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    const storedImageKey = sessionStorage.getItem("selectedImageKey");
    if (storedImageKey) {
      setSelectedImage(storedImageKey);
    }
  }, []);

  const setHistory = (data) => {
    const history = JSON.parse(localStorage.getItem('plantHistory')) || [];
  
    history.push({
      plantName: data.name_indo,
      scientificName: data.name_latin,
      category: data.category,
      confidence: data.confidence,
      description: data.description,
      date: new Date().toISOString(),
      imageKey: selectedImage
    });
  
    localStorage.setItem('plantHistory', JSON.stringify(history));
  };

  const handleImageSelect = (imageKey) => {
    console.log("Received image key:", imageKey);
    setSelectedImage(imageKey);
    sessionStorage.setItem("selectedImageKey", imageKey);
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  const createSignedRequest = async (requestBody) => {
    const signer = new SignatureV4({
      credentials: AWS_CONFIG.credentials,
      region: AWS_CONFIG.region,
      service: 'execute-api',
      sha256: Sha256
    });

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'host': new URL(AWS_CONFIG.endpoint).host
      },
      body: JSON.stringify(requestBody),
      path: /${AWS_CONFIG.stage}/identify-plant,
      hostname: new URL(AWS_CONFIG.endpoint).host,
      protocol: 'https:'
    };

    try {
      const signedRequest = await signer.sign(request);
      return signedRequest;
    } catch (error) {
      console.error('Signing error:', error);
      throw new Error('Failed to sign request');
    }
  };

  const handleScan = async () => {
    if (!selectedImage) {
      setError("Please upload an image or capture one using the camera.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        bucket: "user-uploaded-leaf-image",
        image_key: selectedImage,
      };

      // Get signed request
      const signedRequest = await createSignedRequest(requestBody);
      console.log("Signed request headers:", signedRequest.headers);

      // Make the API call with signed request
      const response = await fetch(
        ${AWS_CONFIG,endpoint}/${AWS_CONFIG.stage}/identify-plant,
        {
          method: 'POST',
          headers: {
            ...signedRequest.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to identify plant");
      }

      if (!data.name_indo && !data.name_latin) {
        throw new Error("Invalid response format from server");
      }

      setResults(data);
      setHistory(data);
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
          className={tab-button ${activeTab === "upload" ? "active" : ""}}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={tab-button ${activeTab === "camera" ? "active" : ""}}
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
          <div>
            <button
              type="button"
              className="scan-button"
              onClick={handleScan}
              disabled={isLoading}
            >
              {isLoading ? "Identifying..." : "Identify Leaf"}
            </button>
          </div>
        )}

        {results && <Results data={results} loading={isLoading} />}
      </div>
    </div>
  );
};

export default ScanPage;