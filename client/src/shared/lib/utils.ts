import { clsx as baseClsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof baseClsx>) {
  return twMerge(baseClsx(inputs));
}
