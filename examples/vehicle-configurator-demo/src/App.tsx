import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ModelViewer,
  useViewerCamera,
  type ObjectActionEvent,
  type ObjectBinding,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";
import { objectBindings as initialObjectBindings } from "./objectBindings";

const MODEL_URL = "/cartoon_car.glb";

// Plain <style> media queries (no Tailwind/build step in this standalone demo):
// collapses the control panel behind a toggle on phones, so it doesn't cover
// the model, and clamps the header description with a "Read more" toggle.
const RESPONSIVE_CSS = `
  .demo-panel-toggle { display: inline-flex; }
  .demo-readmore { display: inline-block; }
  @media (min-width: 641px) {
    .demo-panel-toggle { display: none !important; }
    .demo-readmore { display: none !important; }
  }
  @media (max-width: 640px) {
    .demo-badges { display: none; }
    .demo-panel--closed { display: none !important; }
    .demo-desc:not(.demo-desc--expanded) {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

const PAINT_GROUP = [
  "body_car_body_0",
  "hood_car_body_0",
  "Plane006_car_body_0",
  "trunk_car_body_0",
];
const WHEEL_GROUP = [
  "front_left_wheel_wheel_0",
  "front_right_wheel_wheel_0",
  "rear_wheels_wheel_0",
];
const TRIM_GROUP = [
  "black_floats_chrome_0",
  "exhaust_chrome_0",
  "mirrors_chrome_0",
  "Plane026_chrome_0",
];
const AERO_GROUP = [
  "front_bumper_carbon_fiber_0",
  "front_fenders_carbon_fiber_0",
  "rear_bumper_carbon_fiber_0",
  "rear_fenders_carbon_fiber_0",
  "side_skirts_carbon_fiber_0",
];
const WINDOW_GROUP = [
  "Plane008_window_0",
  "Plane011_window_0",
  "Plane017_window_0",
  "Plane035_window_0",
];
const HEADLIGHT_KEY = "headlight_glass_headlight_glass_0";

type Group = "paint" | "wheels" | "trim" | "aero" | "windows" | "headlight";

const OBJECT_TO_GROUP: Record<string, Group> = Object.fromEntries([
  ...PAINT_GROUP.map((key) => [key, "paint"] as const),
  ...WHEEL_GROUP.map((key) => [key, "wheels"] as const),
  ...TRIM_GROUP.map((key) => [key, "trim"] as const),
  ...AERO_GROUP.map((key) => [key, "aero"] as const),
  ...WINDOW_GROUP.map((key) => [key, "windows"] as const),
  [HEADLIGHT_KEY, "headlight"] as const,
]);

const PAINT_COLORS = [
  { name: "Racing Red", hex: "#b91c1c" },
  { name: "Deep Blue", hex: "#1d4ed8" },
  { name: "Pearl White", hex: "#f8fafc" },
  { name: "Racing Green", hex: "#065f46" },
  { name: "Stealth Black", hex: "#111827" },
  { name: "Gunmetal", hex: "#4b5563" },
];

const WHEEL_FINISHES = [
  { name: "Gloss Black", hex: "#0a0a0a" },
  { name: "Chrome Silver", hex: "#d1d5db" },
  { name: "Bronze", hex: "#92400e" },
  { name: "Matte Grey", hex: "#6b7280" },
];

const TRIM_FINISHES = [
  { name: "Chrome", hex: "#c7ccd1", metalness: 0.9, roughness: 0.12 },
  { name: "Blackout", hex: "#0f0f10", metalness: 0.35, roughness: 0.5 },
];

const HEADLIGHT_COLORS = [
  { name: "White", hex: "#f8fafc" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Ice Blue", hex: "#7dd3fc" },
];

function DemoHeader() {
  const features = [
    "Grouped material swatches",
    "Built-in action reuse",
    "Aero kit visibility",
    "Headlight emissive toggle",
  ];

  // On phones the description is clamped to two lines with a "Read more"
  // toggle — shown only when the text is actually truncated.
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el || expanded) return;
    const check = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [expanded]);

  return (
    <section style={styles.header}>
      <div style={styles.headerInner}>
        <p style={styles.eyebrow}>React Immersive Example</p>
        <h1 style={styles.title}>Vehicle Configurator</h1>
        <p
          ref={descRef}
          className={`demo-desc${expanded ? " demo-desc--expanded" : ""}`}
          style={styles.description}
        >
          A car model where BindingBuilder-exported object bindings drive a real
          product configurator: grouped paint, wheel, and trim swatches, an
          aero-kit toggle, window tint, and clickable headlights.
        </p>
        {(truncated || expanded) && (
          <button
            type="button"
            className="demo-readmore"
            onClick={() => setExpanded((v) => !v)}
            style={styles.readMoreButton}
          >
            {expanded ? "Read less" : "Read more…"}
          </button>
        )}
        <div className="demo-badges" style={styles.featureList}>
          {features.map((feature) => (
            <span key={feature} style={styles.featureBadge}>
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function patchGroup(
  bindings: Record<string, ObjectBinding>,
  keys: string[],
  patch: (binding: ObjectBinding) => ObjectBinding,
): Record<string, ObjectBinding> {
  const next = { ...bindings };
  for (const key of keys) {
    const binding = next[key];
    if (!binding) continue;
    next[key] = patch(binding);
  }
  return next;
}

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [bindings, setBindings] = useState(() =>
    structuredClone(initialObjectBindings),
  );
  const [selectedLabel, setSelectedLabel] = useState("Cartoon Car");
  const [paintIndex, setPaintIndex] = useState(0);
  const [wheelIndex, setWheelIndex] = useState(0);
  const [trimIndex, setTrimIndex] = useState(0);
  const [aeroInstalled, setAeroInstalled] = useState(true);
  const [windowsDark, setWindowsDark] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [headlightColorIndex, setHeadlightColorIndex] = useState(0);
  // Mobile: the configurator panel starts collapsed so it doesn't cover the car.
  const [controlsOpen, setControlsOpen] = useState(false);

  const { handleViewerReady, setCameraTarget } = useViewerCamera();

  // The car's bounding-box center sits above and slightly forward of the world
  // origin (this asset has no floor-aligned pivot), so the default look-at
  // target of [0, 0, 0] frames it high and off-center. Re-center the orbit
  // target here; the deliberate camera position/fov below is left untouched.
  const handleReady = useCallback(
    (viewer: ViewerReadyState) => {
      handleViewerReady(viewer);
      setCameraTarget([-5.2, 3.5, 1], false);
    },
    [handleViewerReady, setCameraTarget],
  );

  const applyPaint = useCallback((index: number) => {
    const color = PAINT_COLORS[index];
    setPaintIndex(index);
    setBindings((current) =>
      patchGroup(current, PAINT_GROUP, (binding) => ({
        ...binding,
        style: {
          ...binding.style,
          material: { ...binding.style?.material, baseColor: color.hex },
        },
      })),
    );
  }, []);

  const applyWheelFinish = useCallback((index: number) => {
    const finish = WHEEL_FINISHES[index];
    setWheelIndex(index);
    setBindings((current) =>
      patchGroup(current, WHEEL_GROUP, (binding) => ({
        ...binding,
        style: {
          ...binding.style,
          material: { ...binding.style?.material, baseColor: finish.hex },
        },
      })),
    );
  }, []);

  const applyTrimFinish = useCallback((index: number) => {
    const finish = TRIM_FINISHES[index];
    setTrimIndex(index);
    setBindings((current) =>
      patchGroup(current, TRIM_GROUP, (binding) => ({
        ...binding,
        style: {
          ...binding.style,
          material: {
            ...binding.style?.material,
            baseColor: finish.hex,
            metalness: finish.metalness,
            roughness: finish.roughness,
          },
        },
      })),
    );
  }, []);

  const applyAeroVisibility = useCallback((installed: boolean) => {
    setAeroInstalled(installed);
    setBindings((current) =>
      patchGroup(current, AERO_GROUP, (binding) => ({
        ...binding,
        visible: installed,
      })),
    );
  }, []);

  const applyWindowTint = useCallback((dark: boolean) => {
    setWindowsDark(dark);
    setBindings((current) =>
      patchGroup(current, WINDOW_GROUP, (binding) => ({
        ...binding,
        style: {
          ...binding.style,
          material: {
            ...binding.style?.material,
            baseColor: dark ? "#020617" : "#0f172a",
            opacity: dark ? 0.85 : 0.55,
          },
        },
      })),
    );
  }, []);

  const applyHeadlights = useCallback((on: boolean, colorIndex: number) => {
    const color = HEADLIGHT_COLORS[colorIndex];
    setHeadlightsOn(on);
    setHeadlightColorIndex(colorIndex);
    setBindings((current) => {
      const binding = current[HEADLIGHT_KEY];
      if (!binding) return current;
      return {
        ...current,
        [HEADLIGHT_KEY]: {
          ...binding,
          style: {
            ...binding.style,
            material: {
              ...binding.style?.material,
              emissive: on ? color.hex : undefined,
              emissiveIntensity: on ? 2.2 : 0,
            },
          },
        },
      };
    });
  }, []);

  const handleAction = useCallback(
    (event: ObjectActionEvent) => {
      const modelObjectId = event.binding?.modelObjectId ?? event.objectId;
      const group = OBJECT_TO_GROUP[modelObjectId];
      setSelectedLabel(event.binding?.label ?? modelObjectId);

      if (event.action.id === "toggle-visibility") {
        if (group === "aero") {
          applyAeroVisibility(!aeroInstalled);
          return;
        }

        setBindings((current) => {
          const binding = current[modelObjectId];
          if (!binding) return current;
          return {
            ...current,
            [modelObjectId]: { ...binding, visible: !binding.visible },
          };
        });
        return;
      }

      if (
        event.action.id === "change-color" ||
        event.action.id === "change-material"
      ) {
        if (group === "paint")
          applyPaint((paintIndex + 1) % PAINT_COLORS.length);
        if (group === "wheels")
          applyWheelFinish((wheelIndex + 1) % WHEEL_FINISHES.length);
        if (group === "trim")
          applyTrimFinish((trimIndex + 1) % TRIM_FINISHES.length);
        return;
      }

      if (event.action.id === "toggle-light") {
        applyHeadlights(!headlightsOn, headlightColorIndex);
        return;
      }

      if (event.action.id === "change-light-color") {
        applyHeadlights(
          headlightsOn,
          (headlightColorIndex + 1) % HEADLIGHT_COLORS.length,
        );
      }
    },
    [
      aeroInstalled,
      applyAeroVisibility,
      applyHeadlights,
      applyPaint,
      applyTrimFinish,
      applyWheelFinish,
      headlightColorIndex,
      headlightsOn,
      paintIndex,
      trimIndex,
      wheelIndex,
    ],
  );

  return (
    <main style={styles.page}>
      <style>{RESPONSIVE_CSS}</style>
      <DemoHeader />
      {!licenseKey ? (
        <div style={styles.warning}>
          Set <code>VITE_LICENSE_KEY</code> before running this example. Create
          a key at{" "}
          <a
            href="https://react-immersive.liveroom.dev/console"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            react-immersive.liveroom.dev/console
          </a>
          .
        </div>
      ) : null}
      <div style={styles.viewerShell}>
        <div style={styles.viewerWindow}>
          <ModelViewer
            modelUrl={MODEL_URL}
            licenseKey={licenseKey}
            objectBindings={bindings}
            onObjectSelect={(binding) =>
              setSelectedLabel(binding?.label ?? "Cartoon Car")
            }
            onAction={handleAction}
            onViewerReady={handleReady}
            backgroundColor="#07111f"
            camera={{ position: [14, 5, 16], fov: 40 }}
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel
            showResetButton
            showDownloadButton={false}
            showMouseController={false}
            renderMode="always"
            performanceProfile="auto"
            maxDpr={2}
            refitOnResize={false}
          />

          <button
            type="button"
            className="demo-panel-toggle"
            onClick={() => setControlsOpen((v) => !v)}
            style={{
              ...styles.panelToggle,
              ...(controlsOpen ? { left: "auto", right: 16 } : null),
            }}
          >
            {controlsOpen ? "✕" : "☰ Configure"}
          </button>

          <section
            style={styles.panel}
            className={controlsOpen ? "" : "demo-panel--closed"}
          >
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelEyebrow}>Configurator</p>
                <h2 style={styles.panelTitle}>{selectedLabel}</h2>
                <p style={styles.panelCopy}>
                  Click any part in the scene, or use the controls below.
                </p>
              </div>
            </div>

            <PanelSection title="Body Paint">
              <SwatchRow
                options={PAINT_COLORS}
                selectedIndex={paintIndex}
                onSelect={applyPaint}
              />
            </PanelSection>

            <PanelSection title="Wheels">
              <SwatchRow
                options={WHEEL_FINISHES}
                selectedIndex={wheelIndex}
                onSelect={applyWheelFinish}
              />
            </PanelSection>

            <PanelSection title="Trim Finish">
              <div style={styles.buttonRow}>
                {TRIM_FINISHES.map((finish, index) => (
                  <button
                    key={finish.name}
                    type="button"
                    style={
                      index === trimIndex
                        ? styles.buttonPrimary
                        : styles.buttonSecondary
                    }
                    onClick={() => applyTrimFinish(index)}
                  >
                    {finish.name}
                  </button>
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Aero Kit">
              <div style={styles.rowBetween}>
                <p style={styles.smallCopy}>Bumpers, fenders and side skirts</p>
                <span style={styles.statusBadge}>
                  {aeroInstalled ? "Installed" : "Removed"}
                </span>
              </div>
              <button
                type="button"
                style={
                  aeroInstalled
                    ? styles.buttonSecondaryWide
                    : styles.buttonPrimaryWide
                }
                onClick={() => applyAeroVisibility(!aeroInstalled)}
              >
                {aeroInstalled ? "Remove Aero Kit" : "Install Aero Kit"}
              </button>
            </PanelSection>

            <PanelSection title="Window Tint">
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={
                    !windowsDark ? styles.buttonPrimary : styles.buttonSecondary
                  }
                  onClick={() => applyWindowTint(false)}
                >
                  Light Tint
                </button>
                <button
                  type="button"
                  style={
                    windowsDark ? styles.buttonPrimary : styles.buttonSecondary
                  }
                  onClick={() => applyWindowTint(true)}
                >
                  Dark Tint
                </button>
              </div>
            </PanelSection>

            <PanelSection title="Headlights">
              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={
                    headlightsOn ? styles.buttonPrimary : styles.buttonSecondary
                  }
                  onClick={() =>
                    applyHeadlights(!headlightsOn, headlightColorIndex)
                  }
                >
                  {headlightsOn ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  style={
                    headlightsOn
                      ? styles.buttonSecondary
                      : styles.buttonDisabled
                  }
                  disabled={!headlightsOn}
                  onClick={() =>
                    applyHeadlights(
                      headlightsOn,
                      (headlightColorIndex + 1) % HEADLIGHT_COLORS.length,
                    )
                  }
                >
                  {HEADLIGHT_COLORS[headlightColorIndex].name}
                </button>
              </div>
            </PanelSection>
          </section>
        </div>
      </div>
    </main>
  );
}

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function SwatchRow({
  options,
  selectedIndex,
  onSelect,
}: {
  options: { name: string; hex: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div style={styles.swatchRow}>
      {options.map((option, index) => (
        <button
          key={option.name}
          type="button"
          title={option.name}
          aria-label={option.name}
          aria-pressed={index === selectedIndex}
          onClick={() => onSelect(index)}
          style={{
            ...styles.swatch,
            backgroundColor: option.hex,
            borderColor:
              index === selectedIndex ? "#67e8f9" : "rgba(255,255,255,0.22)",
            transform: index === selectedIndex ? "scale(1.08)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100dvh",
    minHeight: "100vh",
    flexDirection: "column",
    overflow: "hidden",
    background: "#020617",
    color: "#f8fafc",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
    background:
      "linear-gradient(135deg, rgba(17,24,39,0.97), rgba(30,41,59,0.94))",
  },
  headerInner: {
    margin: "0 auto",
    maxWidth: 1280,
    padding: "24px 20px 20px",
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.95)",
  },
  title: {
    margin: "12px 0 10px",
    fontSize: 36,
    lineHeight: 1.05,
  },
  description: {
    margin: 0,
    maxWidth: 1000,
    fontSize: 17,
    lineHeight: 1.6,
    color: "rgba(226, 232, 240, 0.92)",
  },
  featureList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  featureBadge: {
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(15, 23, 42, 0.36)",
    padding: "8px 12px",
    fontSize: 12,
  },
  readMoreButton: {
    marginTop: 4,
    border: "none",
    background: "transparent",
    color: "rgba(226, 232, 240, 0.85)",
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
  },
  warning: {
    background: "rgba(245, 158, 11, 0.16)",
    color: "#fef3c7",
    padding: "10px 16px",
    fontSize: 12,
  },
  viewerShell: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    padding: 0,
    background: "#020617",
  },
  viewerWindow: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    height: "100%",
    overflow: "hidden",
    border: "none",
    background: "#0f172a",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
  },
  panel: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 40,
    maxHeight: "calc(100% - 32px)",
    width: "min(340px, calc(100% - 32px))",
    overflowY: "auto",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(7,17,31,0.9)",
    padding: 12,
    color: "#fff",
    backdropFilter: "blur(12px)",
  },
  // Mobile-only toggle (see .demo-panel-toggle in RESPONSIVE_CSS) that reveals
  // the panel above; hidden entirely on desktop.
  panelToggle: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10002,
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(15,23,42,0.9)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
  },
  panelEyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#67e8f9",
  },
  panelTitle: {
    margin: "10px 0 0",
    fontSize: 20,
  },
  panelCopy: {
    margin: "6px 0 0",
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    lineHeight: 1.45,
  },
  section: {
    marginTop: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.035)",
    padding: 10,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.56)",
  },
  swatchRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  swatch: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: 999,
    borderStyle: "solid",
    borderWidth: 2,
    cursor: "pointer",
  },
  buttonRow: {
    display: "flex",
    gap: 8,
  },
  buttonPrimary: {
    flex: 1,
    border: "1px solid rgba(34,197,94,0.6)",
    background: "rgba(34,197,94,0.22)",
    color: "#fff",
    padding: "8px 10px",
    cursor: "pointer",
  },
  buttonPrimaryWide: {
    width: "100%",
    marginTop: 8,
    border: "1px solid rgba(34,197,94,0.6)",
    background: "rgba(34,197,94,0.22)",
    color: "#fff",
    padding: "8px 10px",
    cursor: "pointer",
  },
  buttonSecondary: {
    flex: 1,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "8px 10px",
    cursor: "pointer",
  },
  buttonSecondaryWide: {
    width: "100%",
    marginTop: 8,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "8px 10px",
    cursor: "pointer",
  },
  buttonDisabled: {
    flex: 1,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.35)",
    padding: "8px 10px",
    cursor: "not-allowed",
  },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  smallCopy: {
    margin: 0,
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
  },
  statusBadge: {
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "3px 8px",
    fontSize: 11,
    textTransform: "uppercase",
  },
} satisfies Record<string, CSSProperties>;
