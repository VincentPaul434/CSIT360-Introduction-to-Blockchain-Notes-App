export type WeatherData = {
  location: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  lastUpdated: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/widgets";

export const weatherApi = {
  async getCurrentWeather(): Promise<WeatherData> {
    const response = await fetch(`${API_BASE_URL}/weather`);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Unable to load weather right now.");
    }

    return (await response.json()) as WeatherData;
  },
};
