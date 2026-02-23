// ============================================================
// WeatherStack API Types
// ============================================================

export interface WeatherStackResponse {
  request: WeatherStackRequest;
  location: WeatherStackLocation;
  current: WeatherStackCurrent;
}

export interface WeatherStackRequest {
  type: string;
  query: string;
  language: string;
  unit: string;
}

export interface WeatherStackLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

export interface WeatherStackCurrent {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string;
}

export interface WeatherStackError {
  success: false;
  error: {
    code: number;
    type: string;
    info: string;
  };
}

// ============================================================
// Weatherbit API Types
// ============================================================

export interface WeatherbitForecastResponse {
  data: WeatherbitDayData[];
  city_name: string;
  country_code: string;
  lat: number;
  lon: number;
  timezone: string;
  state_code: string;
}

export interface WeatherbitDayData {
  datetime: string;
  temp: number;
  max_temp: number;
  min_temp: number;
  app_max_temp: number;
  app_min_temp: number;
  wind_spd: number;
  wind_gust_spd: number;
  wind_dir: number;
  wind_cdir: string;
  wind_cdir_full: string;
  pres: number;
  slp: number;
  precip: number;
  snow: number;
  rh: number;
  clouds: number;
  uv: number;
  vis: number;
  dewpt: number;
  pop: number;
  weather: {
    icon: string;
    code: number;
    description: string;
  };
}

// ============================================================
// Normalized App Types (used throughout the UI)
// ============================================================

export interface LocationInfo {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  localtime: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  description: string;
  weatherCode: number;
  windSpeed: number;
  windDirection: string;
  windDegree: number;
  pressure: number;
  precipitation: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  isDay: boolean;
  observationTime: string;
  iconUrl: string;
}

export interface DayWeather {
  date: string;
  dayOfWeek: string;
  label: string;
  temperature: number;
  tempHigh: number;
  tempLow: number;
  description: string;
  weatherCode: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  precipitation: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  isSimulated: boolean;
  type: "forecast" | "history" | "current";
}

// ============================================================
// Settings Types
// ============================================================

export type UnitSystem = "m" | "s" | "f";

export type LanguageCode =
  | "en"
  | "ar"
  | "bn"
  | "bg"
  | "zh"
  | "zh_tw"
  | "cs"
  | "da"
  | "nl"
  | "fi"
  | "fr"
  | "de"
  | "el"
  | "hi"
  | "hu"
  | "it"
  | "ja"
  | "jv"
  | "ko"
  | "zh_cmn"
  | "mr"
  | "pl"
  | "pt"
  | "pa"
  | "ro"
  | "ru"
  | "sr"
  | "si"
  | "sk"
  | "es"
  | "sv"
  | "ta"
  | "te"
  | "tr"
  | "uk"
  | "ur"
  | "vi"
  | "zh_wuu"
  | "zh_hsn"
  | "zh_yue"
  | "zu";

export type LocationType = "city" | "zip" | "coordinates" | "ip" | "auto";

export interface AppSettings {
  units: UnitSystem;
  language: LanguageCode;
  locationType: LocationType;
  defaultLocation: string;
  cacheTtlMinutes: number;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
}

// ============================================================
// Cache & Search Types
// ============================================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface RecentSearch {
  location: string;
  displayName: string;
  timestamp: number;
  locationType: LocationType;
}

export interface SelectedDayState {
  day: DayWeather | null;
  source: "forecast" | "history" | "current";
}
