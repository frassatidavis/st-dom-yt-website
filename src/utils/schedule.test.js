import { describe, expect, it } from "vitest";
import { formatWeeklySchedule, getTodayScheduleSummary, rowsForDay } from "./schedule";
import { sundayMass, dailyMass, confession } from "../data/schedule";

describe("rowsForDay", () => {
  it("includes Spanish Sunday Mass on Sundays", () => {
    expect(rowsForDay(sundayMass, "sunday").map(([, time]) => time)).toContain("12:30 PM");
  });

  it("includes Saturday Vigil on Saturdays", () => {
    expect(rowsForDay(sundayMass, "saturday").map(([, time]) => time)).toContain("5:00 PM");
  });
});

describe("getTodayScheduleSummary", () => {
  it("summarizes Monday daily Masses", () => {
    const summary = getTodayScheduleSummary({ sundayMass, dailyMass, confession }, new Date(2026, 4, 18));
    expect(summary.todayKey).toBe("monday");
    expect(summary.masses).toBe("8:00 AM, 12:00 PM");
  });
});

describe("formatWeeklySchedule", () => {
  const labels = {
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    and: "&",
    notes: { spanish: "Español", vigil: "Vigil" },
  };

  it("lists every Mass Sunday through Saturday, merging identical weekdays", () => {
    const { mass } = formatWeeklySchedule({ sundayMass, dailyMass, confession }, labels);
    expect(mass).toEqual([
      { days: "Sun", times: "8:00, 10:00 AM, 12:30 PM (Español)" },
      { days: "Mon–Fri", times: "8:00 AM, 12:00 PM" },
      { days: "Sat", times: "8:00 AM, 5:00 PM (Vigil)" },
    ]);
  });

  it("groups confession slots shared across days, Sunday first", () => {
    const { confession: slots } = formatWeeklySchedule({ sundayMass, dailyMass, confession }, labels);
    expect(slots).toEqual([
      { days: "Sun", times: "11:30–11:55 AM (Español)" },
      { days: "Wed, Fri & Sat", times: "11:15 AM–12:00 PM" },
      { days: "Sat", times: "4:00–5:00 PM" },
    ]);
  });
});
