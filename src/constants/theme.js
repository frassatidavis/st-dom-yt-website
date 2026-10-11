/**
 * Theme constants for inline styles in React components.
 * These mirror the CSS custom properties in src/styles/global.css.
 * When updating colors, update BOTH locations.
 */
export const T = {
  burgundy: "#6B1D2A",
  burgundyDark: "#4A1019",
  gold: "#C5A55A",
  goldLight: "#E8D5A3",
  // Darker gold for small text on light backgrounds — meets WCAG AA contrast (>=5:1 on white).
  // Use for small caps labels, captions, and any gold-colored text < 18pt.
  goldText: "#7A5A0F",
  cream: "#FAF6F0",
  warmWhite: "#FFFDF9",
  stone: "#E8E2D8",
  stoneLight: "#F2EDE5",
  charcoal: "#2C2C2C",
  warmGray: "#6B6560",
  softBlack: "#1A1714",
  // Form/validation error red, leaned toward the brand burgundy.
  // AA on warm white (#FFFDF9) at small text sizes.
  error: "#A03423",
  // Opaque low-saturation chip tints (mirror --chip-soft-*-bg in global.css).
  chipBurgundyBg: "#F4E9EA",
  chipGoldBg: "#F6EEDC",
  // Crisp, architectural radius scale — mirror of --radius-* in global.css.
  // Prefer the CSS var in JSX (borderRadius: "var(--radius-card)"); this object
  // is the documented numeric mirror. control = controls/chips, card = cards/panels,
  // modal = large modals & feature cards. Full circles (50%) stay only for
  // avatars, close/nav buttons, status dots, and step-number bubbles.
  radius: { control: 2, card: 4, modal: 6 },
};

export const fontLink =
  "https://fonts.googleapis.com/css2?family=Gelasio:ital,wght@0,400;0,700;1,400;1,700&family=Nunito+Sans:ital,wght@0,300..800;1,400..700&display=swap";
