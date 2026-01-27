import dayjs from "dayjs";

export function formatDayOfWeek(date: Date) {
  return dayjs(date).format("dddd");
}

export function formatHourOfDay(date: Date) {
  return dayjs(date).format("h A");
}

export function getHourNumber(hour: string): number | undefined {
  if (hour.includes("AM")) {
    if (parseInt(hour) === 12) return 0;
    return parseInt(hour);
  } else if (hour.includes("PM")) {
    if (parseInt(hour) === 12) return 12;
    return parseInt(hour) + 12;
  }
}
