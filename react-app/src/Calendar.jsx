import React, { useEffect, useMemo, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Calendar() {
  const [now, setNow] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthLabel = useMemo(() =>
    cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })
  , [cursor]);

  const days = useMemo(() => {
    const startDay = new Date(year, month, 1).getDay();
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(year, month, i - startDay + 1);
      return { date, inMonth: date.getMonth() === month };
    });
  }, [year, month]);

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const shiftMonth = (delta) => setCursor(new Date(year, month + delta, 1));

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <div>
          <div className="cal-title">{monthLabel}</div>
          <div className="cal-clock">{now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div className="cal-nav">
          <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
          <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
        </div>
      </div>
      <div className="cal-weekdays">
        {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {days.map(({ date, inMonth }) => {
          const className = [
            "cal-cell",
            inMonth ? "" : "other-month",
            isSameDay(date, now) ? "is-today" : "",
            isSameDay(date, selected) ? "is-selected" : "",
          ].filter(Boolean).join(" ");
          return (
            <button key={date.toISOString()} type="button" className={className} onClick={() => setSelected(date)} aria-label={date.toDateString()}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
