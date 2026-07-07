const HOLIDAYS_API_URL = "https://date.nager.at/api/v3/PublicHolidays";

export const calendarService = {
  async getHolidaysWithNextUpcoming() {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let holidays = [];
    let nextHoliday = null;

    // Fetch holidays for current year and next year
    for (const year of [currentYear, currentYear + 1]) {
      try {
        const response = await fetch(`${HOLIDAYS_API_URL}/${year}/PH`);

        if (!response.ok) {
          continue;
        }

        const yearHolidays = await response.json();

        if (!Array.isArray(yearHolidays)) {
          continue;
        }

        // If it's the current year, add all holidays to the list
        if (year === currentYear) {
          holidays = yearHolidays.map((h) => ({
            date: h.date,
            localName: h.localName || h.name,
            name: h.name,
          }));
        }

        // Find the next upcoming holiday
        if (!nextHoliday) {
          const upcomingHoliday = yearHolidays
            .filter((h) => {
              const holidayDate = new Date(`${h.date}T00:00:00`);
              return holidayDate.getTime() >= today.getTime();
            })
            .sort((a, b) => {
              const dateA = new Date(`${a.date}T00:00:00`).getTime();
              const dateB = new Date(`${b.date}T00:00:00`).getTime();
              return dateA - dateB;
            })[0];

          if (upcomingHoliday) {
            const holidayDate = new Date(`${upcomingHoliday.date}T00:00:00`);
            const diffInMs = holidayDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(diffInMs / 86400000);

            nextHoliday = {
              date: upcomingHoliday.date,
              localName: upcomingHoliday.localName || upcomingHoliday.name,
              name: upcomingHoliday.name,
              daysRemaining,
            };
          }
        }
      } catch {
        // Continue to next year if this year fails
        continue;
      }
    }

    return {
      year: currentYear,
      holidays,
      nextHoliday: nextHoliday || null,
    };
  },
};
