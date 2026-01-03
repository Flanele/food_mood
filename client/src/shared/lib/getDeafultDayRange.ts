export function getDefaultDayRange() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0); // today 00:00

  const toLocalInput = (d: Date) => {
    const pad2 = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(
      d.getDate()
    )}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  return {
    from: toLocalInput(start),
    to: toLocalInput(now),
  };
}
