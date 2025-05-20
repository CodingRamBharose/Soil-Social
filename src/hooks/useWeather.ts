import { useState, useEffect } from "react";

interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  icon: string;
  location: string;
  humidity: number;
  wind: number;
}

export function useWeather(location: string | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        if (!response.ok) throw new Error("Failed to fetch weather");
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
}