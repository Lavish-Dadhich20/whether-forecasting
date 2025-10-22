import { Wind, Droplets, Gauge, Eye, Sunrise, Sunset } from "lucide-react";
import { CurrentWeather, DailyWeather } from "@/services/weatherApi";

interface WeatherDetailsProps {
  current: CurrentWeather;
  daily: DailyWeather;
}

export const WeatherDetails = ({ current, daily }: WeatherDetailsProps) => {
  const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  const sunset = new Date(daily.sunset[0]).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  const details = [
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      subtitle: `Gusts: ${Math.round(current.wind_gusts_10m)} km/h`,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
      subtitle: "Relative humidity",
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${Math.round(current.pressure_msl)} hPa`,
      subtitle: "Mean sea level",
    },
    {
      icon: Eye,
      label: "Cloud Cover",
      value: `${current.cloud_cover}%`,
      subtitle: "Sky coverage",
    },
    {
      icon: Sunrise,
      label: "Sunrise",
      value: sunrise,
      subtitle: "Dawn time",
    },
    {
      icon: Sunset,
      label: "Sunset",
      value: sunset,
      subtitle: "Dusk time",
    },
  ];

  return (
    <div className="glass rounded-3xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Weather Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((detail, index) => {
          const Icon = detail.icon;
          
          return (
            <div
              key={index}
              className="glass-strong rounded-2xl p-5 hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Icon className="text-primary" size={24} />
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-foreground/60 mb-1">{detail.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{detail.value}</p>
                  <p className="text-xs text-foreground/50">{detail.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
