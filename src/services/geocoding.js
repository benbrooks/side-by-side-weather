/**
 * Geocoding service using Open-Meteo Geocoding API
 * Converts city names and zip codes to coordinates
 */

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Search for a location by name or zip code
 * @param {string} query - City name or zip code
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocation(query) {
  if (!query || query.trim() === '') {
    throw new Error('Query cannot be empty');
  }

  try {
    const url = new URL(GEOCODING_API);
    url.searchParams.append('name', query.trim());
    url.searchParams.append('count', '10');
    url.searchParams.append('language', 'en');
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Format results
    return data.results.map(result => ({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1, // State/Region
      timezone: result.timezone,
      displayName: formatDisplayName(result),
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * Format a display name for a location
 * @param {Object} location - Location object from API
 * @returns {string} Formatted display name
 */
function formatDisplayName(location) {
  const parts = [location.name];

  if (location.admin1) {
    parts.push(location.admin1);
  }

  if (location.country) {
    parts.push(location.country);
  }

  return parts.join(', ');
}
