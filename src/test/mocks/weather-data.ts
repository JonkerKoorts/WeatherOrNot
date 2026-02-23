import type {
  CurrentWeather,
  DayWeather,
  LocationInfo,
} from "@/types/weather";

export const mockLocation: LocationInfo = {
  name: "Pretoria",
  region: "Gauteng",
  country: "South Africa",
  lat: -25.747,
  lon: 28.188,
  timezone: "Africa/Johannesburg",
  localtime: "2026-02-23 14:30",
};

export const mockCurrentWeather: CurrentWeather = {
  temperature: 21,
  feelsLike: 20,
  description: "Partly Cloudy",
  weatherCode: 116,
  windSpeed: 12,
  windDirection: "NNE",
  windDegree: 30,
  pressure: 1017,
  precipitation: 0,
  humidity: 64,
  cloudCover: 25,
  uvIndex: 4,
  visibility: 10,
  isDay: true,
  observationTime: "12:30 PM",
  iconUrl: "https://example.com/icon.png",
};

export const mockHistoryDay: DayWeather = {
  date: "2026-02-22",
  dayOfWeek: "SUN",
  label: "Yesterday",
  temperature: 19,
  tempHigh: 23,
  tempLow: 15,
  description: "Sunny",
  weatherCode: 113,
  windSpeed: 8,
  windDirection: "NNE",
  pressure: 1020,
  precipitation: 0,
  humidity: 55,
  cloudCover: 10,
  uvIndex: 5,
  isSimulated: true,
  type: "history",
};

export const mockForecastDay: DayWeather = {
  date: "2026-02-24",
  dayOfWeek: "TUE",
  label: "Tomorrow",
  temperature: 23,
  tempHigh: 26,
  tempLow: 18,
  description: "Partly Cloudy",
  weatherCode: 116,
  windSpeed: 15,
  windDirection: "NNE",
  pressure: 1015,
  precipitation: 0.5,
  humidity: 58,
  cloudCover: 35,
  uvIndex: 6,
  isSimulated: true,
  type: "forecast",
};

export const mockTodayDay: DayWeather = {
  date: "2026-02-23",
  dayOfWeek: "MON",
  label: "Today",
  temperature: 21,
  tempHigh: 24,
  tempLow: 18,
  description: "Partly Cloudy",
  weatherCode: 116,
  windSpeed: 12,
  windDirection: "NNE",
  pressure: 1017,
  precipitation: 0,
  humidity: 64,
  cloudCover: 25,
  uvIndex: 4,
  isSimulated: false,
  type: "current",
};

export function createMockHistory(): DayWeather[] {
  return [
    { ...mockHistoryDay, date: "2026-02-20", dayOfWeek: "FRI", label: "Friday" },
    { ...mockHistoryDay, date: "2026-02-21", dayOfWeek: "SAT", label: "Saturday" },
    { ...mockHistoryDay, date: "2026-02-22", dayOfWeek: "SUN", label: "Yesterday" },
  ];
}

export function createMockForecast(): DayWeather[] {
  return [
    { ...mockForecastDay, date: "2026-02-24", dayOfWeek: "TUE", label: "Tomorrow" },
    { ...mockForecastDay, date: "2026-02-25", dayOfWeek: "WED", label: "Wednesday", temperature: 25 },
    { ...mockForecastDay, date: "2026-02-26", dayOfWeek: "THU", label: "Thursday", temperature: 20 },
  ];
}
