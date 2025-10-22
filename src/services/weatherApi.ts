export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  is_day: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  rain_sum: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
  wind_speed_10m: number[];
  cloud_cover: number[];
  visibility: number[];
  pressure_msl: number[];
}

export interface AirQuality {
  time: string;
  pm10: number;
  pm2_5: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
  ozone: number;
  european_aqi: number;
  us_aqi: number;
  dust: number;
  uv_index: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyWeather;
  timezone: string;
  airQuality?: AirQuality;
}

export const getWeatherDescription = (code: number): { description: string; icon: string } => {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: "Clear sky", icon: "sun" },
    1: { description: "Mainly clear", icon: "sun" },
    2: { description: "Partly cloudy", icon: "cloud-sun" },
    3: { description: "Overcast", icon: "cloud" },
    45: { description: "Foggy", icon: "cloud-fog" },
    48: { description: "Depositing rime fog", icon: "cloud-fog" },
    51: { description: "Light drizzle", icon: "cloud-drizzle" },
    53: { description: "Moderate drizzle", icon: "cloud-drizzle" },
    55: { description: "Dense drizzle", icon: "cloud-drizzle" },
    61: { description: "Slight rain", icon: "cloud-rain" },
    63: { description: "Moderate rain", icon: "cloud-rain" },
    65: { description: "Heavy rain", icon: "cloud-rain" },
    71: { description: "Slight snow", icon: "snowflake" },
    73: { description: "Moderate snow", icon: "snowflake" },
    75: { description: "Heavy snow", icon: "snowflake" },
    77: { description: "Snow grains", icon: "snowflake" },
    80: { description: "Slight rain showers", icon: "cloud-rain" },
    81: { description: "Moderate rain showers", icon: "cloud-rain" },
    82: { description: "Violent rain showers", icon: "cloud-rain" },
    85: { description: "Slight snow showers", icon: "snowflake" },
    86: { description: "Heavy snow showers", icon: "snowflake" },
    95: { description: "Thunderstorm", icon: "cloud-lightning" },
    96: { description: "Thunderstorm with slight hail", icon: "cloud-lightning" },
    99: { description: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
  };

  return weatherCodes[code] || { description: "Unknown", icon: "cloud" };
};

export const getWeatherGradient = (code: number, isDay: boolean): string => {
  if (!isDay) return "gradient-night";
  
  if (code === 0 || code === 1) return "gradient-clear";
  if (code === 2 || code === 3) return "gradient-cloudy";
  if (code >= 51 && code <= 82) return "gradient-rainy";
  if (code >= 95) return "gradient-rainy";
  
  return "gradient-clear";
};

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max",
    hourly: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m,cloud_cover,visibility,pressure_msl",
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure",
    timezone: "auto",
    past_days: "0",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  // Fetch air quality data
  try {
    const airQualityParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi,dust,uv_index",
    });

    const airQualityResponse = await fetch(`https://air-quality.openmeteo.com/v1/air-quality?${airQualityParams}`);
    
    if (airQualityResponse.ok) {
      const airQualityData = await airQualityResponse.json();
      data.airQuality = airQualityData.current;
    }
  } catch (error) {
    console.log("Air quality data not available");
  }

  return data;
};
