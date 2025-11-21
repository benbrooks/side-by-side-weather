/**
 * Geocoding service using Open-Meteo Geocoding API
 * Converts city names and zip codes to coordinates
 */

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

// US State abbreviations to full names
const STATE_ABBREVIATIONS = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia'
};

/**
 * Expand state abbreviations in a query string
 * @param {string} query - Search query
 * @returns {string} Query with expanded state names
 */
function expandStateAbbreviation(query) {
  // Match patterns like "Boulder, CO" or "Boulder CO"
  const parts = query.split(/[,\s]+/).filter(Boolean);

  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1].toUpperCase();
    if (STATE_ABBREVIATIONS[lastPart]) {
      parts[parts.length - 1] = STATE_ABBREVIATIONS[lastPart];
      return parts.join(' ');
    }
  }

  return query;
}

/**
 * Search for a location by name or zip code
 * @param {string} query - City name or zip code
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocation(query) {
  if (!query || query.trim() === '') {
    throw new Error('Query cannot be empty');
  }

  // Expand state abbreviations
  const expandedQuery = expandStateAbbreviation(query.trim());

  try {
    const url = new URL(GEOCODING_API);
    url.searchParams.append('name', expandedQuery);
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
