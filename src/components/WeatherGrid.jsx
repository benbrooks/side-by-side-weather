import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { getWeatherForecast } from '../services/weather';
import { WeatherIcon } from './WeatherIcon';

export function WeatherGrid({ locations, onRemoveLocation }) {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch weather for all locations
  useEffect(() => {
    locations.forEach((location, index) => {
      const key = `${location.latitude}-${location.longitude}`;
      if (!weatherData[key] && !loading[key]) {
        fetchWeatherForLocation(location, index);
      }
    });

    // Clean up weather data for removed locations
    const currentKeys = locations.map(loc => `${loc.latitude}-${loc.longitude}`);
    Object.keys(weatherData).forEach(key => {
      if (!currentKeys.includes(key)) {
        setWeatherData(prev => {
          const newData = { ...prev };
          delete newData[key];
          return newData;
        });
      }
    });
  }, [locations]);

  const fetchWeatherForLocation = async (location, index) => {
    const key = `${location.latitude}-${location.longitude}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));

    try {
      const data = await getWeatherForecast(
        location.latitude,
        location.longitude,
        location.timezone
      );
      setWeatherData(prev => ({ ...prev, [key]: data }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [key]: 'Failed to load weather' }));
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Get all unique dates from all weather data
  const getAllDates = () => {
    const allDates = new Set();
    Object.values(weatherData).forEach(data => {
      if (data?.daily) {
        data.daily.forEach(day => allDates.add(day.date));
      }
    });
    return Array.from(allDates).sort();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return { day: 'Today', full: dateString };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { day: 'Tomorrow', full: dateString };
    } else {
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        full: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    }
  };

  const isDateInRange = (dateString, location) => {
    if (!location.startDate && !location.endDate) return true;

    const date = new Date(dateString);
    const start = location.startDate ? new Date(location.startDate) : null;
    const end = location.endDate ? new Date(location.endDate) : null;

    if (start && end) {
      return date >= start && date <= end;
    } else if (start) {
      return date >= start;
    } else if (end) {
      return date <= end;
    }
    return true;
  };

  const getDayData = (location, dateString) => {
    const key = `${location.latitude}-${location.longitude}`;
    const data = weatherData[key];
    if (!data?.daily) return null;
    return data.daily.find(day => day.date === dateString);
  };

  const dates = getAllDates();
  const isLoading = locations.some(loc => loading[`${loc.latitude}-${loc.longitude}`]);

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header row with location names */}
        <thead>
          <tr>
            <th className="sticky left-0 bg-muted p-3 text-left font-semibold text-foreground border-b border-border min-w-[100px]">
              Date
            </th>
            {locations.map((location, index) => (
              <th
                key={`${location.latitude}-${location.longitude}`}
                className="bg-muted p-3 text-left border-b border-border min-w-[200px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">{location.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {location.admin1 && `${location.admin1}, `}{location.country}
                    </div>
                    {(location.startDate || location.endDate) && (
                      <div className="text-xs text-primary font-normal mt-1">
                        {location.startDate && new Date(location.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {location.startDate && location.endDate && ' - '}
                        {location.endDate && new Date(location.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveLocation(index)}
                    className="p-1 hover:bg-accent rounded-md transition-colors flex-shrink-0"
                    title="Remove location"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Loading state */}
        {isLoading && dates.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={locations.length + 1} className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
                <p className="mt-2 text-muted-foreground">Loading weather data...</p>
              </td>
            </tr>
          </tbody>
        )}

        {/* Weather data rows */}
        {dates.length > 0 && (
          <tbody>
            {dates.map((dateString) => {
              const formattedDate = formatDate(dateString);
              return (
                <tr key={dateString} className="border-b border-border hover:bg-accent/50">
                  {/* Date column */}
                  <td className="sticky left-0 bg-background p-3 border-r border-border">
                    <div className="font-medium text-foreground">{formattedDate.day}</div>
                    <div className="text-xs text-muted-foreground">{formattedDate.full}</div>
                  </td>

                  {/* Weather columns for each location */}
                  {locations.map((location) => {
                    const key = `${location.latitude}-${location.longitude}`;
                    const dayData = getDayData(location, dateString);
                    const isInRange = isDateInRange(dateString, location);
                    const isLoadingLoc = loading[key];
                    const hasError = errors[key];

                    return (
                      <td
                        key={key}
                        className={`p-3 border-r border-border last:border-r-0 ${
                          isInRange ? '' : 'opacity-40'
                        }`}
                      >
                        {isLoadingLoc && (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        )}

                        {hasError && (
                          <div className="flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Error</span>
                          </div>
                        )}

                        {dayData && !isLoadingLoc && !hasError && (
                          <div className="flex items-center gap-3">
                            <WeatherIcon weatherCode={dayData.weatherCode} className="w-8 h-8 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{dayData.temperatureMax}°</span>
                                <span className="text-muted-foreground">{dayData.temperatureMin}°</span>
                              </div>
                              {dayData.precipitationProbability > 0 && (
                                <div className="text-xs text-blue-600">
                                  {dayData.precipitationProbability}% precip
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
