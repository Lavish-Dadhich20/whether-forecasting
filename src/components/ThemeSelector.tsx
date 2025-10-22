import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "white" | "black" | "blue";

export const ThemeSelector = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("weather-theme");
    return (saved as Theme) || "white";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("weather-theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const themes = [
    { value: "white" as Theme, label: "Light", color: "bg-white border-2 border-gray-300" },
    { value: "black" as Theme, label: "Dark", color: "bg-black" },
    { value: "blue" as Theme, label: "Blue", color: "bg-blue-600" },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/10"
        aria-label="Change theme"
      >
        <Palette size={20} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 glass-strong rounded-2xl p-3 shadow-xl z-50 min-w-[140px]">
            <p className="text-white/80 text-xs font-medium mb-2 px-2">Theme</p>
            <div className="space-y-1">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleThemeChange(t.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    theme === t.value
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${t.color} shadow-md`} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
