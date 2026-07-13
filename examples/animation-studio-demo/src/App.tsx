import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ModelViewer,
  useViewerAnimations,
  useViewerCamera,
  type ObjectBinding,
  type SceneConfig,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";
import { sceneConfig as baseSceneConfig } from "./sceneConfig";
import { DemoPageHeader } from "./DemoLayout";

const MODEL_URL = "/deer.glb";

// Plain <style> media queries (no Tailwind/build step in this standalone demo):
// collapses the playback panel behind a toggle on phones, so it doesn't cover
// the deer, and clamps the header description with a "Read more" toggle.
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

// The demo has no per-object interactions — the deer just animates — so the
// required objectBindings prop is an empty record. The full GLB scene still
// renders; bindings only add per-mesh selection/overrides, which we don't need.
const EMPTY_BINDINGS: Record<string, ObjectBinding> = {};

const SPEED_PRESETS = [0.25, 0.5, 1, 2] as const;

function prettifyClip(sourceName: string): string {
  // Blender exports clip names like "Deer|Deer_WalkFast_F"; take the last
  // segment, drop a leading armature prefix, and space out the rest.
  const tail = sourceName.split("|").pop() ?? sourceName;
  return (
    tail
      .replace(/^Deer_/, "")
      .replace(/_/g, " ")
      .trim() || sourceName
  );
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0.0s";
  return `${seconds.toFixed(1)}s`;
}

