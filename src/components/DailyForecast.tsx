import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudDrizzle, CloudLightning } from "lucide-react";
import { DailyWeather } from "@/services/weatherApi";
import { getWeatherDescription } from "@/services/weatherApi";

interface DailyForecastProps {
  daily: DailyWeather;
}

const getWeatherIcon = (iconName: string) => {
  const iconProps = { size: 32, className: "text-foreground/70" };
  
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

export const DailyForecast = ({ daily }: DailyForecastProps) => {
  const forecasts = daily.time.slice(0, 7).map((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = index === 0;
    
    return {
      day: isToday ? 'Today' : dayName,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      weatherCode: daily.weather_code[index],
      precipitation: daily.precipitation_probability_max[index],
    };
  });

  return (
    <div className="glass rounded-3xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">7-Day Forecast</h2>
      
      <div className="space-y-3">
        {forecasts.map((forecast, index) => {
          const { icon, description } = getWeatherDescription(forecast.weatherCode);
          
          return (
            <div
              key={index}
              className="glass-strong rounded-2xl p-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20">
                    <p className="font-semibold text-foreground">{forecast.day}</p>
                    <p className="text-sm text-foreground/60">{forecast.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1">
                    {getWeatherIcon(icon)}
                    <p className="text-sm text-foreground/80 hidden md:block">{description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-foreground/60 mb-1">Precipitation</p>
                    <p className="text-sm font-semibold text-primary">{forecast.precipitation}%</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{forecast.maxTemp}°</span>
                    <span className="text-xl text-foreground/50">{forecast.minTemp}°</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
