import { formatDayOfWeek, formatHourOfDay, getHourNumber } from "./formatDay";

describe("formatDay", () => {
  let date: Date;

  beforeEach(() => {
    date = new Date("2026-02-21T12:00");
  });

  it("should get hour number", () => {
    expect(getHourNumber("12 AM")).toBe(0);
    expect(getHourNumber("12 PM")).toBe(12);
    expect(getHourNumber("1 PM")).toBe(13);
    expect(getHourNumber("11 PM")).toBe(23);
  });

  it("should format day of week", () => {
    expect(formatDayOfWeek(date)).toBe("Saturday");
  });

  it("should format hour of day", () => {
    expect(formatHourOfDay(date)).toBe("12 PM");
  });
});
