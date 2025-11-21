import { useState } from 'react';
import { Search, Loader2, Calendar, Plus, X } from 'lucide-react';
import { searchLocation } from '../services/geocoding';

export function LocationInput({ onAddLocation, canAddMore }) {
  const [query, setQuery] = useState('');
  const [dateWindows, setDateWindows] = useState([{ startDate: '', endDate: '' }]);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  // Get date 16 days from now (max forecast)
  const maxDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
    // Filter out empty date windows
    const validWindows = dateWindows.filter(w => w.startDate || w.endDate);

    onAddLocation({
      ...location,
      dateWindows: validWindows.length > 0 ? validWindows : [],
    });
    setQuery('');
    setDateWindows([{ startDate: '', endDate: '' }]);
    setResults([]);
    setShowResults(false);
  };

  const updateDateWindow = (index, field, value) => {
    setDateWindows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addDateWindow = () => {
    setDateWindows(prev => [...prev, { startDate: '', endDate: '' }]);
  };

  const removeDateWindow = (index) => {
    setDateWindows(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex flex-col gap-3">
          {/* Search row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter city name or zip code (e.g., Boulder, CO)..."
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

          {/* Date windows */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Trip dates (optional - add multiple for round trips):</span>
            </div>

            {dateWindows.map((window, index) => (
              <div key={index} className="flex items-center gap-2 ml-6">
                <span className="text-xs text-muted-foreground w-16">
                  {index === 0 ? 'Outbound:' : index === 1 ? 'Return:' : `Trip ${index + 1}:`}
                </span>
                <input
                  type="date"
                  value={window.startDate}
                  onChange={(e) => updateDateWindow(index, 'startDate', e.target.value)}
                  min={today}
                  max={window.endDate || maxDate}
                  disabled={!canAddMore}
                  className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="date"
                  value={window.endDate}
                  onChange={(e) => updateDateWindow(index, 'endDate', e.target.value)}
                  min={window.startDate || today}
                  max={maxDate}
                  disabled={!canAddMore}
                  className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                {dateWindows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDateWindow(index)}
                    className="p-1 hover:bg-accent rounded-md transition-colors"
                    title="Remove date window"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addDateWindow}
              disabled={!canAddMore}
              className="ml-6 flex items-center gap-1 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add another date range
            </button>
          </div>
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
