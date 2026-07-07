import { useEffect, useState } from "react";
import { CloudSun, Loader2, MapPin, Wind } from "lucide-react";

import { weatherApi, type WeatherData } from "../api/weather";

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await weatherApi.getCurrentWeather();
        if (isMounted) {
          setWeather(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load weather.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Weather</p>
          <h3 className="mt-2 text-sm font-semibold text-slate-950">Cebu City</h3>
        </div>
        <div className="rounded-full border border-[#d8d8e4] bg-white/70 p-1.5 text-[#6c6987]">
          <CloudSun className="h-3.5 w-3.5" />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#66727d]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading...
        </div>
      ) : error ? (
        <p className="mt-3 text-xs text-[#a15b4f]">{error}</p>
      ) : weather ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {weather.temperature}°C
              </p>
              <p className="mt-1 text-xs text-[#66727d]">{weather.condition}</p>
            </div>
            <div className="rounded-full border border-[#e4cdb3] bg-[#faf3ea] px-2 py-0.5 text-[0.65rem] font-medium text-[#7a6554] whitespace-nowrap">
              {weather.lastUpdated}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#66727d]">
            <Wind className="h-3 w-3" />
            {weather.windSpeed} km/h
          </div>
        </div>
      ) : null}
    </div>
  );
};
