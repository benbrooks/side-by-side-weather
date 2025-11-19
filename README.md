# Weather Dashboard

A beautiful, responsive weather dashboard that displays side-by-side weather forecasts for up to three locations. Perfect for travelers who want to compare weather conditions across different destinations.

## Features

- **Compare up to 3 locations** - View weather forecasts side-by-side
- **16-day forecast** - See all available forecast days from Open-Meteo
- **Smart location search** - Search by city name or zip code
- **Persistent data** - Your locations are saved locally and persist between sessions
- **Free weather data** - Powered by Open-Meteo API (no API key required)
- **Clean design** - Built with COSS.com-inspired design system using light zinc colors
- **Responsive layout** - Works on desktop, tablet, and mobile

## Weather Information Displayed

For each location and forecast day, you'll see:

- **High/Low temperatures** (in Fahrenheit)
- **Precipitation probability** (percentage chance of rain/snow)
- **Weather conditions** (visual icons for sunny, cloudy, rainy, snowy, etc.)
- **Date display** (Today, Tomorrow, or specific date)

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with COSS.com design tokens
- **Lucide React** - Weather condition icons
- **Open-Meteo API** - Free weather and geocoding data

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Build for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## How to Use

1. **Add a location**
   - Type a city name (e.g., "New York", "San Francisco, CA") or zip code (e.g., "10001") in the search box
   - Click "Search" or press Enter
   - Select your desired location from the results

2. **View weather**
   - Weather forecasts will load automatically for each location
   - Scroll through up to 16 days of forecast data
   - Each day shows high/low temps, precipitation chance, and weather icons

3. **Remove a location**
   - Click the X button in the top-right corner of any weather card

4. **Add more locations**
   - You can add up to 3 locations total
   - Your locations are automatically saved and will be there when you return

## Project Structure

```
src/
├── components/
│   ├── LocationInput.jsx    # Search and select locations
│   ├── WeatherCard.jsx       # Display weather for one location
│   └── WeatherIcon.jsx       # Weather condition icons
├── hooks/
│   └── useLocations.js       # Location state management
├── services/
│   ├── geocoding.js          # Location search API
│   └── weather.js            # Weather forecast API
├── utils/
│   └── storage.js            # localStorage utilities
├── App.jsx                   # Main app component
└── index.css                 # Global styles and design tokens
```

## Data Sources

- **Weather Data**: [Open-Meteo](https://open-meteo.com/) - Free weather API with no API key required
- **Geocoding**: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) - Convert locations to coordinates

## Design System

This app uses a design inspired by [COSS.com UI](https://coss.com/ui/docs), featuring:

- Clean, minimal aesthetic
- Light zinc color palette
- Subtle borders and shadows
- Smooth transitions and hover states
- Consistent spacing and typography

## License

MIT

## Acknowledgments

- Weather data provided by [Open-Meteo.com](https://open-meteo.com/)
- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from [COSS.com UI](https://coss.com)
