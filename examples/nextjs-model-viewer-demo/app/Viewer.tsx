"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const SimpleModelViewer = dynamic(
  () => import("@liveroom-tech/react-immersive/simple-model-viewer").then((module) => module.SimpleModelViewer),
  { ssr: false, loading: () => <p>Starting viewer…</p> },
);

export default function Viewer() {
  const [status, setStatus] = useState("Loading model…");

  return (
    <main>
      <p role="status">{status}</p>
      <div style={{ height: "80vh" }}>
        <SimpleModelViewer
          modelUrl="/red_room.glb"
          onModelLoaded={(model) => setStatus(`Loaded ${model.objectCount} objects`)}
          onLoadError={() => setStatus("Model failed to load. Check the URL and browser console.")}
        />
      </div>
      <p>Red Room by LaisLH, CC BY 4.0 — https://skfb.ly/6VBJR</p>
    </main>
  );
}
