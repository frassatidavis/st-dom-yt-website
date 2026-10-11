import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { T } from "../constants/theme";
import { Section, SectionTitle } from "../components/Section";
import PageHeader from "../components/PageHeader";
import DominicanDivider from "../components/DominicanDivider";
import Seo from "../components/Seo";
import Icon from "../components/Icon";
import { PHOTOS } from "../constants/photos";
import { save as saveAnnouncement, remove as removeAnnouncement } from "../announcements/store";
import { useAllAnnouncements } from "../announcements/useAnnouncements";

// Each dashboard is loaded the first time its tab is opened, so admins
// who only edit one section don't pay for the others.
const AnnouncementDashboard = lazy(() => import("../announcements/AnnouncementDashboard"));
const AnnouncementComposer = lazy(() => import("../announcements/AnnouncementComposer"));
const BulletinDashboard = lazy(() => import("../bulletins/BulletinDashboard"));
const EventDashboard = lazy(() => import("../events/EventDashboard"));
const ScheduleDashboard = lazy(() => import("../schedule-admin/ScheduleDashboard"));
const StaffDirectoryDashboard = lazy(() => import("../staff-admin/StaffDirectoryDashboard"));
const MinistriesDashboard = lazy(() => import("../ministries-admin/MinistriesDashboard"));
const SettingsDashboard = lazy(() => import("../settings/SettingsDashboard"));
const DataHelpDashboard = lazy(() => import("../admin/DataHelpDashboard"));
import {
  Megaphone,
  Newspaper,
  Calendar,
  Clock,
  Users,
  HandHeart,
  Settings,
  LifeBuoy,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
 *  WritersGuide — Staff-only management dashboard.
 *
 *  Passphrase gate → Section tabs (Announcements | Bulletins | …)
 *
 *  Announcements: create/schedule header banners and popup cards
 *  plus Bulletins, Events, Mass Schedule, Staff, Ministries,
 *  Settings, and Data & Help.
 * ────────────────────────────────────────────────────────── */

const STORAGE_KEY = "stdom_staff_auth";
const TOKEN_KEY = "stdom_staff_token";
// Soft gate, not auth — the value lives in the client bundle either way.
// Override per-deployment via VITE_STAFF_PASSPHRASE; the default is "veritas"
// (the Dominican motto) to match what's documented in docs/admin-guide.md.
const PASSPHRASE = (import.meta.env.VITE_STAFF_PASSPHRASE || "veritas").toLowerCase();

// ── Passphrase Gate ──
function PassphraseGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === PASSPHRASE) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title="Staff Area" description="" />
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: T.warmWhite,
          padding: 24,
        }}
      >
        <form
          onSubmit={handleUnlock}
          style={{
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            padding: 48,
            background: "#fff",
            borderRadius: "var(--radius-card)",
            border: `1px solid ${T.stone}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${T.burgundy}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Icon name="Shield" size={28} color={T.burgundy} />
          </div>
          <h1
            style={{
              fontSize: 24,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: T.softBlack,
              marginBottom: 8,
            }}
          >
            Staff Dashboard
          </h1>
          <p
            style={{
              fontSize: 14,
              color: T.warmGray,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            This page is for parish staff and friars.
            <br />
            Enter the passphrase to continue.
          </p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passphrase"
            aria-label="Staff passphrase"
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 15,
              border: `1.5px solid ${error ? T.error : T.stone}`,
              borderRadius: "var(--radius-card)",
              outline: "none",
              fontFamily: "var(--font-body)",
              textAlign: "center",
              letterSpacing: 2,
              transition: "border-color 0.2s",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = T.gold;
            }}
            onBlur={(e) => {
              if (!error) e.target.style.borderColor = T.stone;
            }}
            autoFocus
          />
          {error && (
            <p style={{ fontSize: 13, color: T.error, marginBottom: 12 }}>
              Incorrect passphrase. Please try again.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              background: T.burgundy,
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-card)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard tab loader (shown while a tab's chunk fetches) ──
function DashboardLoader() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}
    >
      <div
        className="skeleton-block"
        style={{ width: "min(640px, 100%)", height: 220, borderRadius: "var(--radius-card)" }}
      />
    </div>
  );
}

// ── Success Toast ──
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 24px",
        background: type === "error" ? T.error : "#2E7D32",
        color: "#fff",
        borderRadius: "var(--radius-card)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        animation: "fadeInUp 0.3s ease",
      }}
      role="status"
      aria-live="polite"
    >
      <Icon name={type === "error" ? "Flame" : "Sparkles"} size={18} color="#fff" />
      {message}
    </div>
  );
}

// ── Section Tab Bar ──
function SectionTabs({ active, onChange }) {
  const tabs = [
    { key: "announcements", label: "Announcements", Icon: Megaphone },
    { key: "bulletins", label: "Bulletins", Icon: Newspaper },
    { key: "events", label: "Events", Icon: Calendar },
    { key: "schedule", label: "Mass Schedule", Icon: Clock },
    { key: "staff", label: "Staff", Icon: Users },
    { key: "ministries", label: "Ministries", Icon: HandHeart },
    { key: "settings", label: "Settings", Icon: Settings },
    { key: "data", label: "Data & Help", Icon: LifeBuoy },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: `1px solid ${T.stone}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          gap: 0,
          flexWrap: "wrap",
          overflowX: "auto",
        }}
      >
        {tabs.map(({ key, label, Icon: TabIcon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 20px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${isActive ? T.burgundy : "transparent"}`,
                color: isActive ? T.burgundy : T.warmGray,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: -1, // overlap the border-bottom of the container
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = T.charcoal;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = T.warmGray;
              }}
            >
              <TabIcon size={15} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Staff Dashboard ──
export default function WritersGuide() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const handleUnlock = useCallback(() => {
    setAuthed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem(TOKEN_KEY, PASSPHRASE);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    try {
      if (!sessionStorage.getItem(TOKEN_KEY)) {
        sessionStorage.setItem(TOKEN_KEY, PASSPHRASE);
      }
    } catch {
      /* ignore */
    }
  }, [authed]);

  if (!authed) {
    return <PassphraseGate onUnlock={handleUnlock} />;
  }

  return <StaffDashboard />;
}

const HINT_DISMISSED_KEY = "stdom_staff_welcome_hint_dismissed";

function WelcomeHint({ onGoToData, onDismiss }) {
  return (
    <div
      style={{
        background: `${T.gold}18`,
        borderBottom: `1px solid ${T.gold}55`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          fontFamily: "var(--font-body)",
        }}
      >
        <span style={{ fontSize: 20 }}>👋</span>
        <div style={{ flex: 1, minWidth: 240, fontSize: 13.5, color: T.charcoal, lineHeight: 1.5 }}>
          <strong>New here?</strong> Changes save to this browser only. Visit{" "}
          <strong>Data & Help</strong> to learn how to back up your work or move it between
          computers.
        </div>
        <button
          onClick={onGoToData}
          style={{
            padding: "7px 14px",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-card)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Open Data & Help
        </button>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: T.warmGray,
            fontSize: 18,
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function StaffDashboard() {
  // Top-level section: "announcements" | "bulletins" | …
  const [section, setSection] = useState("announcements");
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem(HINT_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  // Announcements state
  const { refresh: refreshAnnouncements } = useAllAnnouncements();
  const [annView, setAnnView] = useState("dashboard"); // "dashboard" | "compose"
  const [editingAnn, setEditingAnn] = useState(null);

  const [toast, setToast] = useState(null);

  // ── Section switch resets child views ──
  const handleSectionChange = useCallback((s) => {
    setSection(s);
    setAnnView("dashboard");
    setEditingAnn(null);
  }, []);

  // ── Bulletin toast passthrough ──
  const handleBulletinToast = useCallback((t) => setToast(t), []);

  // ── Announcement handlers ──
  const handleNewAnn = useCallback(() => {
    setEditingAnn(null);
    setAnnView("compose");
  }, []);

  const handleEditAnn = useCallback((ann) => {
    setEditingAnn(ann);
    setAnnView("compose");
  }, []);

  const handleCancelAnn = useCallback(() => {
    setEditingAnn(null);
    setAnnView("dashboard");
  }, []);

  const handleSaveAnn = useCallback(
    (data) => {
      try {
        saveAnnouncement(data);
        setToast({
          message: data.id ? "Announcement updated!" : "Announcement created!",
          type: "success",
        });
        setAnnView("dashboard");
        setEditingAnn(null);
        refreshAnnouncements();
      } catch {
        setToast({ message: "Failed to save. Please try again.", type: "error" });
      }
    },
    [refreshAnnouncements]
  );

  const handleDeleteAnn = useCallback(
    (id) => {
      try {
        removeAnnouncement(id);
        setToast({ message: "Announcement deleted.", type: "success" });
        setAnnView("dashboard");
        setEditingAnn(null);
        refreshAnnouncements();
      } catch {
        setToast({ message: "Failed to delete.", type: "error" });
      }
    },
    [refreshAnnouncements]
  );

  // ── Dynamic page title ──
  const pageTitle = (() => {
    if (section === "announcements") {
      if (annView === "compose") return editingAnn ? "Edit Announcement" : "New Announcement";
      return "Staff Dashboard";
    }
    if (section === "bulletins") return "Staff Dashboard";
    return "Staff Dashboard";
  })();

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo
        title="Staff Dashboard"
        description="Staff management dashboard for St. Dominic Catholic Church."
      />
      <PageHeader title={pageTitle} variant="text" />

      {/* ── Welcome hint (dismissible, first visit only) ── */}
      {!hintDismissed && (
        <WelcomeHint
          onGoToData={() => {
            dismissHint();
            handleSectionChange("data");
          }}
          onDismiss={dismissHint}
        />
      )}

      {/* ── Section tabs ── */}
      <SectionTabs active={section} onChange={handleSectionChange} />

      {/* One Suspense boundary covers every tab — only the active tab's
          chunk is fetched, and tab switches reuse already-loaded chunks. */}
      <Suspense fallback={<DashboardLoader />}>
        {/* ── Bulletins section ── */}
        {section === "bulletins" && (
          <Section bg={T.warmWhite}>
            <BulletinDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Announcements section ── */}
        {section === "announcements" && (
          <Section bg={T.warmWhite}>
            {annView === "dashboard" && (
              <AnnouncementDashboard onEdit={handleEditAnn} onNew={handleNewAnn} />
            )}
            {annView === "compose" && (
              <AnnouncementComposer
                announcement={editingAnn}
                onSave={handleSaveAnn}
                onDelete={handleDeleteAnn}
                onCancel={handleCancelAnn}
              />
            )}
          </Section>
        )}

        {/* ── Events section ── */}
        {section === "events" && (
          <Section bg={T.warmWhite}>
            <EventDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Mass Schedule section ── */}
        {section === "schedule" && (
          <Section bg={T.warmWhite}>
            <ScheduleDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Staff Directory section ── */}
        {section === "staff" && (
          <Section bg={T.warmWhite}>
            <StaffDirectoryDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Ministries section ── */}
        {section === "ministries" && (
          <Section bg={T.warmWhite}>
            <MinistriesDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Site Settings section ── */}
        {section === "settings" && (
          <Section bg={T.warmWhite}>
            <SettingsDashboard onToast={handleBulletinToast} />
          </Section>
        )}

        {/* ── Data & Help section ── */}
        {section === "data" && (
          <Section bg={T.warmWhite}>
            <DataHelpDashboard onToast={handleBulletinToast} />
          </Section>
        )}
      </Suspense>

      {/* Toast notifications (portal to body to escape transform stacking) */}
      {toast &&
        createPortal(
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />,
          document.body
        )}
    </div>
  );
}
