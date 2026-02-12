import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, Image as ImageIcon, Loader } from 'lucide-react';
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
  };

  // Generate prediction
  const handleGenerate = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Call API
      const result = await api.generatePrediction(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        // Navigate to results page with data
        navigate('/results', { state: { result: result.data, inputFile: file } });
      } else {
        setError(result.error || 'Generation failed');
        setProgress(0);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Generate Green Visualization
          </h1>
          <p className="text-xl text-gray-600">
            Upload a building mask and watch AI create green spaces
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {!file ? (
            // File Upload Zone
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`file-upload-area p-12 text-center cursor-pointer ${
                isDragging ? 'drag-active' : ''
              }`}
            >
              <input
                type="file"
                id="file-input"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-6 rounded-full mb-4">
                    <UploadIcon className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Drop your image here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: PNG, JPEG (Max 10MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            // File Preview
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ImageIcon className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="progress-bar h-2"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          {file && (
            <button
              onClick={handleGenerate}
              disabled={isProcessing}
              className="w-full mt-6 bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Generate Green Visualization
                </>
              )}
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Tips for Best Results</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Use clear, high-contrast building mask images</li>
            <li>• Black and white images work best</li>
            <li>• Ensure buildings are clearly defined</li>
            <li>• Recommended size: 256x256 pixels or larger</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Upload;