import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import useScrollVar from "./useScrollVar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let rect;

function Box(props) {
  const ref = useRef(null);
  useScrollVar(ref, props);
  return <div ref={ref} />;
}

function render(element) {
  React.act(() => root.render(element));
}

beforeEach(() => {
  rect = { top: 600, height: 400 };
  window.innerHeight = 800;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 1;
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => rect);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  React.act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  delete window.matchMedia;
});

const value = (name = "--scroll") => container.firstChild.style.getPropertyValue(name);

describe("useScrollVar", () => {
  it("tracks progress through the viewport as the page scrolls", () => {
    render(<Box />);
    expect(value()).toBe("0.1667"); // top 600 of 800: (800 - 600) / (800 + 400)
    rect = { top: 200, height: 400 }; // centered
    window.dispatchEvent(new Event("scroll"));
    expect(value()).toBe("0.5000");
  });

  it("in exit mode counts how much has scrolled off the top", () => {
    rect = { top: 0, height: 400 };
    render(<Box name="--exit" mode="exit" />);
    expect(value("--exit")).toBe("0.0000");
    rect = { top: -100, height: 400 };
    window.dispatchEvent(new Event("scroll"));
    expect(value("--exit")).toBe("0.2500");
  });

  it("writes nothing when disabled or when reduced motion is preferred", () => {
    render(<Box enabled={false} />);
    expect(value()).toBe("");
    render(<div />);
    window.matchMedia = (q) => ({ matches: q.includes("reduce") });
    render(<Box />);
    expect(value()).toBe("");
  });
});
