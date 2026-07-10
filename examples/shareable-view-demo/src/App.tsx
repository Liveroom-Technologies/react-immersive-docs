import { useCallback, useState } from "react";
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

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [objectBindings, setObjectBindings] =
    useState<Record<string, ObjectBinding>>(initialBindings);
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
          showDownloadButtons={false}
          showMouseController={false}
          refitOnResize={false}
        />
        <section style={panelStyle}>
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
