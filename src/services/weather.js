/**
 * Weather service using Open-Meteo API
 * Fetches weather forecast data
 */

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch weather forecast for a location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} timezone - Location timezone
 * @returns {Promise<Object>} Weather forecast data
 */
export async function getWeatherForecast(latitude, longitude, timezone = 'auto') {
  try {
    const url = new URL(WEATHER_API);
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
    url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode');
    url.searchParams.append('temperature_unit', 'fahrenheit');
    url.searchParams.append('timezone', timezone);
    url.searchParams.append('forecast_days', '16');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the daily forecast
    const dailyForecasts = data.daily.time.map((date, index) => ({
      date,
      temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
      temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
      precipitation: data.daily.precipitation_sum[index] || 0,
      precipitationProbability: data.daily.precipitation_probability_max[index] || 0,
      weatherCode: data.daily.weathercode[index],
    }));

    return {
      timezone: data.timezone,
      daily: dailyForecasts,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

/**
 * Get weather description and icon name from WMO weather code
 * @param {number} code - WMO weather code
 * @returns {Object} Weather description and icon name
 */
export function getWeatherInfo(code) {
  const weatherCodes = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Foggy', icon: 'cloud-fog' },
    48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
    56: { description: 'Light freezing drizzle', icon: 'cloud-drizzle' },
    57: { description: 'Dense freezing drizzle', icon: 'cloud-drizzle' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-rain' },
    65: { description: 'Heavy rain', icon: 'cloud-rain' },
    66: { description: 'Light freezing rain', icon: 'cloud-rain' },
    67: { description: 'Heavy freezing rain', icon: 'cloud-rain' },
    71: { description: 'Slight snow', icon: 'cloud-snow' },
    73: { description: 'Moderate snow', icon: 'cloud-snow' },
    75: { description: 'Heavy snow', icon: 'cloud-snow' },
    77: { description: 'Snow grains', icon: 'cloud-snow' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { description: 'Violent rain showers', icon: 'cloud-rain' },
    85: { description: 'Slight snow showers', icon: 'cloud-snow' },
    86: { description: 'Heavy snow showers', icon: 'cloud-snow' },
    95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
  };

  return weatherCodes[code] || { description: 'Unknown', icon: 'help-circle' };
}
