/**
 * API Service for Eco-Urbanist AI
 * Handles all communication with the backend
 */

import axios from 'axios';

// Base URL for API - empty string for same domain (production), localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service Object
 */
const api = {
  /**
   * Get API health status
   */
  getHealth: async () => {
    try {
      const response = await apiClient.get('/api/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get service information
   */
  getServiceInfo: async () => {
    try {
      const response = await apiClient.get('/api/service-info');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to get service info:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Calculate green score for an image
   * @param {File} imageFile - Image file to analyze
   */
  calculateGreenScore: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await apiClient.post('/api/green-score', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Green score calculation failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },

  /**
   * Generate AI prediction (main feature)
   * @param {File} imageFile - Building mask image
   */
  generatePrediction: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await apiClient.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important: receive image as blob
        timeout: 60000, // 60 seconds for AI processing
      });

      // Convert blob to data URL for display
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);

      return { success: true, data: imageUrl };
    } catch (error) {
      console.error('Prediction failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Prediction failed'
      };
    }
  },

  /**
   * List all generated output images
   */
  listOutputs: async () => {
    try {
      const response = await apiClient.get('/api/list-outputs');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to list outputs:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get download URL for a generated image
   * @param {string} filename - Name of the generated image
   */
  getDownloadUrl: (filename) => {
    return `${API_BASE_URL}/api/download/${filename}`;
  },

  /**
   * Download a generated image
   * @param {string} filename - Name of the file to download
   */
  downloadImage: async (filename) => {
    try {
      const response = await apiClient.get(`/api/download/${filename}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return { success: false, error: error.message };
    }
  },
};

export default api;