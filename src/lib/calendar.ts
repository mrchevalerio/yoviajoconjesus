export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isBeforeDay(a: Date, b: Date): boolean {
  const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aa.getTime() < bb.getTime();
}

export const SOLD_OUT_WINDOW_DAYS = 10;

/** Placeholder demand simulation: the next N days from today read as sold out. */
export function isSoldOut(d: Date, today: Date): boolean {
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + SOLD_OUT_WINDOW_DAYS - 1);
  return dd.getTime() >= start.getTime() && dd.getTime() <= end.getTime();
}

/** "HH:MM" 24h strings at a fixed interval, spanning a full day. */
export function timeSlots(intervalMinutes: number): string[] {
  const count = (24 * 60) / intervalMinutes;
  return Array.from({ length: count }, (_, i) => {
    const totalMinutes = i * intervalMinutes;
    const h = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const m = String(totalMinutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  });
}

export function formatTimeSlot(slot: string, locale: string): string {
  const [h, m] = slot.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(d);
}

/** Returns a 6x7 grid of Dates for the month containing `monthDate`, padded with adjacent-month days. */
export function getMonthMatrix(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function weekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const base = new Date(2024, 0, 7); // a Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return formatter.format(d);
  });
}

export function monthLabel(monthDate: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(monthDate);
}
