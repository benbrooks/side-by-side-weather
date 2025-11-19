import { Cloud } from 'lucide-react';
import { useLocations } from './hooks/useLocations';
import { LocationInput } from './components/LocationInput';
import { WeatherCard } from './components/WeatherCard';

function App() {
  const { locations, addLocation, removeLocation, canAddMore } = useLocations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Weather Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Compare weather forecasts for up to 3 locations
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Location Input */}
        <LocationInput onAddLocation={addLocation} canAddMore={canAddMore} />

        {/* Weather Cards */}
        {locations.length === 0 ? (
          <div className="text-center py-16">
            <Cloud className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No locations added yet</h2>
            <p className="text-muted-foreground">
              Search for a city or zip code above to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => (
              <WeatherCard
                key={`${location.latitude}-${location.longitude}`}
                location={location}
                onRemove={() => removeLocation(index)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Weather data provided by Open-Meteo.com</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
