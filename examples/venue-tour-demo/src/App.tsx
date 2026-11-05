import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_SCENE_CONFIG,
  ModelViewer,
  useViewerCamera,
  type AnnotationMarker,
  type ObjectBinding,
  type SceneConfig,
} from "@liveroom-tech/react-immersive";
import { TourEditor } from "./TourEditor";
import {
  loadTour,
  publishTour,
  toAnnotations,
  toPresets,
  type Tour,
} from "./tour";

const LICENSE_KEY = import.meta.env.VITE_LICENSE_KEY ?? "";
// No object bindings: visitors explore the hall, they don't select its parts.
const NO_BINDINGS: Record<string, ObjectBinding> = {};
// Editor mode is a URL flag here. In production, show the editor only to signed-in editors.
const EDITOR_MODE = new URLSearchParams(window.location.search).has("edit");

export default function App() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [active, setActive] = useState<AnnotationMarker | null>(null);
  const camera = useViewerCamera({
    initialPosition: [0, 13, 13],
    initialTarget: [0, 0, -0.5],
  });

  useEffect(() => {
    loadTour().then(setTour, (error: Error) => setLoadError(error.message));
  }, []);

  const annotations = useMemo(() => (tour ? toAnnotations(tour) : []), [tour]);
  const sceneConfig = useMemo<SceneConfig>(
    () => ({ ...DEFAULT_SCENE_CONFIG, annotations }),
    [annotations],
  );

  // Presets are read once by useViewerCamera, so load the published (or just
  // edited) views explicitly whenever the tour changes.
  const { setCameraPresets } = camera;
  useEffect(() => {
    if (tour) setCameraPresets(toPresets(tour));
  }, [tour, setCameraPresets]);

  // Opening a hotspot from your own UI doesn't move the camera by itself, so
  // fly to the stop first, then open its card.
  async function goTo(stopId: number) {
    setActive(null);
    if (await camera.goToPreset(String(stopId), true)) {
      setActive(
        annotations.find((annotation) => annotation.id === stopId) ?? null,
      );
    }
  }

  async function overview() {
    setActive(null);
    await camera.resetView();
  }

  return (
    <div className="layout">
      <header className="masthead">
        <div>
          <p className="eyebrow">The Foundry Hall</p>
          <h1>Take the tour</h1>
        </div>
        <nav aria-label="Tour stops" className="stops">
          <button
            type="button"
            onClick={overview}
            aria-pressed={active === null}
          >
            Overview
          </button>
          {tour?.stops.map((stop) => (
            <button
              key={stop.id}
              type="button"
              onClick={() => goTo(stop.id)}
              aria-pressed={active?.id === stop.id}
            >
              {stop.title}
            </button>
          ))}
        </nav>
      </header>

      <main className="stage">
        {!LICENSE_KEY && (
          <p className="notice" role="note">
            Set <code>VITE_LICENSE_KEY</code> in <code>.env.local</code> and
            restart Vite. Create a free development key in the{" "}
            <a href="https://react-immersive.liveroom.dev/console">console</a>.
          </p>
        )}
        {loadError && (
          <p className="notice" role="alert">
            {loadError}
          </p>
        )}
        <div className="viewer">
          <ModelViewer
            modelUrl="/venue.glb"
            licenseKey={LICENSE_KEY}
            preset="minimal"
            objectBindings={NO_BINDINGS}
            sceneConfig={sceneConfig}
            activeAnnotation={active}
            onActiveAnnotationChange={setActive}
            onViewerReady={camera.handleViewerReady}
            onCameraChange={camera.handleCameraChange}
          />
        </div>
        {EDITOR_MODE && tour && (
          <TourEditor
            tour={tour}
            onChange={setTour}
            currentView={camera.cameraState}
            onPreview={goTo}
            onPublish={() => publishTour(tour)}
          />
        )}
      </main>
    </div>
  );
}
