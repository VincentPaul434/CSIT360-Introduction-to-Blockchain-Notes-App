export type Holiday = {
  date: string;
  localName: string;
  name: string;
};

export type NextHoliday = Holiday & {
  daysRemaining: number;
};

export type HolidayData = {
  year: number;
  holidays: Holiday[];
  nextHoliday: NextHoliday | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/calendar";

export const calendarApi = {
  async getHolidays(): Promise<HolidayData> {
    const response = await fetch(`${API_BASE_URL}/holidays`);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Unable to load holidays right now.");
    }

    return (await response.json()) as HolidayData;
  },
};
