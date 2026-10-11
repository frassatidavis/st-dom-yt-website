import { useState, useRef, useEffect } from "react";
import { T } from "../constants/theme";
import {
  Download,
  Upload,
  AlertTriangle,
  Info,
  FileDown,
  RefreshCcw,
  HelpCircle,
  Laptop,
  Cloud,
  CloudOff,
  CheckCircle2,
} from "lucide-react";
import { exportAll, importFromFile, clearAll, countPopulated, MANAGED_KEYS } from "./dataManager";
import {
  isConfigured as syncConfigured,
  getStatus as getSyncStatus,
  subscribe as subscribeSync,
  pullAll as syncPull,
  flush as syncFlush,
  clearRemote as syncClearRemote,
} from "../cms/adminSync";

const SECTIONS = [
  { title: "What am I editing?", icon: Info, body: (
      <>
        Every tab in this dashboard (Announcements, Bulletins, Events,
        Mass Schedule, Staff, Ministries, Settings) saves your changes to
        <strong> this browser on this computer</strong>. The public St. Dominic
        website reads those changes and shows them to visitors.
      </>
    ),
  },
  { title: "The catch: one computer at a time", icon: Laptop, body: (
      <>
        Because everything is stored in your browser, edits you make here
        don't automatically appear on other computers, phones, or browsers.
        If you want your home laptop and the parish office to stay in sync,
        use the <strong>Export</strong> and <strong>Import</strong> buttons
        below to move a backup file between them.
      </>
    ),
  },
  { title: "Always back up before big changes", icon: AlertTriangle, body: (
      <>
        Clearing browser history or switching to a new computer wipes admin
        data. Before any big edit — or at least once a week — click
        <strong> Export Backup</strong> and save the file somewhere safe
        (Google Drive, email to yourself, OneDrive, etc.).
      </>
    ),
  },
  { title: "Accidentally deleted something?", icon: HelpCircle, body: (
      <>
        Click <strong>Import Backup</strong> and choose your most recent
        backup file. The dashboard will restore everything exactly as it
        was when you exported it.
      </>
    ),
  },
];

/* ── Helpers ────────────────────────────────────────────── */

