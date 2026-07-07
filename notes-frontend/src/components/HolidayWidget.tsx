import { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";

import { holidayApi, type NextHoliday } from "../api/holiday";

export const HolidayWidget = () => {
  const [holiday, setHoliday] = useState<NextHoliday | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHoliday = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await holidayApi.getNextHoliday();
        if (isMounted) {
          setHoliday(data);
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

    void loadHoliday();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="rounded-[0.85rem_0.2rem_0.85rem_0.2rem] border border-[#d8d8e4] bg-[#f5f4f9] p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#6c6987]">Holiday</p>
          <h3 className="mt-2 text-sm font-semibold text-slate-950">Next holiday</h3>
        </div>
        <div className="rounded-full border border-[#d8d8e4] bg-white/70 p-1.5 text-[#6c6987]">
          <CalendarDays className="h-3.5 w-3.5" />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-[#66727d]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading...
        </div>
      ) : error ? (
        <p className="mt-3 text-xs text-[#a15b4f]">{error}</p>
      ) : holiday ? (
        <div className="mt-3 space-y-2.5">
          <div>
            <p className="text-sm font-semibold text-slate-950">{holiday.name}</p>
            <p className="mt-1 text-xs text-[#66727d]">{holiday.formattedDate ?? holidayApi.formatHolidayDate(holiday.date)}</p>
          </div>

          <div className="rounded-lg border border-[#e7e1da] bg-white/80 p-2.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#b9ad9a]">Days remaining</p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {holiday.daysRemaining === 0 ? "Today" : `${holiday.daysRemaining} day${holiday.daysRemaining === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
