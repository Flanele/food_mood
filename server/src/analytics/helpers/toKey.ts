const pad2 = (n: number) => String(n).padStart(2, "0");

// --- key builders (точки графика) ---

export const toHourKey = (d: Date) => {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return `${pad2(x.getHours())}:00`; // для оси X "по времени"
};

export const toDayKey = (d: Date) => d.toISOString().slice(0, 10);

export const toMonthKey = (d: Date) => d.toISOString().slice(0, 7); 

export const toWeekRangeKey = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // Monday=0
  x.setDate(x.getDate() - diff); // monday

  const monday = new Date(x);
  const sunday = new Date(x);
  sunday.setDate(monday.getDate() + 6);

  return `${toDayKey(monday)}..${toDayKey(sunday)}`;
};

export const toWeekdayKey = (d: Date) => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const n = names[d.getDay()];
  const order: Record<string, string> = {
    Mon: "1 Mon",
    Tue: "2 Tue",
    Wed: "3 Wed",
    Thu: "4 Thu",
    Fri: "5 Fri",
    Sat: "6 Sat",
    Sun: "7 Sun",
  };
  return order[n];
};