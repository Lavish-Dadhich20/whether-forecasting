import { AirQuality as AirQualityType } from "@/services/weatherApi";
import { Wind, AlertCircle, Leaf } from "lucide-react";

interface AirQualityProps {
  airQuality: AirQualityType;
}

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: "Good", color: "text-green-400", bg: "bg-green-500/20" };
  if (aqi <= 100) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive", color: "text-orange-400", bg: "bg-orange-500/20" };
  if (aqi <= 200) return { level: "Unhealthy", color: "text-red-400", bg: "bg-red-500/20" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "text-purple-400", bg: "bg-purple-500/20" };
  return { level: "Hazardous", color: "text-red-600", bg: "bg-red-600/20" };
};

export const AirQuality = ({ airQuality }: AirQualityProps) => {
  const usAQI = getAQILevel(airQuality.us_aqi);
  const europeanAQI = getAQILevel(airQuality.european_aqi);

  return (
    <div className="glass-strong rounded-3xl p-6 backdrop-blur-xl animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/10 rounded-2xl">
          <Wind className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white">Air Quality</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* US AQI */}
        <div className={`${usAQI.bg} rounded-2xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">US AQI</span>
            <Leaf className={usAQI.color} size={20} />
          </div>
          <div className={`text-3xl font-bold ${usAQI.color} mb-1`}>
            {Math.round(airQuality.us_aqi)}
          </div>
          <div className={`text-sm ${usAQI.color}`}>{usAQI.level}</div>
        </div>

        {/* European AQI */}
        <div className={`${europeanAQI.bg} rounded-2xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">European AQI</span>
            <Leaf className={europeanAQI.color} size={20} />
          </div>
          <div className={`text-3xl font-bold ${europeanAQI.color} mb-1`}>
            {Math.round(airQuality.european_aqi)}
          </div>
          <div className={`text-sm ${europeanAQI.color}`}>{europeanAQI.level}</div>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">PM2.5</div>
          <div className="text-white font-semibold">{airQuality.pm2_5.toFixed(1)} μg/m³</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">PM10</div>
          <div className="text-white font-semibold">{airQuality.pm10.toFixed(1)} μg/m³</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">Ozone</div>
          <div className="text-white font-semibold">{airQuality.ozone.toFixed(1)} μg/m³</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">NO₂</div>
          <div className="text-white font-semibold">{airQuality.nitrogen_dioxide.toFixed(1)} μg/m³</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">SO₂</div>
          <div className="text-white font-semibold">{airQuality.sulphur_dioxide.toFixed(1)} μg/m³</div>
        </div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">UV Index</div>
          <div className="text-white font-semibold">{airQuality.uv_index.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};
