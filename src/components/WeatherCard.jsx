import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { getWeatherForecast } from '../services/weather';
import { WeatherIcon } from './WeatherIcon';

export function WeatherCard({ location, onRemove }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [location.latitude, location.longitude]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherForecast(
        location.latitude,
        location.longitude,
        location.timezone
      );
      setForecast(data);
    } catch (err) {
      setError('Failed to load weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{location.displayName}</h2>
          <p className="text-sm text-muted-foreground">
            {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-accent rounded-md transition-colors"
          title="Remove location"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={fetchWeather}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {forecast && !loading && !error && (
          <div className="space-y-2">
            {forecast.daily.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors border border-border"
              >
                {/* Date and Icon */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <WeatherIcon weatherCode={day.weatherCode} className="w-8 h-8 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.precipitationProbability > 0 && (
                        <span>{day.precipitationProbability}% rain</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-muted-foreground text-sm">{day.temperatureMin}°</span>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"></div>
                  <span className="text-foreground font-semibold">{day.temperatureMax}°</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
