import { calendarService } from "../services/calendarService.js";

export const calendarController = {
  async getHolidays(_request, response) {
    try {
      const data = await calendarService.getHolidaysWithNextUpcoming();
      response.status(200).json(data);
    } catch {
      response.status(502).json({ message: "Unable to load holidays right now." });
    }
  },
};
