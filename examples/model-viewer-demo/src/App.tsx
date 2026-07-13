import type {
  ObjectBinding,
  SceneConfig,
} from "@liveroom-tech/react-immersive";
import { ModelViewer } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "../../shared/DemoLayout";
import objectBindings from "./objectBindings.json";
import sceneConfig from "./sceneConfig.json";

const DEFAULT_MODEL_URL = "/red-room.glb";
const DEFAULT_MODEL_USDZ_URL = "/red-room.usdz";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";

  return (
    <main className="demo-page">
      <DemoPageHeader
        title="ModelViewer"
        description="The full-featured viewer: object bindings drive color, texture, visibility and actions, with soft shadows, post-processing, animation playback, guided-tour annotations, measurement tools and WebXR AR/VR support."
        features={[
          "Object bindings (color/texture/visibility/actions)",
          "Soft shadows & post-processing",
          "lighting, environment, animations",
          "Guided-tour annotations",
          "Measurement tools",
          "WebXR AR/VR",
        ]}
      />
      {!licenseKey ? (
        <div className="demo-license-warning">
          Set <code>VITE_LICENSE_KEY</code> before running this example.
        </div>
      ) : null}
      <ViewerWindow>
        <ModelViewer
          modelUrl={DEFAULT_MODEL_URL}
          licenseKey={licenseKey}
          objectBindings={objectBindings as Record<string, ObjectBinding>}
          shadows
          showObjectBindingDataPanel
          showSceneObjectsPanel
          showDownloadButton
          downloadFilename="model"
          showResetButton
          showMouseController={false}
          mouseControllerPosition="center-bottom"
          mouseControllerOpacity={1}
          moveSensitivity={0.08}
          zoomSensitivity={1}
          disableZoom={false}
          zoomOnSelected
          renderMode="demand"
          maxDpr={2}
          performanceProfile="auto"
          meshopt
          showMeasureTools
          measurementUnit="m"
          enableXR
          usdzUrl={DEFAULT_MODEL_USDZ_URL}
          showAnnotationNavigation
          sceneConfig={sceneConfig as unknown as SceneConfig}
          onLoadError={() => console.error("ModelViewer failed to load.")}
        />
        <p className="demo-credit">
          &quot;Red Room&quot; by LaisLH:{" "}
          <a href="https://skfb.ly/6VBJR" target="_blank" rel="noreferrer">
            https://skfb.ly/6VBJR
          </a>
        </p>
      </ViewerWindow>
    </main>
  );
}
