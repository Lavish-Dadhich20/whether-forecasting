import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudDrizzle, CloudLightning, Wind, Droplets } from "lucide-react";
import { CurrentWeather as CurrentWeatherType } from "@/services/weatherApi";
import { getWeatherDescription } from "@/services/weatherApi";

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
}

const getWeatherIcon = (iconName: string, size: number = 120) => {
  const iconProps = { size, className: "text-white drop-shadow-lg animate-float" };
  
  switch (iconName) {
    case "sun": return <Sun {...iconProps} />;
    case "cloud-sun": return <Cloud {...iconProps} />;
    case "cloud": return <Cloud {...iconProps} />;
    case "cloud-fog": return <CloudFog {...iconProps} />;
    case "cloud-drizzle": return <CloudDrizzle {...iconProps} />;
    case "cloud-rain": return <CloudRain {...iconProps} />;
    case "snowflake": return <CloudSnow {...iconProps} />;
    case "cloud-lightning": return <CloudLightning {...iconProps} />;
    default: return <Cloud {...iconProps} />;
  }
};

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  const { description, icon } = getWeatherDescription(weather.weather_code);
  
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 glass-strong shadow-2xl animate-slide-up">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Temperature and Location */}
          <div className="text-center md:text-left">
            <h1 className="text-7xl md:text-9xl font-bold text-white text-shadow mb-2">
              {Math.round(weather.temperature_2m)}°
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-medium mb-1">
              {description}
            </p>
            <p className="text-lg text-white/80">
              Feels like {Math.round(weather.apparent_temperature)}°
            </p>
          </div>

          {/* Weather Icon */}
          <div>
            {getWeatherIcon(icon)}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="glass rounded-2xl p-4 text-center">
            <Wind className="mx-auto mb-2 text-white/80" size={24} />
            <p className="text-white/70 text-sm">Wind</p>
            <p className="text-white text-xl font-semibold">{Math.round(weather.wind_speed_10m)} km/h</p>
          </div>
          
          <div className="glass rounded-2xl p-4 text-center">
            <Droplets className="mx-auto mb-2 text-white/80" size={24} />
            <p className="text-white/70 text-sm">Humidity</p>
            <p className="text-white text-xl font-semibold">{weather.relative_humidity_2m}%</p>
          </div>
          
          <div className="glass rounded-2xl p-4 text-center">
            <CloudRain className="mx-auto mb-2 text-white/80" size={24} />
            <p className="text-white/70 text-sm">Precipitation</p>
            <p className="text-white text-xl font-semibold">{weather.precipitation} mm</p>
          </div>
          
          <div className="glass rounded-2xl p-4 text-center">
            <Cloud className="mx-auto mb-2 text-white/80" size={24} />
            <p className="text-white/70 text-sm">Cloud Cover</p>
            <p className="text-white text-xl font-semibold">{weather.cloud_cover}%</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
    </div>
  );
};
