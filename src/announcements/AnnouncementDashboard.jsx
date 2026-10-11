import { useState, useMemo } from "react";
import { T } from "../constants/theme";
import { useAllAnnouncements } from "./useAnnouncements";
import { getStatus, describeRecurrence, save, remove, reorder } from "./store";
import {
  Plus,
  Megaphone,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Search,
  Trash2,
} from "lucide-react";

/* ── Styles ── */

const FILTERS = [
  { key: "all", label: "All" },
  { key: "banner", label: "Banners" },
  { key: "popup", label: "Popups" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const STATUS_COLORS = {
  live: { bg: "#e6f9ee", color: "#1a7d42", label: "Live" },
  scheduled: { bg: "#e8f0fe", color: "#1a56db", label: "Scheduled" },
  expired: { bg: "#f3f4f6", color: "#6b7280", label: "Expired" },
  inactive: { bg: "#fef3cd", color: "#92400e", label: "Inactive" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.inactive;
  return (
    <span className="chip" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const isBanner = type === "banner";
  return (
    <span
      className="chip"
      style={{
        background: isBanner ? `${T.gold}20` : `${T.burgundy}12`,
        color: isBanner ? "#92700e" : T.burgundy,
      }}
    >
      {isBanner ? <Megaphone size={11} /> : <MessageSquare size={11} />}
      {type}
    </span>
  );
}

function formatDateRange(start, end) {
  const fmt = (s) => {
    if (!s) return "—";
    const d = new Date(s + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  return `${fmt(start)} → ${fmt(end)}`;
}

export default function AnnouncementDashboard({ onEdit, onNew }) {
  const { announcements, refresh } = useAllAnnouncements();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...announcements];

    // Filter
    if (filter === "banner") list = list.filter((a) => a.type === "banner");
    else if (filter === "popup") list = list.filter((a) => a.type === "popup");
    else if (filter === "active") list = list.filter((a) => a.active);
    else if (filter === "inactive") list = list.filter((a) => !a.active);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.body?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }, [announcements, filter, search]);

  const handleToggleActive = (ann) => {
    save({ ...ann, active: !ann.active });
    refresh();
  };

  const handleMove = (idx, direction) => {
    const ids = filtered.map((a) => a.id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= ids.length) return;
    [ids[idx], ids[targetIdx]] = [ids[targetIdx], ids[idx]];
    reorder(ids);
    refresh();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this announcement permanently?")) {
      remove(id);
      refresh();
    }
  };

  const counts = useMemo(() => {
    const live = announcements.filter((a) => getStatus(a) === "live").length;
    const total = announcements.length;
    return { live, total };
  }, [announcements]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 600,
              color: T.softBlack,
              margin: 0,
            }}
          >
            Announcements
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: T.warmGray,
              margin: "4px 0 0",
            }}
          >
            Site-wide notices. <strong>Banners</strong> are a thin strip at the top of every page; <strong>popups</strong> appear as a modal card when a visitor first lands. Both can be scheduled and restricted to specific days.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: T.warmGray,
              margin: "6px 0 0",
            }}
          >
            {counts.total} total · {counts.live} live now
          </p>
        </div>

        <button
          onClick={onNew}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: T.burgundy,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.burgundyDark)}
          onMouseLeave={(e) => (e.currentTarget.style.background = T.burgundy)}
        >
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {/* Filter tabs + search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
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
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: 200 }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.warmGray,
            }}
          />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 30px",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              border: `1.5px solid ${T.stone}`,
              borderRadius: 8,
              outline: "none",
              boxSizing: "border-box",
              background: "#fff",
              color: T.charcoal,
            }}
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: T.warmGray,
            fontFamily: "var(--font-body)",
          }}
        >
          <Megaphone
            size={40}
            style={{ opacity: 0.3, marginBottom: 16 }}
          />
          <p style={{ fontSize: 16, margin: "0 0 4px" }}>No announcements yet</p>
          <p style={{ fontSize: 13 }}>
            Create your first banner or popup to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((ann, idx) => {
            const status = getStatus(ann);
            return (
              <div
                key={ann.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  background: "#fff",
                  border: `1px solid ${T.stone}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onClick={() => onEdit(ann)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.gold;
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.stone;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Priority arrows */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 2,
                      cursor: idx === 0 ? "default" : "pointer",
                      color: idx === 0 ? T.stoneLight : T.warmGray,
                    }}
                    aria-label="Move up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === filtered.length - 1}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 2,
                      cursor: idx === filtered.length - 1 ? "default" : "pointer",
                      color: idx === filtered.length - 1 ? T.stoneLight : T.warmGray,
                    }}
                    aria-label="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <TypeBadge type={ann.type} />
                    <StatusBadge status={status} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: T.charcoal,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ann.title || "Untitled"}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: T.warmGray,
                      marginTop: 2,
                    }}
                  >
                    {formatDateRange(ann.startDate, ann.endDate)} ·{" "}
                    {describeRecurrence(ann.recurrence)}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleToggleActive(ann)}
                    title={ann.active ? "Deactivate" : "Activate"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: ann.active ? "#1a7d42" : T.warmGray,
                      display: "flex",
                      padding: 4,
                    }}
                  >
                    {ann.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    title="Delete"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: T.warmGray,
                      display: "flex",
                      padding: 4,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = T.error)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = T.warmGray)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
