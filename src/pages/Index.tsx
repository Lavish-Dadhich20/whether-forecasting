import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData, getWeatherGradient, WeatherData } from "@/services/weatherApi";
import { CurrentWeather } from "@/components/CurrentWeather";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { WeatherDetails } from "@/components/WeatherDetails";
import { TemperatureChart } from "@/components/TemperatureChart";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [location, setLocation] = useState({ lat: 52.52, lon: 13.41, name: "Berlin, Germany" });
  
  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather", location.lat, location.lon],
    queryFn: () => fetchWeatherData(location.lat, location.lon),
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "Your Location";
            const country = data.address.country || "";
            
            setLocation({
              lat: latitude,
              lon: longitude,
              name: `${city}${country ? ', ' + country : ''}`,
            });
            
            toast.success(`Location detected: ${city}`);
          } catch (err) {
            setLocation({ lat: latitude, lon: longitude, name: "Your Location" });
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
          toast.info("Using default location");
        }
      );
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-clear">
        <div className="text-center glass-strong rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-white/80">Failed to load weather data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-clear">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-white mx-auto mb-4" />
          <p className="text-2xl text-white font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  const gradient = getWeatherGradient(data.current.weather_code, data.current.is_day === 1);

  return (
    <div className={`min-h-screen ${gradient} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow mb-2">
              Weather Forecast
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={20} />
              <span className="text-lg">{location.name}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Last updated</p>
            <p className="text-white font-medium">
              {new Date(data.current.time).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </div>

        {/* Current Weather */}
        <div className="mb-8">
          <CurrentWeather weather={data.current} />
        </div>

        {/* Hourly Forecast */}
        <div className="mb-8">
          <HourlyForecast hourly={data.hourly} />
        </div>

        {/* Daily Forecast and Temperature Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <DailyForecast daily={data.daily} />
          <TemperatureChart hourly={data.hourly} />
        </div>

        {/* Weather Details */}
        <div className="mb-8">
          <WeatherDetails current={data.current} daily={data.daily} />
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 mt-12 pb-4">
          <p className="text-sm">
            Weather data provided by Open-Meteo • Updated every 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
