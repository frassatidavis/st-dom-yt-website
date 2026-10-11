import { Component } from "react";
import { T } from "../constants/theme";

/**
 * ErrorBoundary — catches React render errors and shows a recovery UI
 * instead of a white screen. Wraps the entire app in App.jsx.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: T.cream,
            padding: 24,
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: T.burgundy,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                margin: "0 auto 24px",
              }}
            >
              SD
            </div>
            <h1
              style={{
                fontSize: 28,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: T.softBlack,
                marginBottom: 12,
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontSize: 16,
                color: T.warmGray,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              We're sorry — an unexpected error occurred. Please try refreshing
              the page or return to the homepage.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 28px",
                  background: T.burgundy,
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = import.meta.env.BASE_URL;
                }}
                style={{
                  padding: "12px 28px",
                  background: "transparent",
                  color: T.burgundy,
                  border: `1px solid ${T.burgundy}`,
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