function DemoHeader() {
  const features = [
    "Clip picker",
    "Play / pause / stop",
    "Scrubbable timeline",
    "Live playback position",
    "Speed control",
    "Loop-mode toggle",
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
        <h1 style={styles.title}>Animation Studio</h1>
        <p
          ref={descRef}
          className={`demo-desc${expanded ? " demo-desc--expanded" : ""}`}
          style={styles.description}
        >
          A rigged, animated GLB driven entirely by{" "}
          <code>useViewerAnimations</code>: pick a clip, play/pause, stop, scrub
          the timeline, change playback speed, and toggle looping. Playback runs
          on the built-in mixer — the panel is just React state wired to the
          hook.
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

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(() =>
    structuredClone(baseSceneConfig),
  );
  // Mobile: the playback panel starts collapsed so it doesn't cover the deer.
  const [controlsOpen, setControlsOpen] = useState(false);

  const {
    clips,
    clipDetails,
    currentClip,
    isPlaying,
    speed,
    time,
    duration,
    play,
    pause,
    stop,
    setSpeed,
    seek,
    handleAnimationsReady,
  } = useViewerAnimations();

  const { handleViewerReady, setCameraTarget } = useViewerCamera();

  // The deer stands ~1.8 units tall with its feet near the ground plane, so the
  // default look-at target of [0, 0, 0] frames it high. Aim at mid-body instead.
  const handleReady = useCallback(
    (viewer: ViewerReadyState) => {
      handleViewerReady(viewer);
      setCameraTarget([0, 0.85, 0], false);
    },
    [handleViewerReady, setCameraTarget],
  );

  const labelFor = useCallback(
    (sourceName: string) => {
      const configured = sceneConfig.animations.clips.find(
        (clip) => clip.sourceName === sourceName,
      );
      return configured?.displayName || prettifyClip(sourceName);
    },
    [sceneConfig.animations.clips],
  );

  const durationFor = useMemo(() => {
    const map = new Map<string, number>();
    for (const detail of clipDetails)
      map.set(detail.sourceName, detail.duration);
    return map;
  }, [clipDetails]);

  const loopRepeat = sceneConfig.animations.clips.every(
    (clip) => clip.loopMode === "repeat",
  );

  // Speed and loop are driven through sceneConfig.animations. ModelViewer
  // re-applies clip config (speed + loop) to the active clip whenever that
  // object changes, so both survive switching between clips — unlike a one-off
  // imperative call that a later clip change would reset.
  const applyClipConfig = useCallback(
    (patch: (clip: SceneConfig["animations"]["clips"][number]) => void) => {
      setSceneConfig((current) => {
        const next = structuredClone(current);
        next.animations.clips.forEach(patch);
        return next;
      });
    },
    [],
  );

  const changeSpeed = useCallback(
    (value: number) => {
      setSpeed(value);
      applyClipConfig((clip) => {
        clip.speed = value;
      });
    },
    [applyClipConfig, setSpeed],
  );

  const toggleLoop = useCallback(() => {
    applyClipConfig((clip) => {
      clip.loopMode = loopRepeat ? "once" : "repeat";
    });
  }, [applyClipConfig, loopRepeat]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play(currentClip ?? clips[0]);
    }
  }, [clips, currentClip, isPlaying, pause, play]);

  const hasClips = clips.length > 0;

  return (
    <main className="demo-page" style={styles.page}>
      <style>{RESPONSIVE_CSS}</style>
      <DemoPageHeader
        title="Animation Studio"
        description="A rigged, animated GLB driven entirely by useViewerAnimations: pick a clip, play/pause, stop, scrub the timeline, change playback speed, and toggle looping. Playback runs on the built-in mixer — the panel is just React state wired to the hook."
        features={[
          "Clip picker",
          "Play / pause / stop",
          "Scrubbable timeline",
          "Live playback position",
          "Speed control",
          "Loop-mode toggle",
        ]}
      />
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
      <div className="demo-viewer-shell" style={styles.viewerShell}>
        <div className="demo-viewer-frame" style={styles.viewerWindow}>
          <ModelViewer
            modelUrl={MODEL_URL}
            licenseKey={licenseKey}
            objectBindings={EMPTY_BINDINGS}
            sceneConfig={sceneConfig}
            onAnimationsReady={handleAnimationsReady}
            onViewerReady={handleReady}
            backgroundColor="#0b0f14"
            camera={{ position: [2.6, 1.3, 3.6], fov: 40 }}
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showResetButton
            showDownloadButton={false}
            showMouseController={false}
            renderMode="demand"
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
            {controlsOpen ? "✕" : "☰ Playback"}
          </button>

          <section
            style={styles.panel}
            className={controlsOpen ? "" : "demo-panel--closed"}
          >
            <div style={styles.panelHeader}>
              <div>
                <p style={styles.panelEyebrow}>Animation Studio</p>
                <h2 style={styles.panelTitle}>
                  {currentClip ? labelFor(currentClip) : "No clip"}
                </h2>
              </div>
              <span style={styles.statusBadge}>
                {isPlaying ? "Playing" : "Paused"}
              </span>
            </div>

            {/* Clip picker */}
            <PanelSection title="Clips">
              {hasClips ? (
                <div style={styles.clipList}>
                  {clips.map((clip) => {
                    const active = clip === currentClip;
                    const clipDuration = durationFor.get(clip);
                    return (
                      <button
                        key={clip}
                        type="button"
                        style={
                          active ? styles.clipButtonActive : styles.clipButton
                        }
                        onClick={() => play(clip)}
                      >
                        <span>{labelFor(clip)}</span>
                        {clipDuration != null ? (
                          <span style={styles.clipDuration}>
                            {formatTime(clipDuration)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p style={styles.smallCopy}>Loading animations…</p>
              )}
            </PanelSection>

            {/* Transport */}
            <div style={styles.buttonRow}>
              <button
                type="button"
                style={hasClips ? styles.buttonPrimary : styles.buttonDisabled}
                disabled={!hasClips}
                onClick={togglePlay}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                style={
                  hasClips && currentClip
                    ? styles.buttonSecondary
                    : styles.buttonDisabled
                }
                disabled={!hasClips || !currentClip}
                onClick={() => stop()}
              >
                Stop
              </button>
            </div>

            {/* Timeline scrubber */}
            <PanelSection
              title="Timeline"
              trailing={
                <span style={styles.mono}>
                  {formatTime(time)} / {formatTime(duration)}
                </span>
              }
            >
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.01}
                value={time}
                disabled={!currentClip}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Scrub timeline"
                style={styles.range}
              />
            </PanelSection>

            {/* Speed */}
            <PanelSection title="Speed">
              <div style={styles.buttonRow}>
                {SPEED_PRESETS.map((preset) => {
                  const active = Math.abs(speed - preset) < 0.001;
                  return (
                    <button
                      key={preset}
                      type="button"
                      style={
                        !hasClips
                          ? styles.buttonDisabled
                          : active
                            ? styles.buttonPrimary
                            : styles.buttonSecondary
                      }
                      disabled={!hasClips}
                      onClick={() => changeSpeed(preset)}
                    >
                      {preset}×
                    </button>
                  );
                })}
              </div>
            </PanelSection>

            {/* Loop mode */}
            <PanelSection
              title="Loop"
              trailing={
                <span style={styles.statusBadge}>
                  {loopRepeat ? "Repeat" : "Play once"}
                </span>
              }
            >
              <button
                type="button"
                style={
                  !hasClips
                    ? styles.buttonDisabledWide
                    : loopRepeat
                      ? styles.buttonPrimaryWide
                      : styles.buttonSecondaryWide
                }
                disabled={!hasClips}
                onClick={toggleLoop}
              >
                {loopRepeat
                  ? "Looping — play once instead"
                  : "Once — loop instead"}
              </button>
            </PanelSection>
          </section>

          <div style={styles.credit}>
            &quot;DEER - Realistic 3D Model (DEMO FREE)&quot; (
            <a
              href="https://skfb.ly/pLnZv"
              target="_blank"
              rel="noreferrer"
              style={styles.creditLink}
            >
              https://skfb.ly/pLnZv
            </a>
            ) by WildMesh 3D is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              style={styles.creditLink}
            >
              CC-BY 4.0
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function PanelSection({
  title,
  trailing,
  children,
}: {
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>{title}</span>
        {trailing}
      </div>
      {children}
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
    background: "#0b0f14",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
  },
  panel: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10001,
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
    color: "#67e8f9",
  },
  panelTitle: {
    margin: "10px 0 0",
    fontSize: 18,
  },
  section: {
    marginTop: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.035)",
    padding: 10,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.56)",
  },
  clipList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  clipButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.7)",
    padding: "8px 10px",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "left",
  },
  clipButtonActive: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
    border: "1px solid rgba(103,232,249,0.4)",
    background: "rgba(103,232,249,0.1)",
    color: "#fff",
    padding: "8px 10px",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "left",
  },
  clipDuration: {
    flexShrink: 0,
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
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
  buttonDisabledWide: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.35)",
    padding: "8px 10px",
    cursor: "not-allowed",
  },
  statusBadge: {
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "3px 8px",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
  smallCopy: {
    margin: 0,
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },
  mono: {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },
  range: {
    width: "100%",
    accentColor: "#22d3ee",
  },
  credit: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
  },
  creditLink: {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
} satisfies Record<string, CSSProperties>;
