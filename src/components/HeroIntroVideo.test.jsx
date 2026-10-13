import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
let HeroIntroVideo;
let playSpy;

async function render(element) {
  await React.act(async () => {
    root.render(element);
  });
}

async function advance(ms) {
  await React.act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

function fire(el, type) {
  React.act(() => {
    el.dispatchEvent(new Event(type));
  });
}

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date", "performance"] });
  // fresh module so "played once this page load" starts false in every test
  vi.resetModules();
  ({ default: HeroIntroVideo } = await import("./HeroIntroVideo"));
  playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(() => {}); // jsdom has no media loading
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  React.act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.useRealTimers();
  delete window.matchMedia;
  delete navigator.connection;
  delete document.visibilityState;
});

function setVisibility(state) {
  Object.defineProperty(document, "visibilityState", { value: state, configurable: true });
  React.act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

const props = {
  src: "/videos/intro.mp4",
  poster: "/videos/poster.webp",
  skipLabel: "Skip intro",
  replayLabel: "Replay intro",
};

describe("HeroIntroVideo", () => {
  it("plays muted and inline, with a skip button", async () => {
    const onActiveChange = vi.fn();
    await render(<HeroIntroVideo {...props} onActiveChange={onActiveChange} />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video.muted).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("poster")).toBe(props.poster);
    expect(playSpy).toHaveBeenCalled();
    expect(container.querySelector("button").textContent).toBe("Skip intro");
    expect(onActiveChange).toHaveBeenLastCalledWith(true);
  });

  it("dissolves into the photo over the last moments, then removes itself", async () => {
    const onActiveChange = vi.fn();
    await render(<HeroIntroVideo {...props} onActiveChange={onActiveChange} />);
    const video = container.querySelector("video");
    Object.defineProperty(video, "duration", { value: 25.7, configurable: true });
    video.currentTime = 10;
    fire(video, "timeupdate");
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");

    video.currentTime = 24.5;
    fire(video, "timeupdate");
    const layer = container.querySelector(".hero-intro-video");
    expect(layer.style.opacity).toBe("0");
    expect(layer.style.transition).toContain("1500ms");

    await advance(1500);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("button").textContent).toBe("Replay intro");
    expect(onActiveChange).toHaveBeenLastCalledWith(false);
  });

  it("skips to the photo when the skip button is pressed", async () => {
    await render(<HeroIntroVideo {...props} />);
    React.act(() => container.querySelector("button").click());
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("0");
    await advance(600);
    expect(container.querySelector("video")).toBeNull();
  });

  it("stops the video and its download once it is gone", async () => {
    await render(<HeroIntroVideo {...props} />);
    const video = container.querySelector("video");
    React.act(() => container.querySelector("button").click());
    await advance(600);
    expect(video.isConnected).toBe(false);
    expect(video.hasAttribute("src")).toBe(false);
    playSpy.mockClear();
    setVisibility("hidden");
    setVisibility("visible"); // returning to the tab must not restart the removed video
    expect(playSpy).not.toHaveBeenCalled();
  });

  it("shows the photo when the browser refuses to autoplay, and doesn't retry on return", async () => {
    playSpy.mockRejectedValue(Object.assign(new Error("blocked"), { name: "NotAllowedError" }));
    await render(<HeroIntroVideo {...props} />);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("0");
    await advance(600);
    expect(container.querySelector("video")).toBeNull();
    await render(<div />);
    await render(<HeroIntroVideo {...props} />);
    expect(container.querySelector("video")).toBeNull();
  });

  it("gives up if the video hasn't started after 8 seconds", async () => {
    await render(<HeroIntroVideo {...props} />);
    await advance(7999);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
    await advance(1);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("0");
  });

  it("only counts the 8 seconds while the page is visible (background tabs)", async () => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    await render(<HeroIntroVideo {...props} />);
    await advance(20000);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
    setVisibility("visible");
    fire(container.querySelector("video"), "playing");
    await advance(9000);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
  });

  it("gives way to the photo when playback keeps stalling", async () => {
    await render(<HeroIntroVideo {...props} />);
    const video = container.querySelector("video");
    fire(video, "playing");
    fire(video, "waiting");
    await advance(2000);
    fire(video, "playing"); // 2 s of buffering so far
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
    fire(video, "waiting");
    await advance(1000); // 3 s in total
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("0");
  });

  it("doesn't start on its own on very slow connections", async () => {
    Object.defineProperty(navigator, "connection", { value: { effectiveType: "slow-2g" }, configurable: true });
    await render(<HeroIntroVideo {...props} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("button").textContent).toBe("Replay intro");
  });

  it("keeps playing past 8 seconds once started", async () => {
    await render(<HeroIntroVideo {...props} />);
    fire(container.querySelector("video"), "playing");
    await advance(9000);
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
  });

  it("plays on its own only once per page load", async () => {
    await render(<HeroIntroVideo {...props} />);
    fire(container.querySelector("video"), "playing");
    await render(<div />);
    await render(<HeroIntroVideo {...props} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("button").textContent).toBe("Replay intro");
  });

  it("replays from the start when Replay is pressed, keeping focus on the button", async () => {
    await render(<HeroIntroVideo {...props} />);
    const button = container.querySelector("button");
    button.focus();
    React.act(() => button.click()); // skip
    await advance(600);
    expect(container.querySelector("video")).toBeNull();
    expect(button.textContent).toBe("Replay intro");
    playSpy.mockClear();

    // play() must run during the tap itself (iPhone Low Power Mode)
    let callsDuringTap = 0;
    const onTap = () => (callsDuringTap = playSpy.mock.calls.length);
    document.addEventListener("click", onTap);
    React.act(() => button.click()); // replay
    document.removeEventListener("click", onTap);
    expect(callsDuringTap).toBeGreaterThan(0);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(playSpy).toHaveBeenCalled();
    expect(container.querySelector(".hero-intro-video").style.opacity).toBe("1");
    expect(container.querySelector("button")).toBe(button);
    expect(document.activeElement).toBe(button);
    expect(button.textContent).toBe("Skip intro");
  });

  it("reports intro progress for content over the hero, ending at 1", async () => {
    const target = document.createElement("div");
    const progressTarget = { current: target };
    await render(<HeroIntroVideo {...props} progressTarget={progressTarget} />);
    expect(target.style.getPropertyValue("--intro-progress")).toBe("0.0000");
    expect(target.dataset.intro).toBe("playing");
    React.act(() => container.querySelector("button").click()); // skip
    expect(target.style.getPropertyValue("--intro-progress")).toBe("1.0000");
    expect(target.dataset.intro).toBe("done");
  });

  it("a double tap on Skip doesn't restart the intro", async () => {
    await render(<HeroIntroVideo {...props} />);
    const button = container.querySelector("button");
    React.act(() => button.click());
    React.act(() => button.click());
    expect(button.textContent).toBe("Skip intro");
    await advance(600);
    expect(container.querySelector("video")).toBeNull();
    expect(button.textContent).toBe("Replay intro");
  });

  it("is skipped for visitors who prefer reduced motion", async () => {
    window.matchMedia = (q) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} });
    const onActiveChange = vi.fn();
    await render(<HeroIntroVideo {...props} onActiveChange={onActiveChange} />);
    expect(container.querySelector("video")).toBeNull();
    expect(playSpy).not.toHaveBeenCalled();
    expect(onActiveChange).toHaveBeenLastCalledWith(false);
    // still available on request
    expect(container.querySelector("button").textContent).toBe("Replay intro");
  });
});
