import { clsx as baseClsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof baseClsx>) {
  return twMerge(baseClsx(inputs));
}

export function getNowDateTime() {
  const d = new Date();
  return {
    date: d.toISOString().slice(0, 10), // YYYY-MM-DD
    time: d.toTimeString().slice(0, 5), // HH:mm
  };
}
