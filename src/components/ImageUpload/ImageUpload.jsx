import React, { useState, useEffect } from "react";
import "./ImageUpload.css";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ImageUpload = ({ onImageSelect }) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Load saved image from Local Storage when component mounts
    useEffect(() => {
        const savedImage = localStorage.getItem("uploadedImage");
        if (savedImage) {
            setPreview(savedImage);
        }
    }, []);

    // Handle file validation and upload
    const handleFile = async (file) => {
        if (!file || !file.type.startsWith("image/")) {
            setUploadError("Please upload a valid image file.");
            return;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setUploadError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setUploadError("Unsupported file type. Only JPEG, PNG, or WEBP are allowed.");
            return;
        }

        // Generate unique key for the file
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        console.log("Generated unique filename:", uniqueFileName); // Debug log

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            const filePreview = reader.result;
            setPreview(filePreview);
            localStorage.setItem("uploadedImage", filePreview);
        };
        reader.onerror = () => setUploadError("Error reading file. Please try again.");
        reader.readAsDataURL(file);

        // Upload the file and get the image key
        try {
            const imageKey = await uploadFile(file, uniqueFileName);
            console.log("Uploaded image key:", imageKey); // Debug log
            onImageSelect(imageKey); // Pass the image key to parent
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError("Failed to upload image. Please try again.");
        }
    };

    // Get pre-signed URL
    const getPresignedUrl = async (fileName) => {
        try {
            const response = await fetch(
                `https://82of8sp36i.execute-api.us-east-1.amazonaws.com/dev/upload?fileName=${fileName}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch presigned URL");
            const data = await response.json();
            return data.presignedUrl;
        } catch (error) {
            setUploadError(`Error fetching pre-signed URL: ${error.message}`);
            throw error;
        }
    };

    // Upload the file to S3
    const uploadFile = async (file, fileName) => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const presignedUrl = await getPresignedUrl(fileName);
            if (!presignedUrl) throw new Error("Failed to get presigned URL");

            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload image");
            }

            console.log("File uploaded successfully:", fileName); // Debug log
            return fileName; // Return the filename as the image key
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError(`Error uploading image: ${error.message}`);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="image-upload-container">
            {!preview && (
                <div
                    className={`upload-area ${dragActive ? "drag-active" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="image-input"
                        className="file-input"
                        accept="image/*"
                        onChange={handleChange}
                        disabled={isUploading}
                    />
                    <label htmlFor="image-input" className="upload-label">
                        <div className="upload-content">
                            <div className="upload-icon">📸</div>
                            <p>Drag and drop your image here or</p>
                            <button type="button" className="browse-button" disabled={isUploading}>
                                Browse Files
                            </button>
                        </div>
                    </label>
                </div>
            )}

            {preview && (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="image-preview" />
                    <button
                        type="button"
                        className="remove-button"
                        onClick={() => {
                            setPreview(null);
                            onImageSelect(null);
                            localStorage.removeItem("uploadedImage");
                        }}
                        disabled={isUploading}
                    >
                        Remove Image
                    </button>
                </div>
            )}

            {uploadError && (
                <div className="error-message">
                    <p>{uploadError}</p>
                </div>
            )}

            {isUploading && (
                <div className="uploading-message">
                    <p>Uploading...</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
