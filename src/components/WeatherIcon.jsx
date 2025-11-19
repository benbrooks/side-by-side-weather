import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle,
} from 'lucide-react';
import { getWeatherInfo } from '../services/weather';

export function WeatherIcon({ weatherCode, className = 'w-6 h-6' }) {
  const { icon } = getWeatherInfo(weatherCode);

  const iconMap = {
    'sun': Sun,
    'cloud': Cloud,
    'cloud-sun': CloudSun,
    'cloud-fog': CloudFog,
    'cloud-drizzle': CloudDrizzle,
    'cloud-rain': CloudRain,
    'cloud-snow': CloudSnow,
    'cloud-lightning': CloudLightning,
    'help-circle': HelpCircle,
  };

  const IconComponent = iconMap[icon] || HelpCircle;

  return <IconComponent className={className} />;
}
