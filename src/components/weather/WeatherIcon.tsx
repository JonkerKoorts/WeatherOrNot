import { memo } from "react";
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
import { getWeatherIconName } from "@/lib/weather-utils";

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
}

export const WeatherIcon = memo(function WeatherIcon({
  weatherCode,
  isDay = true,
  ...props
}: WeatherIconProps) {
  const iconName = getWeatherIconName(weatherCode, isDay);
  const IconComponent = ICON_MAP[iconName] ?? Cloud;

  return <IconComponent {...props} />;
});
