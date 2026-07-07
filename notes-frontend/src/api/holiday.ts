export type NextHoliday = {
  name: string;
  date: string;
  daysRemaining: number;
  formattedDate?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/widgets";

const formatHolidayDateSingapore = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const holidayApi = {
  async getNextHoliday(): Promise<NextHoliday> {
    const response = await fetch(`${API_BASE_URL}/holiday`);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Unable to load holidays right now.");
    }

    return (await response.json()) as NextHoliday;
  },

  formatHolidayDate(value: string) {
    return formatHolidayDateSingapore(value);
  },
};