function formatDate(iso) {
  if (!iso) return "unknown date";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/* ── Component ──────────────────────────────────────────── */

export default function DataHelpDashboard({ onToast }) {
  const fileRef = useRef(null);
  const [lastAction, setLastAction] = useState(null);
  const [strategy, setStrategy] = useState("replace");
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [syncing, setSyncing] = useState(false);

  const populated = countPopulated();
  const total = MANAGED_KEYS.length;
  const cloudOn = syncConfigured();

  useEffect(() => subscribeSync(setSyncStatus), []);

  const handlePullNow = async () => {
    setSyncing(true);
    const n = await syncPull();
    setSyncing(false);
    onToast?.({
      message: n > 0 ? `Pulled ${n} section${n === 1 ? "" : "s"} from the cloud.` : "Cloud reached — nothing new to pull.",
      type: "success",
    });
    if (n > 0) setTimeout(() => window.location.reload(), 800);
  };

  const handleFlushNow = () => {
    syncFlush();
    onToast?.({ message: "Pending changes pushed to the cloud.", type: "success" });
  };

  const handleExport = () => {
    try {
      const { count } = exportAll();
      onToast?.({ message: `Backup saved (${count} section${count === 1 ? "" : "s"}).`, type: "success" });
      setLastAction({ kind: "export", count, at: new Date().toISOString() });
    } catch {
      onToast?.({ message: "Could not create backup file.", type: "error" });
    }
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting the same file later

    const confirmMsg = strategy === "replace"
      ? "This will replace all current admin data with the contents of the backup file. Continue?"
      : "This will add the backup's data on top of what's already here, overwriting anything with the same key. Continue?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const { count, exportedAt } = await importFromFile(file, strategy);
      onToast?.({
        message: `Restored ${count} section${count === 1 ? "" : "s"} from ${formatDate(exportedAt)}.`,
        type: "success",
      });
      setLastAction({ kind: "import", count, at: new Date().toISOString(), fromDate: exportedAt });
      // Force a reload so every section re-reads localStorage
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      onToast?.({ message: err.message || "Could not read backup file.", type: "error" });
    }
  };

  const handleClearAll = () => {
    const msg = "Wipe ALL admin data? This will reset Announcements, Bulletins, Events, Mass Schedule, Staff, Ministries, and Settings to the built-in defaults. This cannot be undone without a backup file. Continue?";
    if (!window.confirm(msg)) return;
    if (!window.confirm("Are you absolutely sure? Type 'reset' in your head as a final check.")) return;
    clearAll();
    onToast?.({ message: "All admin data cleared.", type: "success" });
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>
          Data & Help
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
          Back up your work, move data between computers, and learn how the dashboard works.
        </p>
      </div>

      {/* Status card */}
      <div
        style={{
          background: "linear-gradient(135deg, #fff 0%, " + T.cream + " 100%)",
          border: `1px solid ${T.stone}`,
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `${T.burgundy}14`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileDown size={26} color={T.burgundy} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack }}>
            {populated} of {total} sections have custom data
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: T.warmGray, marginTop: 4 }}>
            {populated === 0
              ? "No custom changes saved yet — you're running on the built-in defaults."
              : "Anything you've edited on this computer is saved locally. Export a backup to keep it safe."}
          </div>
        </div>
      </div>

      {/* Cloud sync card */}
      <div
        style={{
          background: cloudOn ? `${T.gold}0F` : "#fff",
          border: `1px solid ${cloudOn ? T.gold : T.stone}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: cloudOn ? `${T.burgundy}14` : `${T.warmGray}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {cloudOn ? <Cloud size={22} color={T.burgundy} /> : <CloudOff size={22} color={T.warmGray} />}
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: T.softBlack }}>
              {cloudOn ? "Cloud sync is on" : "Cloud sync is off"}
              {cloudOn && syncStatus.pending?.length === 0 && <CheckCircle2 size={16} color="#2f855a" />}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: T.warmGray, marginTop: 4, lineHeight: 1.5 }}>
              {cloudOn ? (
                <>
                  Your edits automatically save to the shared Google Sheet so every
                  device — office, laptop, phone — sees the same data.
                  {syncStatus.lastPushedAt && <> Last saved {formatDate(syncStatus.lastPushedAt)}.</>}
                  {syncStatus.lastPulledAt && <> Last refreshed {formatDate(syncStatus.lastPulledAt)}.</>}
                </>
              ) : (
                <>
                  Without cloud sync, your edits only live in this browser. Set up
                  the Google Sheet backend (instructions below) so your changes
                  reach the public site from any device.
                </>
              )}
            </div>
          </div>
        </div>

        {cloudOn && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handlePullNow}
              disabled={syncing}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "#fff",
                color: T.burgundy,
                border: `1px solid ${T.burgundy}`,
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: syncing ? "wait" : "pointer",
                opacity: syncing ? 0.6 : 1,
              }}
            >
              <RefreshCcw size={14} /> {syncing ? "Refreshing…" : "Refresh from cloud"}
            </button>
            {syncStatus.pending?.length > 0 && (
              <button
                onClick={handleFlushNow}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  background: T.burgundy,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                }}
              >
                <Upload size={14} /> Save {syncStatus.pending.length} pending now
              </button>
            )}
          </div>
        )}

        {syncStatus.error && (
          <div style={{ marginTop: 10, fontSize: 12, color: T.error, fontFamily: "var(--font-body)" }}>
            {syncStatus.error}
          </div>
        )}

        {!cloudOn && (
          <details style={{ marginTop: 8, fontFamily: "var(--font-body)", fontSize: 13, color: T.charcoal, lineHeight: 1.6 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: T.burgundy }}>
              How to turn on cloud sync (5 minutes — technical setup)
            </summary>
            <p style={{ margin: "10px 0 0", fontStyle: "italic", color: T.warmGray }}>
              This is a one-time developer-side setup — typically handled by the pastor or whoever maintains the website. If you're not sure, reach out to the person who set up the site rather than following these steps yourself.
            </p>
            <ol style={{ margin: "10px 0 0 20px", paddingLeft: 0 }}>
              <li>Open your St. Dominic Google Sheet → <strong>Extensions → Apps Script</strong>.</li>
              <li>Create a new script file and paste the contents of <code>cms/admin-cms.gs</code> from the repo.</li>
              <li>Run the <code>setupAdminSheet</code> function once and authorize it.</li>
              <li>In <strong>Project Settings → Script Properties</strong>, add key <code>WRITE_TOKEN</code> with the same value as <code>VITE_STAFF_PASSPHRASE</code>.</li>
              <li>Click <strong>Deploy → New deployment → Web app</strong>. Execute as: Me. Who has access: Anyone. Copy the URL.</li>
              <li>Set the deployment environment variable <code>VITE_ADMIN_CMS_URL</code> to that URL, then rebuild and deploy the site.</li>
            </ol>
          </details>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
        {/* Export */}
        <button
          onClick={handleExport}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            padding: "20px 24px",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-body)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Download size={20} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>Export Backup</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
            Download a single JSON file with everything you've edited.
            Save it to Google Drive or email it to yourself.
          </div>
        </button>

        {/* Import */}
        <button
          onClick={handleImportClick}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            padding: "20px 24px",
            background: "#fff",
            color: T.softBlack,
            border: `2px solid ${T.burgundy}`,
            borderRadius: 10,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-body)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.cream)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Upload size={20} color={T.burgundy} />
            <span style={{ fontSize: 16, fontWeight: 600, color: T.burgundy }}>Import Backup</span>
          </div>
          <div style={{ fontSize: 13, color: T.warmGray, lineHeight: 1.5 }}>
            Restore a backup file to bring this computer up to date, or
            undo an accidental change.
          </div>
        </button>

        <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleFileChosen} style={{ display: "none" }} />
      </div>

      {/* Import strategy */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${T.stone}`,
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 32,
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: T.warmGray, marginBottom: 10 }}>
          Import behavior
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer" }}>
          <input type="radio" name="strategy" value="replace" checked={strategy === "replace"} onChange={() => setStrategy("replace")} style={{ marginTop: 3, accentColor: T.burgundy }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>Replace everything (recommended)</div>
            <div style={{ fontSize: 12, color: T.warmGray }}>Wipes current admin data, then restores from the backup. Safest if you're moving to a fresh computer.</div>
          </div>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", cursor: "pointer" }}>
          <input type="radio" name="strategy" value="merge" checked={strategy === "merge"} onChange={() => setStrategy("merge")} style={{ marginTop: 3, accentColor: T.burgundy }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>Merge with current data</div>
            <div style={{ fontSize: 12, color: T.warmGray }}>Keeps whatever's already here, overwriting only the sections included in the backup file.</div>
          </div>
        </label>
      </div>

      {/* Last action */}
      {lastAction && (
        <div style={{ fontSize: 13, color: T.warmGray, fontFamily: "var(--font-body)", marginBottom: 24 }}>
          Last {lastAction.kind === "export" ? "exported" : "imported"}: {formatDate(lastAction.at)}
          {lastAction.kind === "import" && lastAction.fromDate && ` (backup from ${formatDate(lastAction.fromDate)})`}
          .
        </div>
      )}

      {/* Help sections */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: T.softBlack, margin: "0 0 16px" }}>
          How it works
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${T.gold}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.icon size={16} color={T.burgundy} />
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600, color: T.softBlack }}>{s.title}</div>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.7, color: T.charcoal, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <details style={{ background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, padding: "14px 18px" }}>
        <summary style={{ cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: T.warmGray, display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCcw size={14} /> Danger zone — start fresh
        </summary>
        <div style={{ marginTop: 14, fontFamily: "var(--font-body)", fontSize: 13, color: T.warmGray, lineHeight: 1.6 }}>
          <p style={{ margin: "0 0 12px" }}>
            Clear every admin-managed section on this computer: announcements,
            bulletins, events, schedule, staff, ministries, and site settings.
            The public site will fall back to the built-in defaults until you
            add new content.
          </p>
          <p style={{ margin: "0 0 14px", color: T.error, fontWeight: 600 }}>
            Export a backup first — this cannot be undone.
          </p>
          <button
            onClick={handleClearAll}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: T.error, color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer" }}
          >
            <AlertTriangle size={14} /> Clear all admin data
          </button>
        </div>
      </details>
    </div>
  );
}
