/**
 * LocalStorage utility for gallery management
 */

const GALLERY_KEY = 'eco-urbanist-gallery';

export const galleryStorage = {
  /**
   * Get all gallery items
   */
  getAll: () => {
    try {
      const data = localStorage.getItem(GALLERY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading gallery:', error);
      return [];
    }
  },

  /**
   * Add new item to gallery
   */
  add: (item) => {
    try {
      const gallery = galleryStorage.getAll();
      const newItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...item,
      };
      gallery.unshift(newItem); // Add to beginning
      localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
      return newItem;
    } catch (error) {
      console.error('Error adding to gallery:', error);
      return null;
    }
  },

  /**
   * Delete item by ID
   */
  delete: (id) => {
    try {
      const gallery = galleryStorage.getAll();
      const filtered = gallery.filter(item => item.id !== id);
      localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting from gallery:', error);
      return false;
    }
  },

  /**
   * Clear all gallery items
   */
  clearAll: () => {
    try {
      localStorage.removeItem(GALLERY_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing gallery:', error);
      return false;
    }
  },

  /**
   * Get item by ID
   */
  getById: (id) => {
    try {
      const gallery = galleryStorage.getAll();
      return gallery.find(item => item.id === id);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  /**
   * Get gallery statistics
   */
  getStats: () => {
    try {
      const gallery = galleryStorage.getAll();
      if (gallery.length === 0) {
        return {
          totalImages: 0,
          averageImprovement: 0,
          totalTreesPlanted: 0,
        };
      }

      const totalTreesPlanted = gallery.reduce(
        (sum, item) => sum + (item.visualization?.trees_placed || 0),
        0
      );

      const totalImprovement = gallery.reduce(
        (sum, item) => sum + (item.greenScores?.improvement || 0),
        0
      );

      return {
        totalImages: gallery.length,
        averageImprovement: totalImprovement / gallery.length,
        totalTreesPlanted,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalImages: 0,
        averageImprovement: 0,
        totalTreesPlanted: 0,
      };
    }
  },
};