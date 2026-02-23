import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  type LucideProps,
} from "lucide-react";
import { getWeatherIconName, getWeatherbitIconName } from "@/lib/weather-utils";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
};

interface WeatherIconProps extends LucideProps {
  weatherCode: number;
  isDay?: boolean;
  source?: "weatherstack" | "weatherbit";
}

export function WeatherIcon({
  weatherCode,
  isDay = true,
  source = "weatherstack",
  ...props
}: WeatherIconProps) {
  const iconName =
    source === "weatherbit"
      ? getWeatherbitIconName(weatherCode)
      : getWeatherIconName(weatherCode, isDay);

  const IconComponent = ICON_MAP[iconName] ?? Cloud;

  return <IconComponent {...props} />;
}
