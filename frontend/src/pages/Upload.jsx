import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Image as ImageIcon, Loader, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { validateImageFile, fileToDataUrl } from '../utils/helpers';

const Upload = () => {
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Prevent duplicate API calls
  const isGeneratingRef = useRef(false);

  // Handle file selection
  const handleFileSelect = async (selectedFile) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFile(selectedFile);

    // Generate preview
    try {
      const dataUrl = await fileToDataUrl(selectedFile);
      setPreview(dataUrl);
    } catch (err) {
      setError('Failed to generate preview');
      console.error(err);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
    setStatusMessage('');
    isGeneratingRef.current = false;
  };

  // Generate prediction
  const handleGenerate = async () => {
    // CRITICAL: Prevent duplicate calls
    if (isGeneratingRef.current) {
      console.warn('⚠️ Generation already in progress, ignoring duplicate call');
      return;
    }

    if (!file) {
      setError('Please select an image first');
      return;
    }

    if (isProcessing) {
      console.warn('⚠️ Already processing, ignoring duplicate call');
      return;
    }

    // Set flag to prevent duplicate calls
    isGeneratingRef.current = true;
    setIsProcessing(true);
    setError(null);
    setProgress(10);
    setStatusMessage('Uploading image...');

    let progressInterval = null;

    try {
      // Simulate progress with status messages
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            setStatusMessage('AI is processing your image... This may take up to 5 minutes on free servers.');
            return 90;
          }
          
          // Update status messages
          if (prev < 30) {
            setStatusMessage('Uploading image...');
          } else if (prev < 60) {
            setStatusMessage('Validating satellite image...');
          } else {
            setStatusMessage('AI model is generating green spaces...');
          }
          
          return prev + 10;
        });
      }, 1000); // Update every second

      // Call API
      console.log('Calling API to generate prediction...');
      const result = await api.generatePrediction(file);

      // Clear interval
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      setProgress(100);
      setStatusMessage('Complete!');

      if (result.success) {
        // Success - navigate to results
        console.log('Success! Navigating to results...');
        
        // Small delay to show completion
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              result: result.data, 
              inputFile: file 
            },
            replace: true // Replace history entry to prevent back button issues
          });
        }, 500);
        
      } else {
        // API returned success: false
        setError(result.error || 'Generation failed. Please try again.');
        setProgress(0);
        setStatusMessage('');
        isGeneratingRef.current = false;
      }
      
    } catch (err) {
      // Clear interval on error
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      console.error('Prediction failed:', err);
      
      // Handle different error types
      if (err.response?.status === 400) {
        // Image validation error
        const errorData = err.response.data;
        if (errorData.detail && typeof errorData.detail === 'object') {
          setError(errorData.detail.message || 'Invalid image type. Please use a satellite/aerial image.');
        } else {
          setError(errorData.detail || 'Invalid image. Please use a satellite/aerial image.');
        }
      } else if (err.response?.status === 503) {
        setError('AI model is not available. Please try again later.');
      } else if (err.message === 'Network Error') {
        setError('Network error. The image might be too large or the server is not responding. Please try a smaller image.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      
      setProgress(0);
      setStatusMessage('');
      isGeneratingRef.current = false;
      
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    document.getElementById('fileInput')?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Satellite Image
          </h1>
          <p className="text-xl text-gray-600">
            Upload a satellite or aerial view to visualize green spaces
          </p>
          <p className="text-sm text-gray-500 mt-2">
            📡 Please use top-down satellite/aerial images for best results
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {!file ? (
            // Upload Zone
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition ${
                isDragging
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              <UploadIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drag & Drop Your Satellite Image
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse files
              </p>
              
              {/* Hidden file input */}
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
              
              {/* Browse button */}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer font-medium"
              >
                Select Image
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                Supports: PNG, JPEG (Max 10 MB)
              </p>
              <p className="text-xs text-green-600 mt-2">
                ✓ Works with desert AND city satellite images
              </p>
            </div>
          ) : (
            // Preview Zone
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Preview</h3>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  disabled={isProcessing}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg border-2 border-gray-200"
                />
              </div>

              <div className="mt-4 flex items-center text-gray-600">
                <ImageIcon className="w-5 h-5 mr-2" />
                <span>{file.name}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-600 font-medium">{error}</p>
                {error.includes('satellite') && (
                  <p className="text-red-500 text-sm mt-1">
                    💡 Tip: Use Google Maps satellite view screenshots or aerial photos
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {statusMessage}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                ⏱️ This process may take 1-5 minutes. Please be patient...
              </p>
            </div>
          )}

          {/* Generate Button */}
          {file && !isProcessing && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full mt-6 bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition font-semibold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader className="w-5 h-5 mr-2" />
              Generate Green Visualization
            </button>
          )}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">📸 Image Type</h4>
            <p className="text-sm text-gray-600">
              Use satellite/aerial views from Google Maps, Bing Maps, or drone photos
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">⚡ Processing Time</h4>
            <p className="text-sm text-gray-600">
              AI generation takes 1-5 minutes. Works with desert AND city images!
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">🌳 Accurate Analysis</h4>
            <p className="text-sm text-gray-600">
              Advanced algorithms detect real vegetation and suggest optimal green spaces
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;