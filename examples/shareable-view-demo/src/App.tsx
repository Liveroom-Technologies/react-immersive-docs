import { useCallback, useEffect, useRef, useState } from "react";
import {
  ModelViewer,
  useShareableViewerState,
  useViewerCamera,
  useViewerSelection,
  type ObjectBinding,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";

const MODEL_URL =
  "https://pub-231330919f51417f9bc6a239010def9a.r2.dev/red-room/red_room.glb";
import initialBindings from "./objectBindings.json";

// Plain <style> media queries (no Tailwind/build step in this standalone demo):
// collapses the controls panel behind a toggle on phones, so it doesn't cover
// the model, and clamps the header description with a "Read more" toggle.
const RESPONSIVE_CSS = `
  .demo-panel-toggle { display: inline-flex; }
  .demo-readmore { display: inline-block; }
  @media (min-width: 641px) {
    .demo-panel-toggle { display: none !important; }
    .demo-readmore { display: none !important; }
  }
  @media (max-width: 640px) {
    .demo-panel--closed { display: none !important; }
    .demo-desc:not(.demo-desc--expanded) {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

const panelStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 20,
  top: 16,
  left: 16,
  width: "min(340px, calc(100% - 32px))",
  padding: 16,
  color: "#f8fafc",
  background: "rgba(15, 23, 42, 0.92)",
  border: "1px solid rgba(148, 163, 184, 0.28)",
  boxShadow: "0 18px 48px rgba(2, 6, 23, 0.5)",
};

const panelToggleStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 21,
  top: 16,
  left: 16,
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
};

const readMoreButtonStyle: React.CSSProperties = {
  marginTop: 4,
  border: "none",
  background: "transparent",
  color: "rgba(226, 232, 240, 0.85)",
  fontSize: 12,
  fontWeight: 700,
  textDecoration: "underline",
  cursor: "pointer",
  padding: 0,
};

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [objectBindings, setObjectBindings] =
    useState<Record<string, ObjectBinding>>(initialBindings);
  // Mobile: the controls panel starts collapsed so it doesn't cover the model.
  const [controlsOpen, setControlsOpen] = useState(false);
  // On phones the description is clamped to two lines with a "Read more"
  // toggle — shown only when the text is actually truncated.
  const [descExpanded, setDescExpanded] = useState(false);
  const [descTruncated, setDescTruncated] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el || descExpanded) return;
    const check = () => setDescTruncated(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [descExpanded]);
  const {
    cameraState,
    focusObject,
    handleCameraChange,
    handleViewerReady,
    setCameraState,
  } = useViewerCamera();
  const {
    selectedObjectBinding,
    setSelectedObjectBinding,
    handleObjectSelect,
  } = useViewerSelection();
  const { getShareUrl, restoreFromUrl } = useShareableViewerState({
    cameraState,
    setCameraState,
    objectBindings,
    onObjectBindingsChange: setObjectBindings,
    selectedObjectBinding,
    setSelectedObjectBinding,
  });

  const handleReady = useCallback(
    (viewer: ViewerReadyState) => {
      handleViewerReady(viewer);
      void restoreFromUrl();
    },
    [handleViewerReady, restoreFromUrl],
  );

  const focusBinding = useCallback(
    async (binding: ObjectBinding) => {
      setSelectedObjectBinding(binding);
      await focusObject(binding.id);
    },
    [focusObject, setSelectedObjectBinding],
  );

  const toggleVisibility = useCallback((key: string) => {
    setObjectBindings((current) => {
      const binding = current[key];
      if (!binding) return current;
      return {
        ...current,
        [key]: { ...binding, visible: binding.visible === false },
      };
    });
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      window.alert(
        "Share link copied. Open it in a new tab to restore this view.",
      );
    } catch {
      window.prompt("Copy this share link:", getShareUrl());
    }
  }, [getShareUrl]);

  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        background: "#020617",
        color: "#f8fafc",
      }}
    >
      <style>{RESPONSIVE_CSS}</style>
      <header style={{ padding: "24px 20px", background: "#0f172a" }}>
        <p
          style={{
            margin: 0,
            color: "#7dd3fc",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          React Immersive example
        </p>
        <h1 style={{ margin: "10px 0", fontSize: 32 }}>
          Shareable View / Deep Link
        </h1>
        <p
          ref={descRef}
          className={`demo-desc${descExpanded ? " demo-desc--expanded" : ""}`}
          style={{
            margin: 0,
            maxWidth: 780,
            lineHeight: 1.55,
            color: "#cbd5e1",
          }}
        >
          Build an exact walkthrough state for a client. The share URL restores
          the camera, selected object, and hidden objects.
        </p>
        {(descTruncated || descExpanded) && (
          <button
            type="button"
            className="demo-readmore"
            onClick={() => setDescExpanded((v) => !v)}
            style={readMoreButtonStyle}
          >
            {descExpanded ? "Read less" : "Read more…"}
          </button>
        )}
      </header>
      {!licenseKey ? (
        <p
          style={{
            margin: 0,
            padding: "10px 20px",
            background: "#78350f",
            color: "#fef3c7",
            fontSize: 13,
          }}
        >
          Set <code>VITE_LICENSE_KEY</code> before running this example.
        </p>
      ) : null}
      <div style={{ position: "relative", flex: 1, minHeight: 620 }}>
        <ModelViewer
          modelUrl={MODEL_URL}
          licenseKey={licenseKey}
          objectBindings={objectBindings}
          onObjectBindingsChange={setObjectBindings}
          selectedObject={selectedObjectBinding}
          onObjectSelect={handleObjectSelect}
          onCameraChange={handleCameraChange}
          onViewerReady={handleReady}
          backgroundColor="#07111f"
          showObjectBindingDataPanel={false}
          showSceneObjectsPanel={false}
          showDownloadButton={false}
          showMouseController={false}
          refitOnResize={false}
        />
        <button
          type="button"
          className="demo-panel-toggle"
          onClick={() => setControlsOpen((v) => !v)}
          style={{
            ...panelToggleStyle,
            ...(controlsOpen ? { left: "auto", right: 16 } : null),
          }}
        >
          {controlsOpen ? "✕" : "☰ Controls"}
        </button>
        <section
          style={panelStyle}
          className={controlsOpen ? "" : "demo-panel--closed"}
        >
          <strong style={{ display: "block", marginBottom: 8 }}>
            Walkthrough controls
          </strong>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 13,
              lineHeight: 1.5,
              color: "#cbd5e1",
            }}
          >
            Select an object to fly there. Hide an object, then copy and open
            the URL to confirm the full state comes back.
          </p>
          {Object.entries(objectBindings).map(([key, binding]) => (
            <div key={key} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                style={{ flex: 1 }}
                onClick={() => void focusBinding(binding)}
              >
                {selectedObjectBinding?.id === binding.id ? "✓ " : ""}
                {binding.label}
              </button>
              <button onClick={() => toggleVisibility(key)}>
                {binding.visible === false ? "Show" : "Hide"}
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => void copyLink()}>Copy link</button>
            <button
              onClick={() =>
                window.open(getShareUrl(), "_blank", "noopener,noreferrer")
              }
            >
              Open link
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
