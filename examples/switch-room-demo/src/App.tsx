import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type {
  ModelViewerProps,
  ObjectActionEvent,
  ObjectBinding,
} from "@liveroom-tech/react-immersive";
import { ModelViewer } from "@liveroom-tech/react-immersive";
import {
  objectBindings as initialObjectBindings,
  type DemoAction,
} from "./objectBindings";

const MODEL_URL = "/switch-room.glb";

// Plain <style> media queries (no Tailwind/build step in this standalone demo):
// collapses the control panel behind a toggle on phones, so it doesn't cover
// the room, and clamps the header description with a "Read more" toggle.
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

const SWITCHES = [
  {
    id: "switch_a",
    label: "Switch A",
    color: "#22c55e",
    lights: ["light_a_1", "light_a_2"],
  },
  {
    id: "switch_b",
    label: "Switch B",
    color: "#f97316",
    lights: ["light_b_1", "light_b_2"],
  },
];

const LIGHT_POSITIONS: Record<string, [number, number, number]> = {
  light_a_1: [-2.45, 2.05, -2.04],
  light_a_2: [-0.9, 2.05, -2.04],
  light_b_1: [0.9, 2.05, -2.04],
  light_b_2: [2.45, 2.05, -2.04],
};

function DemoHeader() {
  const features = [
    "Exported objectBindings",
    "Switch action effects",
    "Stateful light materials",
    "Reactive scene lighting",
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
        <h1 style={styles.title}>Switch Room Demo</h1>
        <p
          ref={descRef}
          className={`demo-desc${expanded ? " demo-desc--expanded" : ""}`}
          style={styles.description}
        >
          Two switches control four lights. The switch actions patch the
          relevant light bindings, and the scene lighting responds to the same
          state.
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

function applyBindingPatch(
  target: ObjectBinding,
  patch: Partial<ObjectBinding>,
): ObjectBinding {
  return {
    ...target,
    ...patch,
    style: {
      ...target.style,
      ...patch.style,
      material: {
        ...target.style?.material,
        ...patch.style?.material,
      },
    },
    metadata: {
      ...target.metadata,
      ...patch.metadata,
    },
  };
}

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [objectBindings, setObjectBindings] = useState(() =>
    structuredClone(initialObjectBindings),
  );
  const [selectedLabel, setSelectedLabel] = useState("Switch A");
  // Mobile: the switches panel starts collapsed so it doesn't cover the room.
  const [controlsOpen, setControlsOpen] = useState(false);

  const applyAction = useCallback((switchId: string, action: DemoAction) => {
    setObjectBindings((current) => {
      const next = { ...current };
      const switchConfig = SWITCHES.find((item) => item.id === switchId);
      const switchIsOn = action.id.includes("turn-on");

      if (switchConfig && next[switchId]) {
        next[switchId] = applyBindingPatch(next[switchId], {
          style: {
            material: {
              baseColor: switchIsOn ? switchConfig.color : "#334155",
              emissive: switchIsOn ? switchConfig.color : undefined,
              emissiveIntensity: switchIsOn ? 1.2 : 0,
            },
          },
          metadata: { state: switchIsOn ? "on" : "off" },
        });
      }

      for (const effect of action.effects ?? []) {
        const target = next[effect.targetObjectId];
        if (!target) continue;
        next[effect.targetObjectId] = applyBindingPatch(target, effect.patch);
      }

      return next;
    });
  }, []);

  const handleAction = useCallback(
    (event: ObjectActionEvent) => {
      const action = event.action as DemoAction;
      const switchId = event.binding?.modelObjectId ?? event.objectId;

      applyAction(switchId, action);
      setSelectedLabel(event.binding?.label ?? switchId);
    },
    [applyAction],
  );

  const lightsOn = ["light_a_1", "light_a_2", "light_b_1", "light_b_2"].filter(
    (lightId) => objectBindings[lightId]?.metadata?.state === "on",
  ).length;
  const ambientIntensity = lightsOn === 0 ? 0.035 : 0.16 + lightsOn * 0.045;
  const keyLightIntensity = lightsOn === 0 ? 0.04 : 0.25 + lightsOn * 0.08;
  const sceneLights: ModelViewerProps["lights"] = (
    <>
      <ambientLight color="#dbeafe" intensity={ambientIntensity} />
      <directionalLight
        color="#f8fafc"
        intensity={keyLightIntensity}
        position={[3, 5, 4]}
      />
      {Object.entries(LIGHT_POSITIONS).map(([lightId, position]) =>
        objectBindings[lightId]?.metadata?.state === "on" ? (
          <pointLight
            key={lightId}
            color="#fde68a"
            distance={4}
            intensity={1.8}
            position={position}
          />
        ) : null,
      )}
    </>
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
            objectBindings={objectBindings as Record<string, ObjectBinding>}
            lights={sceneLights}
            onAction={handleAction}
            onObjectSelect={(binding) => {
              setSelectedLabel(binding?.label ?? "Room");
            }}
            backgroundColor="#07111f"
            camera={{ position: [8, 6, 8], fov: 48 }}
            shadows={false}
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
            {controlsOpen ? "✕" : "☰ Switches"}
          </button>

          <section
            style={styles.panel}
            className={controlsOpen ? "" : "demo-panel--closed"}
          >
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelEyebrow}>Object Binding Circuit</p>
                <h2 style={styles.panelTitle}>{selectedLabel}</h2>
                <p style={styles.panelCopy}>
                  The exported binding object is passed to ModelViewer as state.
                </p>
              </div>
              <span style={styles.counter}>{lightsOn}/4 on</span>
            </div>

            <div style={styles.metrics}>
              <Metric
                label="Switches"
                value={`${SWITCHES.filter((item) => objectBindings[item.id]?.metadata?.state === "on").length}/2 on`}
              />
              <Metric label="Lights" value={`${lightsOn}/4 on`} />
              <Metric label="Scene" value={lightsOn > 0 ? "Bright" : "Dark"} />
            </div>

            <div style={styles.switchList}>
              {SWITCHES.map((switchConfig) => {
                const switchBinding = objectBindings[switchConfig.id];
                const isOn = switchBinding?.metadata?.state === "on";
                const action = switchBinding?.actions?.find((item) =>
                  item.id.includes(isOn ? "turn-off" : "turn-on"),
                );

                return (
                  <div key={switchConfig.id} style={styles.switchCard}>
                    <div style={styles.switchHeader}>
                      <div>
                        <strong>{switchConfig.label}</strong>
                        <p style={styles.switchCopy}>
                          Controls {switchConfig.lights.join(" + ")}
                        </p>
                      </div>
                      <span style={styles.status}>{isOn ? "On" : "Off"}</span>
                    </div>
                    <button
                      type="button"
                      style={styles.button}
                      disabled={!action}
                      onClick={() =>
                        action && applyAction(switchConfig.id, action)
                      }
                    >
                      {isOn ? "Turn Off" : "Turn On"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.metric}>
      <span style={styles.metricLabel}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    background: "#020617",
    color: "#f8fafc",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
    background:
      "linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.94))",
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
    color: "#facc15",
  },
  title: {
    margin: "12px 0 10px",
    fontSize: 36,
    lineHeight: 1.05,
  },
  description: {
    margin: 0,
    maxWidth: 980,
    fontSize: 17,
    lineHeight: 1.6,
    color: "rgba(226,232,240,0.9)",
  },
  featureList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  featureBadge: {
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(15, 23, 42, 0.6)",
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
    flex: 1,
    minHeight: 0,
    padding: 20,
  },
  viewerWindow: {
    position: "relative",
    height: "100%",
    minHeight: 620,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 24,
    background: "#07111f",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.6)",
  },
  panel: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 40,
    width: "min(300px, calc(100% - 32px))",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    background: "rgba(7, 17, 31, 0.92)",
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  panelEyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#fde68a",
  },
  panelTitle: {
    margin: "10px 0 0",
    fontSize: 21,
  },
  panelCopy: {
    margin: "6px 0 0",
    fontSize: 11,
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.58)",
  },
  counter: {
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "8px 10px",
    fontSize: 12,
    textTransform: "uppercase",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginTop: 12,
  },
  metric: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    padding: 10,
  },
  metricLabel: {
    display: "block",
    marginBottom: 6,
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  switchList: {
    display: "grid",
    gap: 10,
    marginTop: 12,
  },
  switchCard: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  },
  switchHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  switchCopy: {
    margin: "4px 0 0",
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
  },
  status: {
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "4px 8px",
    height: 20,
    fontSize: 11,
    textTransform: "uppercase",
  },
  button: {
    width: "100%",
    marginTop: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    padding: "9px 10px",
    cursor: "pointer",
  },
} satisfies Record<string, CSSProperties>;
