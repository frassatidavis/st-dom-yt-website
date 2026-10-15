import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./styles/global.css";
import { applyClassic } from "./classic";
import App from "./App";
import { registerSW } from "./registerSW";

// Classic Mode look, before the first paint
applyClassic();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA (production only)
registerSW();
