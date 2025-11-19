import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchLocation } from '../services/geocoding';

export function LocationInput({ onAddLocation, canAddMore }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const locations = await searchLocation(query);
      setResults(locations);
      setShowResults(true);
    } catch (err) {
      setError('Failed to search locations. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location) => {
    onAddLocation(location);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city name or zip code..."
              disabled={!canAddMore}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isSearching || !canAddMore}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {!canAddMore && (
          <p className="text-sm text-muted-foreground mt-2">
            Maximum of 3 locations reached. Remove a location to add a new one.
          </p>
        )}

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {showResults && results.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {results.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelectLocation(location)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-accent"
              >
                <div className="font-medium text-foreground">{location.displayName}</div>
                <div className="text-sm text-muted-foreground">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && !isSearching && (
          <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg p-4 text-center text-muted-foreground">
            No locations found. Try a different search term.
          </div>
        )}
      </form>
    </div>
  );
}
