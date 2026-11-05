import { useState } from "react";
import {
  CompareViewer,
  useViewerCamera,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";

const LICENSE_KEY = import.meta.env.VITE_LICENSE_KEY ?? "";
// No object bindings: customers compare the rooms, they don't select parts.
const NO_BINDINGS: Record<string, ObjectBinding> = {};

type Layout = "slider" | "side-by-side";

export default function App() {
  const [layout, setLayout] = useState<Layout>("slider");
  // One camera hook, connected to the "before" pane. Both panes share one
  // camera, so a command from this hook moves both of them.
  const camera = useViewerCamera({
    initialPosition: [4.2, 2.4, 4.4],
    initialTarget: [0, 0.9, -0.4],
  });

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <p className="eyebrow">Renovation case study</p>
          <h1>The Larkin Street kitchen</h1>
          <p className="lede">
            Drag the divider (or focus it and use the arrow keys) to compare.
            Orbit either side and both follow.
          </p>
        </div>
        <div className="controls">
          <div role="group" aria-label="Layout" className="segmented">
            <button
              type="button"
              aria-pressed={layout === "slider"}
              onClick={() => setLayout("slider")}
            >
              Slider
            </button>
            <button
              type="button"
              aria-pressed={layout === "side-by-side"}
              onClick={() => setLayout("side-by-side")}
            >
              Side by side
            </button>
          </div>
          <button type="button" onClick={() => camera.resetView()}>
            Reset view
          </button>
          <button type="button" onClick={() => camera.orbitTo(0, 70)}>
            Face the counter
          </button>
        </div>
      </header>

      <main className="viewer">
        {!LICENSE_KEY && (
          <p className="notice" role="note">
            Set <code>VITE_LICENSE_KEY</code> in <code>.env.local</code> and
            restart Vite. Create a free development key in the{" "}
            <a href="https://react-immersive.liveroom.dev/console">console</a>.
          </p>
        )}
        <CompareViewer
          licenseKey={LICENSE_KEY}
          layout={layout}
          objectBindings={NO_BINDINGS}
          camera={{ fov: 45 }}
          before={{
            label: "Before",
            modelUrl: "/kitchen-before.glb",
            onViewerReady: camera.handleViewerReady,
            onCameraChange: camera.handleCameraChange,
          }}
          after={{ label: "After", modelUrl: "/kitchen-after.glb" }}
        />
      </main>
    </div>
  );
}
