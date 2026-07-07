const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const DEFAULT_LATITUDE = 10.3157;
const DEFAULT_LONGITUDE = 123.8854;
const SINGAPORE_TZ = "Asia/Singapore";

const getWeatherCondition = (weatherCode) => {
  switch (weatherCode) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
    case 48:
      return "Fog";
    case 51:
    case 53:
    case 55:
      return "Drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain";
    case 71:
    case 73:
    case 75:
    case 77:
      return "Snow";
    case 80:
    case 81:
    case 82:
      return "Showers";
    case 85:
    case 86:
      return "Snow showers";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Unknown";
  }
};

const formatTimeInSingapore = (isoString) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: SINGAPORE_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const weatherController = {
  async getCurrent(_request, response) {
    try {
      const weatherResponse = await fetch(
        `${WEATHER_API_URL}?latitude=${DEFAULT_LATITUDE}&longitude=${DEFAULT_LONGITUDE}&current=temperature_2m,weather_code,wind_speed_10m`,
      );

      if (!weatherResponse.ok) {
        response.status(502).json({ message: "Unable to load weather right now." });
        return;
      }

      const data = await weatherResponse.json();
      const current = data?.current ?? {};

      response.status(200).json({
        location: "Cebu City",
        temperature: Number(current.temperature_2m ?? 0),
        condition: getWeatherCondition(Number(current.weather_code ?? 0)),
        windSpeed: Number(current.wind_speed_10m ?? 0),
        lastUpdated: current.time ? formatTimeInSingapore(current.time) : "Just now",
      });
    } catch {
      response.status(502).json({ message: "Unable to load weather right now." });
    }
  },
};
