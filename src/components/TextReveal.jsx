import { useEffect, useRef, useState } from "react";
import { reducedMotionQuery } from "../classic";

/**
 * Kinetic typography component — reveals text word-by-word or line-by-line
 * as it scrolls into view. Uses IntersectionObserver for triggering
 * and CSS animations for the actual motion.
 *
 * Usage:
 *   <TextReveal as="h2" style={{ fontSize: 42 }}>
 *     Encounter Jesus Christ with Us
 *   </TextReveal>
 */
export default function TextReveal({
  children,
  as: Tag = "span",
  mode = "word", // "word" | "line"
  stagger = 0.07,
  duration = 0.6,
  threshold = 0.2,
  style = {},
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = reducedMotionQuery();
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, reducedMotion]);

  const text = typeof children === "string" ? children : String(children);

  if (reducedMotion) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  // Split into parts: for "word" mode, split on newlines first to preserve
  // line breaks, then split each line on spaces. Newlines become null markers.
  let parts;
  if (mode === "line") {
    parts = text.split("\n");
  } else {
    const lines = text.split("\n");
    parts = [];
    lines.forEach((line, li) => {
      if (li > 0) parts.push(null); // null = line break marker
      line.split(/\s+/).filter(Boolean).forEach((w) => parts.push(w));
    });
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, overflow: "hidden" }}
    >
      <span className="sr-only">{text}</span>
      {parts.map((part, i) =>
        part === null ? (
          <br key={`br-${i}`} aria-hidden="true" />
        ) : (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(100%)",
              filter: visible ? "blur(0px)" : "blur(4px)",
              transition: `opacity ${duration}s ease ${i * stagger}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}s, filter ${duration}s ease ${i * stagger}s`,
              willChange: "transform, opacity, filter",
            }}
          >
            {part}
            {mode === "word" && i < parts.length - 1 && parts[i + 1] !== null
              ? "\u00A0"
              : ""}
            {mode === "line" && i < parts.length - 1 ? <br /> : ""}
          </span>
        )
      )}
    </Tag>
  );
}

/**
 * Animated gold divider that expands from 0 to full width on scroll.
 */
export function AnimatedDivider({
  width = 60,
  height = 3,
  color,
  center = true,
  delay = 0.3,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = reducedMotionQuery();
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{
        width: reducedMotion ? width : visible ? width : 0,
        height,
        background: color || "#C5A55A",
        margin: center ? "16px auto 0" : "16px 0 0",
        borderRadius: 2,
        transition: reducedMotion
          ? "none"
          : `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    />
  );
}
