import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HourlyWeather } from "@/services/weatherApi";

interface TemperatureChartProps {
  hourly: HourlyWeather;
}

export const TemperatureChart = ({ hourly }: TemperatureChartProps) => {
  const chartData = hourly.time.slice(0, 24).map((time, index) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temperature: Math.round(hourly.temperature_2m[index]),
    feelsLike: Math.round(hourly.apparent_temperature[index]),
  }));

  return (
    <div className="glass rounded-3xl p-6 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <h2 className="text-2xl font-bold mb-6 text-foreground">Temperature Trend</h2>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              style={{ fontSize: '12px' }}
              unit="°"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                padding: '12px'
              }}
              formatter={(value: number) => [`${value}°`, '']}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              name="Temperature"
            />
            <Line 
              type="monotone" 
              dataKey="feelsLike" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--accent))', r: 3 }}
              name="Feels Like"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span className="text-sm text-foreground/70">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-accent" />
          <span className="text-sm text-foreground/70">Feels Like</span>
        </div>
      </div>
    </div>
  );
};
