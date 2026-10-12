import { describe, expect, it } from "vitest";
import { getTodayScheduleSummary, rowsForDay } from "./schedule";
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
