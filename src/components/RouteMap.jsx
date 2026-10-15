import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TILE = 256;
// OpenStreetMap's own map tiles (softened in CSS to suit the page)
const tileUrl = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

// Web Mercator: degrees to world pixels at zoom z
const project = ([lat, lon], z) => {
  const s = TILE * 2 ** z;
  const r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * s, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * s];
};

/**
 * RouteMap — a map centred on the church with the driving route to it from
 * each of several nearby places drawn on top, so it is plain how close it is.
 * The routes draw themselves in when the map scrolls into view; pointing at
 * (or choosing) a place in the list or on the map brings its route forward.
 *
 * It is a still map (no dragging or zooming), sized to fit every route:
 * OpenStreetMap tiles laid out by hand with the routes as an SVG over them.
 *
 * Props:
 *   church — { name, address, city, at: [lat, lon] }
 *   marker — small square picture marking the church (its front)
 *   routes — [{ id, name, at, minutes, miles, path: [[lat, lon], …] }]
 *   photos — optional { [id]: photo }: a picture of the place behind its card
 *   town   — (id) => the town's name, for the labels
 *   mapsHref — directions link for the church
 */
export default function RouteMap({ church, routes, town, mapsHref, photos = {}, marker }) {
  const { t } = useTranslation();
  const boxRef = useRef(null);
  const [size, setSize] = useState(null);
  const [active, setActive] = useState(null);
  const [drawn, setDrawn] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return undefined;
    const measure = () => setSize({ w: box.clientWidth, h: box.clientHeight });
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(box);
    return () => ro?.disconnect();
  }, []);

  // Draw the routes in once the map is on screen
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setDrawn(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(box);
    return () => io.disconnect();
  }, []);

  let view = null;
  if (size?.w) {
    // The closest (fractional) zoom at which every route and label fits,
    // centred on them; tiles come from the whole zoom level below, scaled up
    const pts = [church.at, ...routes.flatMap((r) => r.path)];
    const pad = { x: size.w < 500 ? 62 : 80, top: 48, bottom: 40 };
    const base = pts.map((p) => project(p, 0));
    const span = (k) => Math.max(...base.map((p) => p[k])) - Math.min(...base.map((p) => p[k]));
    const z = Math.min(15, Math.log2(Math.min((size.w - 2 * pad.x) / span(0), (size.h - pad.top - pad.bottom) / span(1))));
    const zi = Math.floor(z);
    const T = TILE * 2 ** (z - zi);
    const px = pts.map((p) => project(p, z));
    const xs = px.map((p) => p[0]);
    const ys = px.map((p) => p[1]);
    const ox = (Math.min(...xs) + Math.max(...xs)) / 2 - size.w / 2;
    const oy = (Math.min(...ys) + Math.max(...ys)) / 2 - size.h / 2 + (pad.top - pad.bottom) / 2;
    const at = (p) => {
      const [x, y] = project(p, z);
      return [x - ox, y - oy];
    };
    const tiles = [];
    for (let tx = Math.floor(ox / T); tx <= Math.floor((ox + size.w) / T); tx++) {
      for (let ty = Math.floor(oy / T); ty <= Math.floor((oy + size.h) / T); ty++) {
        tiles.push({ key: `${zi}-${tx}-${ty}`, src: tileUrl(zi, tx, ty), left: tx * T - ox, top: ty * T - oy, size: T });
      }
    }
    view = { at, tiles };
  }

  const ordered = active ? [...routes.filter((r) => r.id !== active), ...routes.filter((r) => r.id === active)] : routes;

  return (
    <div className="route-map">
      <div ref={boxRef} className={`route-map__map${drawn ? " is-drawn" : ""}`} role="img" aria-label={t("visit.map.label")}>
        {view && (
          <>
            {view.tiles.map((tile) => (
              <img
                key={tile.key}
                src={tile.src}
                alt=""
                loading="lazy"
                className="route-map__tile"
                style={{ left: tile.left, top: tile.top, width: tile.size + 0.5, height: tile.size + 0.5 }}
              />
            ))}
            <svg className="route-map__overlay" width={size.w} height={size.h} aria-hidden="true">
              {ordered.map((r, i) => {
                const d = r.path.map((p, k) => `${k ? "L" : "M"}${view.at(p).map((v) => v.toFixed(1)).join(" ")}`).join("");
                const on = active === r.id;
                return (
                  <g key={r.id} className={`route-map__route${on ? " is-active" : ""}${active && !on ? " is-dim" : ""}`} style={{ "--i": i }}>
                    <path d={d} pathLength="1" className="route-map__casing" />
                    <path d={d} pathLength="1" className="route-map__line" />
                  </g>
                );
              })}
              {routes.map((r) => {
                const [x, y] = view.at(r.at);
                // Labels go toward the middle, so they never run off the edge
                const right = x > size.w / 2;
                const on = active === r.id;
                return (
                  <g
                    key={r.id}
                    className={`route-map__place${on ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(r.id)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => setActive(on ? null : r.id)}
                  >
                    <circle cx={x} cy={y} r="6" />
                    <text x={x + (right ? -10 : 10)} y={y - 9} textAnchor={right ? "end" : "start"}>
                      {town(r.id)}
                    </text>
                    <text x={x + (right ? -10 : 10)} y={y + 7} textAnchor={right ? "end" : "start"} className="route-map__time">
                      {t("visit.map.minutes", { count: r.minutes })}
                    </text>
                  </g>
                );
              })}
              {(() => {
                const [x, y] = view.at(church.at);
                return (
                  // The church's front marks it; pointing at it shows the address
                  <g
                    className={`route-map__church${showAddress ? " is-open" : ""}`}
                    onMouseEnter={() => setShowAddress(true)}
                    onMouseLeave={() => setShowAddress(false)}
                    onClick={() => setShowAddress((v) => !v)}
                  >
                    <defs>
                      <clipPath id="route-map-church-clip">
                        <circle cx={x} cy={y} r="20" />
                      </clipPath>
                    </defs>
                    <circle cx={x} cy={y} r="26" className="route-map__pulse" />
                    <circle cx={x} cy={y} r="22" className="route-map__badge" />
                    <image href={marker} x={x - 20} y={y - 20} width="40" height="40" clipPath="url(#route-map-church-clip)" preserveAspectRatio="xMidYMid slice" />
                    <text x={x} y={y - 30} textAnchor="middle">St. Dominic</text>
                    <g className="route-map__address" transform={`translate(${x}, ${y + 30})`}>
                      <rect x="-92" y="0" width="184" height="42" rx="4" />
                      <text y="17" textAnchor="middle">{church.address}</text>
                      <text y="33" textAnchor="middle" className="route-map__address-city">{church.city}</text>
                    </g>
                  </g>
                );
              })()}
            </svg>
          </>
        )}
        <div className="route-map__credit">
          ©{" "}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            OpenStreetMap contributors
          </a>
        </div>
      </div>

      <ul className="route-map__list">
        {routes.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              className={`${active === r.id ? "is-active" : ""}${photos[r.id] ? " has-photo" : ""}`}
              style={photos[r.id] ? { "--card-photo": `url("${photos[r.id]}")` } : undefined}
              onMouseEnter={() => setActive(r.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === r.id ? null : r.id)}
              aria-pressed={active === r.id}
            >
              <strong>{town(r.id)}</strong>
              <span>{r.name}</span>
              <em>
                {t("visit.map.minutes", { count: r.minutes })} · {t("visit.map.miles", { count: r.miles })}
              </em>
            </button>
          </li>
        ))}
      </ul>
      <p className="route-map__note">
        {t("visit.map.note")}{" "}
        <a href={mapsHref} target="_blank" rel="noopener noreferrer">
          {t("visit.map.directions")}
        </a>
      </p>
    </div>
  );
}
