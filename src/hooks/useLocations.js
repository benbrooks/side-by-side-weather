import { useState, useEffect } from 'react';
import { loadLocations, saveLocations } from '../utils/storage';

/**
 * Custom hook for managing weather locations with localStorage persistence
 */
export function useLocations() {
  const [locations, setLocations] = useState([]);

  // Load locations from localStorage on mount
  useEffect(() => {
    const savedLocations = loadLocations();
    setLocations(savedLocations);
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    saveLocations(locations);
  }, [locations]);

  /**
   * Add a new location
   * @param {Object} location - Location object with coordinates and display info
   */
  const addLocation = (location) => {
    setLocations((prev) => {
      // Limit to 3 locations
      if (prev.length >= 3) {
        return prev;
      }
      // Check if location already exists
      const exists = prev.some(
        (loc) => loc.latitude === location.latitude && loc.longitude === location.longitude
      );
      if (exists) {
        return prev;
      }
      return [...prev, location];
    });
  };

  /**
   * Remove a location by index
   * @param {number} index - Index of location to remove
   */
  const removeLocation = (index) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Clear all locations
   */
  const clearAllLocations = () => {
    setLocations([]);
  };

  return {
    locations,
    addLocation,
    removeLocation,
    clearAllLocations,
    canAddMore: locations.length < 3,
  };
}
