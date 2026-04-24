import { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const orientation = viewport.w > viewport.h ? "Landscape" : "Portrait";
  const deviceGuess = guessDevice(viewport.w, viewport.h);

  const tiles = [
    { label: "Home", icon: "H", tint: "#6366f1" },
    { label: "Search", icon: "S", tint: "#10b981" },
    { label: "Saved", icon: "B", tint: "#f59e0b" },
    { label: "Agents", icon: "A", tint: "#ec4899" },
    { label: "Billing", icon: "$", tint: "#3b82f6" },
    { label: "Settings", icon: "G", tint: "#64748b" },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.statusBar}>
          <span>{formatClock(now)}</span>
          <span style={styles.dots}>
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={styles.dot} />
          </span>
        </div>
        <div style={styles.brand}>
          <img src="/logo.png" alt="logo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>RCRT Preview Smoke</h1>
            <p style={styles.subtitle}>
              Device frame chrome &mdash; resize or swap device in the toolbar
            </p>
          </div>
        </div>
      </header>

      <section style={styles.card}>
        <div style={styles.cardRow}>
          <span style={styles.cardLabel}>Viewport</span>
          <span style={styles.cardValue}>
            {viewport.w} &times; {viewport.h}
          </span>
        </div>
        <div style={styles.cardRow}>
          <span style={styles.cardLabel}>Orientation</span>
          <span style={styles.cardValue}>{orientation}</span>
        </div>
        <div style={styles.cardRow}>
          <span style={styles.cardLabel}>Detected</span>
          <span style={styles.cardValue}>{deviceGuess}</span>
        </div>
      </section>

      <section style={styles.grid}>
        {tiles.map((t) => (
          <button
            key={t.label}
            style={{ ...styles.tile, background: t.tint }}
            onClick={() => setCount((c) => c + 1)}
          >
            <span style={styles.tileIcon}>{t.icon}</span>
            <span style={styles.tileLabel}>{t.label}</span>
          </button>
        ))}
      </section>

      <section style={styles.counterBar}>
        <span style={styles.counterLabel}>Interactions</span>
        <span style={styles.counterValue}>{count}</span>
        <button style={styles.counterBtn} onClick={() => setCount(0)}>
          Reset
        </button>
      </section>

      <section style={styles.logTestBar}>
        <button
          style={styles.logBtn}
          onClick={() => {
            console.log("smoke: console.log fired", { count, viewport });
          }}
        >
          log
        </button>
        <button
          style={styles.logBtn}
          onClick={() => {
            console.warn("smoke: console.warn fired");
          }}
        >
          warn
        </button>
        <button
          style={styles.logBtn}
          onClick={() => {
            console.error("smoke: console.error fired");
          }}
        >
          error
        </button>
        <button
          style={styles.logBtn}
          onClick={() => {
            Promise.reject(new Error("smoke: unhandled rejection"));
          }}
        >
          reject
        </button>
      </section>

      <footer style={styles.footer}>
        <span>HMR live &middot; Vite dev</span>
        <span>{now.toISOString().slice(11, 19)} UTC</span>
      </footer>
    </div>
  );
}

function guessDevice(w, h) {
  const short = Math.min(w, h);
  const long = Math.max(w, h);
  if (short >= 700) return "iPad Mini";
  if (short >= 428 && long >= 926) return "iPhone 15 Pro Max";
  if (short >= 410 && long >= 910) return "Pixel 8";
  if (short >= 390 && long >= 840) return "iPhone 15";
  return `${w}x${h}`;
}

function formatClock(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles = {
  page: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(160deg, #0b1220 0%, #1e1b4b 45%, #312e81 100%)",
    color: "#e2e8f0",
    padding: "env(safe-area-inset-top, 16px) 20px 24px",
    gap: 14,
    overflow: "auto",
  },
  header: { display: "flex", flexDirection: "column", gap: 8 },
  brand: { display: "flex", alignItems: "center", gap: 12, marginTop: 6 },
  logo: {
    width: 44,
    height: 44,
    display: "block",
    filter: "drop-shadow(0 4px 12px rgba(99, 102, 241, 0.45))",
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 12,
    color: "rgba(226, 232, 240, 0.7)",
    letterSpacing: "0.02em",
    fontVariantNumeric: "tabular-nums",
  },
  dots: { display: "inline-flex", gap: 4 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "rgba(226, 232, 240, 0.55)",
  },
  title: {
    margin: "8px 0 0",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  subtitle: { margin: 0, fontSize: 13, color: "rgba(226, 232, 240, 0.65)" },
  card: {
    background: "rgba(15, 23, 42, 0.55)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 16,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    backdropFilter: "blur(10px)",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
  },
  cardLabel: { color: "rgba(226, 232, 240, 0.6)" },
  cardValue: {
    color: "#e2e8f0",
    fontFamily: "SF Mono, ui-monospace, Menlo, Consolas, monospace",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
  },
  tile: {
    aspectRatio: "1 / 1",
    borderRadius: 18,
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
    transition: "transform 0.15s",
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 15,
  },
  tileLabel: { opacity: 0.95 },
  counterBar: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    padding: "10px 14px",
  },
  counterLabel: { fontSize: 13, color: "rgba(226, 232, 240, 0.65)" },
  counterValue: {
    marginLeft: "auto",
    fontFamily: "SF Mono, ui-monospace, Menlo, Consolas, monospace",
    fontSize: 18,
    fontWeight: 700,
    color: "#fbbf24",
  },
  counterBtn: {
    background: "rgba(148, 163, 184, 0.18)",
    color: "#e2e8f0",
    border: "1px solid rgba(148, 163, 184, 0.3)",
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: 12,
    cursor: "pointer",
  },
  logTestBar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 6,
  },
  logBtn: {
    background: "rgba(59, 130, 246, 0.22)",
    color: "#e2e8f0",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    padding: "6px 0",
    borderRadius: 8,
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "SF Mono, ui-monospace, Menlo, Consolas, monospace",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    color: "rgba(226, 232, 240, 0.5)",
    paddingTop: 4,
  },
};
