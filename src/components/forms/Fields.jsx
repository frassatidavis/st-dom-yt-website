import { useState } from "react";
import { T } from "../../constants/theme";

/**
 * Shared floating-label form fields used by Contact and Register.
 * One source of truth for field chrome, focus states, and inline errors
 * (these were previously duplicated in both pages).
 */

export const errorStyle = {
  fontSize: 12,
  color: T.error,
  marginTop: 4,
  fontFamily: "var(--font-body)",
};

const fieldChrome = (focused, error) => ({
  width: "100%",
  padding: "22px 16px 8px",
  fontSize: 15,
  border: `1.5px solid ${error ? T.error : focused ? T.burgundy : T.stone}`,
  borderRadius: "var(--radius-control)",
  fontFamily: "var(--font-body)",
  background: "#fff",
  outline: "none",
  transition: "border-color 0.25s, box-shadow 0.25s",
  boxShadow: focused ? "0 0 0 3px rgba(107,29,42,0.08)" : "none",
});

const floatingLabel = (active, focused) => ({
  position: "absolute",
  left: 16,
  top: active ? 8 : 18,
  fontSize: active ? 11 : 15,
  fontWeight: active ? 600 : 400,
  color: focused ? T.burgundy : T.warmGray,
  pointerEvents: "none",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  letterSpacing: active ? 0.5 : 0,
  fontFamily: "var(--font-body)",
});

export function FloatingInput({
  label,
  required,
  type = "text",
  value,
  onChange,
  onBlurValidate,
  error,
  ariaLabel,
  ariaDescribedBy,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (onBlurValidate) onBlurValidate();
        }}
        style={{ ...fieldChrome(focused, error), minHeight: 56 }}
        {...rest}
      />
      <label style={floatingLabel(active, focused)}>
        {label}
        {required && " *"}
      </label>
      {error && (
        <div id={ariaDescribedBy} style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
}

export function FloatingTextarea({
  label,
  required,
  value,
  onChange,
  rows = 5,
  placeholder,
  ariaLabel,
  onBlurValidate,
  error,
  ariaDescribedBy,
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div style={{ position: "relative" }}>
      <textarea
        required={required}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (onBlurValidate) onBlurValidate();
        }}
        rows={rows}
        placeholder={focused && placeholder ? placeholder : undefined}
        style={{ ...fieldChrome(focused, error), resize: "vertical" }}
      />
      <label style={floatingLabel(active, focused)}>
        {label}
        {required && " *"}
      </label>
      {error && (
        <div id={ariaDescribedBy} style={errorStyle}>
          {error}
        </div>
      )}
    </div>
  );
}

export function StyledSelect({ label, value, onChange, children, ariaLabel }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...fieldChrome(focused, false),
          minHeight: 56,
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B6560' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        {children}
      </select>
      <label
        style={{
          position: "absolute",
          left: 16,
          top: 8,
          fontSize: 11,
          fontWeight: 600,
          color: focused ? T.burgundy : T.warmGray,
          pointerEvents: "none",
          transition: "color 0.2s",
          letterSpacing: 0.5,
          fontFamily: "var(--font-body)",
        }}
      >
        {label}
      </label>
    </div>
  );
}
