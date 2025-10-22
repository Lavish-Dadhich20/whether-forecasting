import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface City {
  lat: string;
  lon: string;
  display_name: string;
  name: string;
}

interface CitySearchProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string }) => void;
}

export const CitySearch = ({ onLocationSelect }: CitySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchCity = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      const cities = data.map((item: any) => ({
        lat: item.lat,
        lon: item.lon,
        display_name: item.display_name,
        name: item.address?.city || item.address?.town || item.address?.village || item.name,
      }));
      
      setResults(cities);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchCity(value);
  };

  const handleSelectCity = (city: City) => {
    const cityName = city.name || city.display_name.split(",")[0];
    const country = city.display_name.split(",").slice(-1)[0].trim();
    
    onLocationSelect({
      lat: parseFloat(city.lat),
      lon: parseFloat(city.lon),
      name: `${cityName}, ${country}`,
    });
    
    setSearchQuery("");
    setShowResults(false);
    setResults([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleInputChange}
          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-strong rounded-xl overflow-hidden shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSelectCity(city)}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-start gap-3 border-b border-white/10 last:border-0"
            >
              <MapPin className="text-white/60 mt-1 flex-shrink-0" size={18} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {city.name || city.display_name.split(",")[0]}
                </p>
                <p className="text-white/60 text-sm truncate">{city.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full mt-2 w-full glass-strong rounded-xl p-4 text-center text-white/80 shadow-xl">
          Searching...
        </div>
      )}
    </div>
  );
};
