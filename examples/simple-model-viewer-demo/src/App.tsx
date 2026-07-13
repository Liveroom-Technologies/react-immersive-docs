import { useState } from "react";
import { SimpleModelViewer } from "@liveroom-tech/react-immersive";

function DemoHeader() {
  const features = [
    "No bindings or license required",
    "Auto-discovers scene meshes",
    "Scene objects panel (search + visibility)",
    "Environment and lighting settings",
    "Click-to-select and focus",
  ];

  return (
    <section
      style={{
        borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
        color: "#f8fafc",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 1280, padding: "24px 20px 20px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(148, 163, 184, 0.95)",
          }}
        >
          React Immersive Demo
        </p>
        <h1 style={{ margin: "12px 0 10px", fontSize: 36, lineHeight: 1.05 }}>
          SimpleModelViewer
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 980,
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(226, 232, 240, 0.92)",
          }}
        >
          A lightweight GLB/GLTF viewer that renders any model with zero
          configuration. No object bindings or license key required.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          {features.map((feature) => (
            <span
              key={feature}
              style={{
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.36)",
                padding: "8px 12px",
                fontSize: 12,
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ViewerWindow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        minHeight: 0,
        padding: 0,
        background: "#020617",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          position: "relative",
          height: "100%",
          overflow: "hidden",
          border: "none",
          background: "#0f172a",
          boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [error, setError] = useState<string | null>(null);

  return (
    <main
      style={{
        display: "flex",
        height: "100dvh",
        minHeight: "100vh",
        flexDirection: "column",
        overflow: "hidden",
        background: "#020617",
      }}
    >
      <DemoHeader />
      <ViewerWindow>
        <SimpleModelViewer
          modelUrl=""
          backgroundColor="#1a1a1a"
          showSceneObjectsPanel
          showSceneSettingsPanel
          enableModelUpload
          autoRotate
          onLoadError={() => setError("Model failed to load.")}
        />
        {error ? (
          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              zIndex: 40,
              background: "rgba(127, 29, 29, 0.88)",
              color: "#fee2e2",
              padding: "10px 12px",
              fontSize: 12,
            }}
          >
            {error}
          </div>
        ) : null}
      </ViewerWindow>
    </main>
  );
}
