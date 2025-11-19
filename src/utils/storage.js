/**
 * LocalStorage utility for persisting location data
 */

const STORAGE_KEY = 'weather-dashboard-locations';

/**
 * Save locations to localStorage
 * @param {Array} locations - Array of location objects
 */
export function saveLocations(locations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error('Error saving locations to localStorage:', error);
  }
}

/**
 * Load locations from localStorage
 * @returns {Array} Array of location objects
 */
export function loadLocations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading locations from localStorage:', error);
    return [];
  }
}

/**
 * Clear all locations from localStorage
 */
export function clearLocations() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing locations from localStorage:', error);
  }
}
