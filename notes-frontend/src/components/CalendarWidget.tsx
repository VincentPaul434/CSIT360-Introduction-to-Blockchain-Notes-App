import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";

import { calendarApi, type HolidayData } from "../api/calendar";

export const CalendarWidget = () => {
  const [data, setData] = useState<HolidayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHolidays = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const holidays = await calendarApi.getHolidays();
        if (isMounted) {
          setData(holidays);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load holidays.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadHolidays();

    return () => {
      isMounted = false;
    };
  }, []);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const holidayDates = new Set(data?.holidays.map((h) => h.date) ?? []);

  const isHolidayDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return holidayDates.has(dateStr);
  };

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(currentYear, currentMonth)
  );

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Calendar</p>
          <h3 className="mt-2 text-sm font-semibold text-slate-950">Philippine Holidays</h3>
        </div>
        <div className="rounded-full border border-[#d8d8e4] bg-white/70 p-1.5 text-[#6c6987]">
          <Calendar className="h-3.5 w-3.5" />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#66727d]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading...
        </div>
      ) : error ? (
        <p className="mt-3 text-xs text-[#a15b4f]">{error}</p>
      ) : data ? (
        <div className="mt-3 space-y-3">
          {/* Mini Calendar */}
          <div className="rounded-lg border border-[#e7e1da] bg-white p-3">
            <p className="text-xs font-semibold text-slate-950 text-center mb-2">
              {monthName} {currentYear}
            </p>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-[0.6rem] font-medium text-[#b9ad9a]">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const isToday = day === today.getDate();
                const isHoliday = day && isHolidayDate(day);

                return (
                  <div
                    key={idx}
                    className={`aspect-square flex items-center justify-center text-[0.65rem] font-medium rounded ${
                      !day
                        ? "bg-transparent"
                        : isToday
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : isHoliday
                            ? "bg-red-100 text-red-700"
                            : "text-[#66727d]"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Holiday */}
          {data.nextHoliday && (
            <div className="rounded-lg border border-[#e7e1da] bg-white/80 p-2.5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b9ad9a]">
                Next Holiday
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {data.nextHoliday.localName}
              </p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <p className="text-xs text-[#66727d]">{data.nextHoliday.date}</p>
                <div className="rounded-full bg-[#faf3ea] px-2 py-0.5 text-[0.65rem] font-medium text-[#7a6554]">
                  {data.nextHoliday.daysRemaining === 0
                    ? "Today"
                    : `${data.nextHoliday.daysRemaining} day${data.nextHoliday.daysRemaining === 1 ? "" : "s"}`}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 text-[0.65rem] text-[#66727d]">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-300" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-red-100" />
              <span>Holiday</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
