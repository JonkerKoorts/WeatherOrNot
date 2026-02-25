# WeatherOrNot

A production-ready weather dashboard built with React, TypeScript, and the WeatherStack API. Built as a Frontend Software Engineer take-home project for SecuritEase.

## Features

**Core Features**
- Current weather display with real-time data from WeatherStack API
- 3-day weather forecast with real data from Open-Meteo API
- 3-day weather history with real data from Open-Meteo API
- Interactive day selection — click any forecast or history tile to view detailed data in the main display
- Keyboard-accessible tiles (Enter/Space to select, aria-pressed for screen readers)

**User Settings**
- Temperature units: Metric (°C), Scientific (K), Fahrenheit (°F)
- Language selection: 40+ languages for weather descriptions
- Location search types: City name, ZIP code, coordinates, IP address, auto-detect
- Configurable cache duration (15 min / 30 min / 1 hour / disabled)
- Quick Settings sheet accessible from the header gear icon
- Full Settings page with all options

**Additional Features**
- Responsive design (mobile-first, works at 375px+)
- Recent searches with localStorage persistence
- Weather-themed 404 page
- About page with architecture and design decisions
- Forecast and history detail pages with grid/list toggle views
- Loading skeletons during API fetches
- Error handling with retry functionality
- Stale-while-revalidate loading pattern
- Error boundary for crash recovery
- Skip-to-content link and full ARIA accessibility

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** — build tooling
- **TanStack Router** — type-safe, file-based routing
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible, composable UI components
- **Lucide React** — icon library
- **Vitest** + **Testing Library** — unit and integration testing
- **WeatherStack API** — real-time current weather data
- **Open-Meteo API** — forecast and historical weather data (free, no key required)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- A free WeatherStack API key ([sign up here](https://weatherstack.com/signup/free))

### Installation

```bash
git clone <repo-url>
cd WeatherOrNot
bun install
```

### Environment Setup

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder with your actual WeatherStack access key:

```env
# Required — WeatherStack API (current weather + location lookup)
VITE_WEATHERSTACK_ACCESS_KEY=your_weatherstack_access_key_here
VITE_WEATHERSTACK_BASE_URL=http://api.weatherstack.com

# Optional — Open-Meteo API (forecast + history, free, no key needed)
VITE_OPENMETEO_FORECAST_URL=https://api.open-meteo.com/v1/forecast
```

### Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`. A Vite dev proxy is configured to bridge WeatherStack's HTTP-only API.

## Running Tests

```bash
bun test           # Watch mode
bun run test:run   # Single run
bun run test:coverage  # With coverage report
```

**Test suite:** 119 tests across 12 test files covering:
- Core weather components (WeatherCard, DayTile, ForecastGrid, HistoryGrid)
- Interactive day selection integration test
- WeatherStack API service (with mocked fetch)
- Open-Meteo API service (unit conversion, caching, error handling)
- Weather simulator determinism and output validation
- Cache utility (get/set/clear/expiry/quota recovery)
- Weather utility functions (formatters, normalizers, icon mapping)
- Settings context (persistence, partial updates, reset, corruption recovery)
- useLocalStorage hook (state sync, functional updates, edge cases)

## Building for Production

```bash
bun run build
```

Output is generated in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Navigation
│   ├── search/          # LocationSearch with recent searches
│   ├── settings/        # QuickSettings sheet
│   ├── ui/              # shadcn/ui components
│   └── weather/         # WeatherCard, DayTile, ForecastGrid, HistoryGrid,
│                        # WeatherDetail, WeatherIcon, WeatherSkeleton
├── contexts/            # SettingsContext (units, language, cache, location type)
├── hooks/               # useWeather, useWeatherData, useSettings, useLocalStorage
├── lib/                 # cache, constants, weather-utils
├── routes/              # TanStack Router file-based routes
│   ├── index.tsx        # Landing page with search
│   ├── weather.$location.tsx   # Main dashboard
│   ├── forecast.$location.tsx  # Expanded forecast
│   ├── history.$location.tsx   # Expanded history
│   ├── settings.tsx     # Full settings page
│   ├── about.tsx        # Architecture & design decisions
│   └── __root.tsx       # App shell + 404
├── services/            # weatherstack-api, openmeteo-api, weather-simulator
├── test/                # Test setup, utils, mock data
└── types/               # TypeScript type definitions
```

## Architecture & Design Decisions

### API Strategy

The app uses a dual-API approach:

- **Current weather**: Fetched from WeatherStack API (provides location lat/lon and real-time conditions) with TTL-based caching
- **Forecast & History**: Fetched from Open-Meteo API using the lat/lon from WeatherStack. Open-Meteo is free, requires no API key, and provides real forecast and historical data. WMO weather codes are mapped to WeatherStack codes for consistent icon/description display
- **Fallback simulator**: A deterministic seeded PRNG simulator is available as a fallback when Open-Meteo is unavailable
- **Dev proxy**: Vite's dev server proxies `/api/weatherstack` to bridge HTTPS → HTTP in development (WeatherStack free tier is HTTP-only)

### Why TanStack Router

File-based routing with full TypeScript type safety. Route params like `$location` are type-checked, and the router generates a route tree automatically.

### Why shadcn/ui

Not a component library — it's a collection of accessible, composable components you own. Every component is customizable, uses Radix UI primitives for accessibility, and integrates natively with Tailwind CSS v4.

### Settings Architecture

All user preferences (units, language, location type, default location, cache TTL) are stored in a React Context backed by localStorage. Changes propagate immediately — no save button needed.

### Caching

TTL-based localStorage caching prevents unnecessary API calls. Each cache entry includes a timestamp and TTL. Expired entries are automatically cleaned up on read. When storage quota is exceeded, expired entries are evicted before retrying. Users can configure or disable caching from Settings.

## Trade-offs & Limitations

- **Free tier constraints**: WeatherStack free plan is HTTP-only (~100 req/month, no HTTPS, no forecast/historical endpoints). The Vite dev proxy handles the mixed-content issue
- **Dual-API dependency**: Forecast and history require both APIs to succeed — WeatherStack provides lat/lon, Open-Meteo uses them for forecast/history data
- **Language parameter**: WeatherStack free tier doesn't support the `language` query parameter (returns 605 error). Language settings are stored for future paid-tier support
- **Rate limiting**: The app includes AbortController-based request deduplication to avoid StrictMode double-fire in development
