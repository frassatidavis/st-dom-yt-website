import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X, ArrowRight } from "lucide-react";
import { T } from "../constants/theme";
import { searchPages } from "../data/searchIndex";

/* ── SiteSearch Component ── */
export default function SiteSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const results = useMemo(() => searchPages(query), [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results.length, query]);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure the DOM has rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  // Close + return focus to the trigger (dialog convention)
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  }, []);

  const goTo = useCallback(
    (path) => {
      setOpen(false);
      setQuery("");
      if (document.startViewTransition) {
        document.startViewTransition(() => navigate(path));
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  // Keep a ref of results for the document-level handler (avoids re-binding)
  const resultsForKeys = useRef(results);
  useEffect(() => {
    resultsForKeys.current = results;
  }, [results]);

  // Dialog keyboard handling at the document level, so Escape/arrows work
  // no matter which element inside the dialog holds focus (input, result
  // link, clear button). Tab is trapped within the panel.
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'button, input, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (!resultsForKeys.current.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < resultsForKeys.current.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : resultsForKeys.current.length - 1
        );
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  // Enter selects the active result (input-level so plain typing is untouched)
  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        goTo(results[activeIndex].path);
      }
    },
    [results, activeIndex, goTo]
  );

  // Scroll active result into view
  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.children;
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Close on overlay click
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) close();
    },
    [close]
  );

  // Global shortcut: Ctrl/Cmd + K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        // Nav mounts two instances (desktop row + mobile menu); only one
        // should answer. Prefer the one whose trigger is on screen.
        const visible = triggerRef.current?.offsetParent != null;
        const otherVisible = [...document.querySelectorAll("[data-site-search-trigger]")].some(
          (el) => el !== triggerRef.current && el.offsetParent != null
        );
        if (!visible && otherVisible) return;
        e.preventDefault();
        setOpen((prev) => {
          if (prev) setQuery("");
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Search trigger button */}
      <button
        ref={triggerRef}
        data-site-search-trigger
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 8,
          color: T.warmGray,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = T.burgundy)}
        onMouseLeave={(e) => (e.currentTarget.style.color = T.warmGray)}
      >
        <Search size={18} strokeWidth={2} />
      </button>

      {/* Modal overlay — portaled to <body> so it shows even when the trigger's
          nav row is hidden (Cmd/Ctrl+K at widths where the menu button shows). */}
      {open && createPortal(
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(26, 23, 20, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "min(15vh, 120px)",
            animation: "searchOverlayIn 0.2s ease",
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "0 20px",
              background: T.warmWhite,
              borderRadius: "var(--radius-modal)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.22), 0 0 0 1px rgba(107,29,42,0.08)",
              overflow: "hidden",
              animation: "searchPanelIn 0.25s ease",
            }}
          >
            {/* Search input area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                borderBottom: `1px solid ${T.stone}`,
              }}
            >
              <Search size={20} color={T.warmGray} strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search pages..."
                aria-label="Search the site"
                autoComplete="off"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 17,
                  fontFamily: "var(--font-body)",
                  color: T.softBlack,
                  letterSpacing: 0.2,
                }}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: T.warmGray,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={16} />
                </button>
              )}
              <kbd
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  color: T.warmGray,
                  background: T.cream,
                  border: `1px solid ${T.stone}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results area */}
            <div
              ref={resultsRef}
              style={{
                maxHeight: "min(50vh, 400px)",
                overflowY: "auto",
              }}
            >
              {query.trim().length >= 2 && results.length === 0 && (
                <div
                  style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: T.warmGray,
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 500 }}>No results found</p>
                  <p style={{ margin: "8px 0 0", fontSize: 13, opacity: 0.7 }}>
                    Try a different search term
                  </p>
                </div>
              )}

              {results.map((page, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={page.path}
                    onClick={() => goTo(page.path)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      width: "100%",
                      padding: "14px 20px",
                      border: "none",
                      borderBottom: `1px solid ${T.stoneLight}`,
                      background: isActive ? T.cream : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isActive ? T.burgundy : T.charcoal,
                          fontFamily: "var(--font-display)",
                          letterSpacing: 0.3,
                          transition: "color 0.15s",
                        }}
                      >
                        {page.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: T.warmGray,
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {page.description}
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      color={isActive ? T.burgundy : T.stone}
                      style={{ flexShrink: 0, transition: "color 0.15s" }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            {query.trim().length < 2 && (
              <div
                style={{
                  padding: "20px 20px 24px",
                  textAlign: "center",
                  color: T.warmGray,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                }}
              >
                <p style={{ margin: 0, opacity: 0.7 }}>
                  Type at least 2 characters to search
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: 12,
                    fontSize: 12,
                    opacity: 0.5,
                  }}
                >
                  <span>
                    <kbd style={kbdSmall}>↑</kbd> <kbd style={kbdSmall}>↓</kbd> navigate
                  </span>
                  <span>
                    <kbd style={kbdSmall}>↵</kbd> select
                  </span>
                  <span>
                    <kbd style={kbdSmall}>esc</kbd> close
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Animations */}
          <style>{`
            @keyframes searchOverlayIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes searchPanelIn {
              from { opacity: 0; transform: scale(0.97) translateY(-8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

const kbdSmall = {
  fontSize: 10,
  fontFamily: "var(--font-body)",
  background: "#E8E2D8",
  borderRadius: "var(--radius-control)",
  padding: "1px 5px",
  border: "1px solid #D5CFC5",
};
