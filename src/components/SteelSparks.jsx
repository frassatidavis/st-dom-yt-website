import { useEffect, useRef } from "react";

/**
 * SteelSparks — Classic Mode's hover effect for a list: while the pointer
 * moves over one of its rows, a few fine sparks fly off it like the sparks
 * of a steel mill — shooting up and out, arcing down under gravity and
 * fading — drawn in ink on a see-through layer over the list.
 *
 * Props:
 *   targetRef — the list's container (position: relative)
 *   selector  — which children throw sparks (e.g. ".ministry-card")
 */
export default function SteelSparks({ targetRef, selector }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const box = targetRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return undefined;
    // The visitor's own "reduce motion" setting still turns it off
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const sparks = [];
    let frame = 0;
    let last = 0;

    const size = () => {
      canvas.width = box.offsetWidth * dpr;
      canvas.height = box.offsetHeight * dpr;
      canvas.style.width = `${box.offsetWidth}px`;
      canvas.style.height = `${box.offsetHeight}px`;
    };
    size();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(size) : null;
    ro?.observe(box);

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.offsetWidth, box.offsetHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 900 * dt; // gravity
        s.vx *= 0.985;
        const px = s.x;
        const py = s.y;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const a = Math.min(1, s.life / s.max) * 0.85;
        ctx.strokeStyle = `rgba(20, 16, 12, ${a})`;
        ctx.lineWidth = s.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        // A short streak behind each spark, like a hot fleck in motion
        ctx.moveTo(px - s.vx * 0.012, py - s.vy * 0.012);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
      frame = sparks.length ? requestAnimationFrame(tick) : 0;
    };

    const emit = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const speed = 160 + Math.random() * 260;
        const max = 0.35 + Math.random() * 0.45;
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: max, max,
          w: 0.6 + Math.random() * 0.9,
        });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    let lastEmit = 0;
    const onMove = (e) => {
      const row = e.target.closest?.(selector);
      if (!row || !box.contains(row)) return;
      const now = performance.now();
      if (now - lastEmit < 45) return; // a few at a time: subtle
      lastEmit = now;
      const b = box.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      // From under the pointer, along the row's ruled line
      emit(e.clientX - b.left, r.bottom - b.top - 1, 2 + Math.floor(Math.random() * 2));
    };
    const onEnter = (e) => {
      const row = e.target.closest?.(selector);
      // Only on first coming onto a row, not when crossing its own parts
      if (!row || row.contains(e.relatedTarget)) return;
      const b = box.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      emit((e.clientX || r.left + r.width / 2) - b.left, r.bottom - b.top - 1, 7);
    };

    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerover", onEnter);
    return () => {
      cancelAnimationFrame(frame);
      ro?.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerover", onEnter);
    };
  }, [targetRef, selector]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
    />
  );
}
