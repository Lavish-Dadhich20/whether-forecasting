import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudDrizzle, CloudLightning, Droplets } from "lucide-react";
import { HourlyWeather } from "@/services/weatherApi";
import { getWeatherDescription } from "@/services/weatherApi";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HourlyForecastProps {
  hourly: HourlyWeather;
}

const getSmallWeatherIcon = (iconName: string) => {
  const iconProps = { size: 24, className: "text-foreground/70" };
  
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

export const HourlyForecast = ({ hourly }: HourlyForecastProps) => {
  // Get next 24 hours
  const next24Hours = hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temperature: Math.round(hourly.temperature_2m[index]),
    weatherCode: hourly.weather_code[index],
    precipitation: hourly.precipitation_probability[index],
  }));

  return (
    <div className="glass rounded-3xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Hourly Forecast</h2>
      
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {next24Hours.map((hour, index) => {
            const { icon } = getWeatherDescription(hour.weatherCode);
            
            return (
              <div
                key={index}
                className="flex-shrink-0 w-24 glass-strong rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300"
              >
                <p className="text-sm font-medium text-foreground/70 mb-3">{hour.time}</p>
                <div className="flex justify-center mb-3">
                  {getSmallWeatherIcon(icon)}
                </div>
                <p className="text-2xl font-bold text-foreground mb-2">{hour.temperature}°</p>
                <div className="flex items-center justify-center gap-1 text-xs text-foreground/60">
                  <Droplets size={12} />
                  <span>{hour.precipitation}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
