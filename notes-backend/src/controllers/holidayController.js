const HOLIDAY_API_URL = "https://date.nager.at/api/v3/PublicHolidays";
const SINGAPORE_TZ = "Asia/Singapore";

const formatHolidayDateSingapore = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: SINGAPORE_TZ,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const holidayController = {
  async getNext(_request, response) {
    try {
      const currentYear = new Date().getFullYear();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const year of [currentYear, currentYear + 1]) {
        const holidayResponse = await fetch(`${HOLIDAY_API_URL}/${year}/PH`);

        if (!holidayResponse.ok) {
          continue;
        }

        const holidays = await holidayResponse.json();
        const upcomingHoliday = Array.isArray(holidays)
          ? holidays
              .filter((holiday) => {
                const holidayDate = new Date(`${holiday.date}T00:00:00`);
                return holidayDate.getTime() >= today.getTime();
              })
              .sort((first, second) => {
                const firstDate = new Date(`${first.date}T00:00:00`).getTime();
                const secondDate = new Date(`${second.date}T00:00:00`).getTime();
                return firstDate - secondDate;
              })[0]
          : null;

        if (upcomingHoliday) {
          const holidayDate = new Date(`${upcomingHoliday.date}T00:00:00`);
          const diffInMs = holidayDate.getTime() - today.getTime();
          const daysRemaining = Math.ceil(diffInMs / 86400000);

          response.status(200).json({
            name: upcomingHoliday.name || upcomingHoliday.localName || "Holiday",
            date: upcomingHoliday.date,
            daysRemaining,
            formattedDate: formatHolidayDateSingapore(upcomingHoliday.date),
          });
          return;
        }
      }

      response.status(404).json({ message: "No upcoming holidays found." });
    } catch {
      response.status(502).json({ message: "Unable to load holidays right now." });
    }
  },
};
