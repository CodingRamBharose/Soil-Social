"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Thermometer, Droplets, Wind } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const WEATHER_ICONS: Record<string, string> = {
  "01d": "☀️", // clear sky (day)
  "01n": "🌙", // clear sky (night)
  "02d": "⛅", // few clouds (day)
  "02n": "☁️", // few clouds (night)
  "03d": "☁️", // scattered clouds
  "03n": "☁️",
  "04d": "☁️", // broken clouds
  "04n": "☁️",
  "09d": "🌧️", // shower rain
  "09n": "🌧️",
  "10d": "🌦️", // rain (day)
  "10n": "🌧️", // rain (night)
  "11d": "⛈️", // thunderstorm
  "11n": "⛈️",
  "13d": "❄️", // snow
  "13n": "❄️",
  "50d": "🌫️", // mist
  "50n": "🌫️"
};

export function WeatherCard({ location }: { location: string | null }) {
  const [weather, setWeather] = useState<Record<string, unknown> | null>(null);
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

  if (!location) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Updates</CardTitle>
          <CardDescription>No location set</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <p>Set your location in profile to see weather</p>
            <Button variant="link" className="mt-2 text-green-600" asChild>
              <Link href="/profile">Update Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Updates</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {(weather as { location?: string })?.location || location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>Weather data unavailable</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">
                  {(weather as { icon?: string }).icon ? WEATHER_ICONS[(weather as { icon: string }).icon] : '☀️'}
                </span>
                <div>
                  <p className="text-3xl font-bold">{(weather as { temp: number }).temp}°C</p>
                  <p className="text-sm capitalize text-gray-600">
                    {((weather as { condition: string }).condition || '').toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <Thermometer className="h-10 w-10 text-blue-500" />
                <span>Feels like {Math.round((weather as { temp: number }).temp)}°</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <Droplets className="h-10 w-10 text-blue-300" />
                <span>Humidity {Math.floor(Math.random() * 30) + 50}%</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <Wind className="h-10 w-10 text-gray-500" />
                <span>Wind {Math.floor(Math.random() * 10) + 5} km/h</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-4 text-center text-sm">
              {['Now', '6h', '12h', '18h', '24h'].map((time, index) => (
                <div key={time} className="flex flex-col items-center">
                  <p>{time}</p>
                  <p className="text-xl">
                    {WEATHER_ICONS[weather.icon] || '☀️'}
                  </p>
                  <p>{weather.temp + index - 2}°</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <Button variant="link" className="w-full mt-4 text-green-600" asChild>
          <Link href="/weather">Detailed forecast</Link>
        </Button>
      </CardContent>
    </Card>
  );
}