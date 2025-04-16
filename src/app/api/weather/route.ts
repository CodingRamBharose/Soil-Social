import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!process.env.OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { error: "Weather API key not configured" },
      { status: 500 }
    );
  }

  try {
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Weather fetch failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      location: data.name,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}