import { useState, useMemo, useEffect, useCallback } from "react";
import { T } from "../constants/theme";
import { getAll, save, remove, CATEGORIES } from "./store";
import { Plus, Calendar, Search, Trash2 } from "lucide-react";
import EventComposer from "./EventComposer";

const CATEGORY_COLORS = {
  mass: { bg: `${T.burgundy}12`, color: T.burgundy },
  sacrament: { bg: `${T.gold}20`, color: "#92700e" },
  education: { bg: "#e8f0fe", color: "#1a56db" },
  social: { bg: "#e6f9ee", color: "#1a7d42" },
  prayer: { bg: "#f3e8ff", color: "#6b21a8" },
  other: { bg: "#f3f4f6", color: "#6b7280" },
};

function CategoryBadge({ category }) {
  const s = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
  return (
    <span className="chip" style={{ background: s.bg, color: s.color }}>
      {category}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function EventDashboard({ onToast }) {
  const [list, setList] = useState(() => getAll());
  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("dashboard");
  const [editing, setEditing] = useState(null);

  const refresh = useCallback(() => setList(getAll()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const filtered = useMemo(() => {
    let arr = [...list];
    const t = today();
    if (filter === "upcoming") arr = arr.filter((e) => !e.date || e.date >= t);
    else if (filter === "past") arr = arr.filter((e) => e.date && e.date < t);
    else if (filter !== "all") arr = arr.filter((e) => e.category === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
      );
    }
    return arr;
  }, [list, filter, search]);

  const handleSave = (data) => {
    save(data);
    refresh();
    onToast?.({ message: data.id ? "Event updated!" : "Event created!", type: "success" });
    setView("dashboard");
    setEditing(null);
  };

  const handleDelete = (id) => {
    remove(id);
    refresh();
    onToast?.({ message: "Event deleted.", type: "success" });
    setView("dashboard");
    setEditing(null);
  };

  const handleQuickDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this event?")) {
      remove(id);
      refresh();
    }
  };

  if (view === "compose") {
    return (
      <EventComposer
        event={editing}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={() => { setView("dashboard"); setEditing(null); }}
      />
    );
  }

  const FILTERS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "all", label: "All" },
    ...CATEGORIES.map((c) => ({ key: c.value, label: c.label })),
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: T.softBlack, margin: 0 }}>Events</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: T.warmGray, margin: "4px 0 0" }}>
            Events appear on the public Events page and — if upcoming — on the home page. {list.length} total · {list.filter((e) => e.date >= today()).length} upcoming.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setView("compose"); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: T.burgundy, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: `1.5px solid ${filter === f.key ? T.burgundy : T.stone}`,
                background: filter === f.key ? `${T.burgundy}10` : "transparent",
                color: filter === f.key ? T.burgundy : T.warmGray,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.warmGray }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            style={{ width: "100%", padding: "8px 12px 8px 30px", fontSize: 13, fontFamily: "var(--font-body)", border: `1.5px solid ${T.stone}`, borderRadius: 8, outline: "none", boxSizing: "border-box", background: "#fff", color: T.charcoal }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", color: T.warmGray, fontFamily: "var(--font-body)" }}>
          <Calendar size={40} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p style={{ fontSize: 16, margin: "0 0 4px" }}>No events found</p>
          <p style={{ fontSize: 13 }}>Create a new event to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((ev) => (
            <div
              key={ev.id}
              onClick={() => { setEditing(ev); setView("compose"); }}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: "#fff", border: `1px solid ${T.stone}`, borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.stone; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ minWidth: 72, textAlign: "center", padding: "6px 8px", background: T.cream, borderRadius: 8, fontFamily: "var(--font-body)" }}>
                <div style={{ fontSize: 11, color: T.warmGray, textTransform: "uppercase", letterSpacing: 1 }}>
                  {ev.date ? new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" }) : "—"}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.burgundy }}>
                  {ev.date ? new Date(ev.date + "T00:00:00").getDate() : "—"}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <CategoryBadge category={ev.category} />
                  {ev.time && <span style={{ fontSize: 12, color: T.warmGray, fontFamily: "var(--font-body)" }}>{ev.time}</span>}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: T.charcoal, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ev.title || "Untitled"}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: T.warmGray, marginTop: 2 }}>
                  {formatDate(ev.date)}{ev.location ? ` · ${ev.location}` : ""}
                </div>
              </div>
              <button
                onClick={(e) => handleQuickDelete(e, ev.id)}
                title="Delete"
                style={{ background: "none", border: "none", cursor: "pointer", color: T.warmGray, display: "flex", padding: 4 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.error)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.warmGray)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
