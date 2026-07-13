import { useState } from "react";
import { SimpleModelViewer } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";

export default function App() {
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="demo-page">
      <DemoPageHeader
        title="SimpleModelViewer"
        description="A lightweight GLB/GLTF viewer that renders any model with zero configuration — no objectBindings or licenseKey required. It auto-discovers meshes and gives you scene object and environment panels out of the box."
        features={[
          "No bindings or license required",
          "Auto-discovers scene meshes",
          "Scene objects panel (search + visibility)",
          "Environment & lighting settings",
          "Click-to-select & focus",
        ]}
      />
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
        {error ? <div className="demo-error">{error}</div> : null}
      </ViewerWindow>
    </main>
  );
}
