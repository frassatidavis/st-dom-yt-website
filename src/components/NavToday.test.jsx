import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "../i18n";
import NavToday from "./NavToday";

vi.mock("../cms/hooks", () => ({ useSchedule: () => ({ data: null }) }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let menuLeft;

// Header row stand-in: name, today's times, then the menu
function Row() {
  const brandRef = useRef(null);
  return (
    <MemoryRouter>
      <div className="row">
        <div ref={brandRef} className="brand" />
        <NavToday brandRef={brandRef} />
        <div className="menu" />
      </div>
    </MemoryRouter>
  );
}

beforeEach(() => {
  menuLeft = 900;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function rect() {
    if (this.classList.contains("nav-today")) return { left: 400, right: 640, top: 15, bottom: 61, height: 46 };
    if (this.classList.contains("menu")) return { left: menuLeft, right: 1400, top: 20, bottom: 56, height: 36 };
    return { left: 0, right: 0, top: 0, bottom: 0, height: 0 };
  });
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(76);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  React.act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

describe("NavToday", () => {
  it("shows today's date, Masses and confessions, linking to the schedule, when it fits", () => {
    React.act(() => root.render(<Row />));
    const link = container.querySelector(".nav-today");
    expect(link.style.display).toBe("");
    expect(link.getAttribute("href")).toBe("/mass-times");
    // labelled with today's date, so it's plain the times are current
    const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    expect(link.textContent).toContain(today);
    expect(link.textContent).toContain("call for appointment");
  });

  it("hides when it would crowd the menu", () => {
    menuLeft = 650; // less than 16px between today's times and the menu
    React.act(() => root.render(<Row />));
    expect(container.querySelector(".nav-today").style.display).toBe("none");
  });
});
