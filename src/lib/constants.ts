import type {
  AppSettings,
  LanguageOption,
  LocationType,
  UnitSystem,
} from "@/types/weather";

export const WEATHERSTACK_PROXY_PATH = "/api/weatherstack";

export const CACHE_PREFIX = "weatherornot_";
export const SETTINGS_KEY = "weatherornot_settings";
export const RECENT_SEARCHES_KEY = "weatherornot_recent_searches";

export const MAX_RECENT_SEARCHES = 8;
export const DEFAULT_LOCATION = "Pretoria";

export const DEFAULT_SETTINGS: AppSettings = {
  units: "m",
  language: "en",
  locationType: "city",
  defaultLocation: "Pretoria",
  cacheTtlMinutes: 30,
};

export const UNIT_LABELS: Record<
  UnitSystem,
  { temp: string; wind: string; precip: string; pressure: string }
> = {
  m: { temp: "°C", wind: "km/h", precip: "mm", pressure: "mb" },
  s: { temp: "K", wind: "km/h", precip: "mm", pressure: "mb" },
  f: { temp: "°F", wind: "mph", precip: "in", pressure: "mb" },
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "bg", name: "Bulgarian" },
  { code: "zh", name: "Chinese Simplified" },
  { code: "zh_tw", name: "Chinese Traditional" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jv", name: "Javanese" },
  { code: "ko", name: "Korean" },
  { code: "zh_cmn", name: "Mandarin" },
  { code: "mr", name: "Marathi" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sr", name: "Serbian" },
  { code: "si", name: "Sinhalese" },
  { code: "sk", name: "Slovak" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh_wuu", name: "Wu (Shanghainese)" },
  { code: "zh_hsn", name: "Xiang" },
  { code: "zh_yue", name: "Yue (Cantonese)" },
  { code: "zu", name: "Zulu" },
];

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  city: "City Name",
  zip: "ZIP/Postal Code",
  coordinates: "Coordinates (Lat, Lon)",
  ip: "IP Address",
  auto: "Auto-detect (IP)",
};

export const CACHE_TTL_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 0, label: "Disabled" },
] as const;

export const SIMULATION_VARIANCE = {
  TEMP: 4,
  WIND: 8,
  PRESSURE: 10,
  PRECIP: 2,
  HUMIDITY: 15,
} as const;
