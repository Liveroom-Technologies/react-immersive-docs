import type {
  ObjectBinding,
  SceneConfig,
} from "@liveroom-tech/react-immersive";
import { ModelViewer } from "@liveroom-tech/react-immersive";

import objectBindings from "./objectBindings.json";
import sceneConfig from "./sceneConfig.json";

const DEFAULT_MODEL_URL = "/red-room.glb";
const DEFAULT_MODEL_USDZ_URL = "/red-room.usdz";

function DemoHeader() {
  const features = [
    "Object bindings (color, texture, visibility, actions)",
    "Soft shadows and post-processing",
    "Lighting, environment, and animations",
    "Guided-tour annotations",
    "Measurement tools",
    "WebXR AR/VR flags",
  ];

  return (
    <section
      style={{
        borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
        background:
          "linear-gradient(135deg, rgba(17,24,39,0.97), rgba(30,41,59,0.94))",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: 1440,
          padding: "20px clamp(20px, 5vw, 72px) 18px",
        }}
      >
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
        <h1 style={{ margin: "5px 0 6px", fontSize: 32, lineHeight: 1.1 }}>
          ModelViewer
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "none",
            fontSize: 15,
            lineHeight: 1.45,
            color: "rgba(226, 232, 240, 0.92)",
          }}
        >
          The full-featured viewer: object bindings drive color, texture,
          visibility, and actions, with scene config, measurement tools, and XR
          support layered on top.
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}
        >
          {features.map((feature) => (
            <span
              key={feature}
              style={{
                border: "1px solid rgba(148, 163, 184, 0.28)",
                background: "rgba(15, 23, 42, 0.36)",
                borderRadius: 999,
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 600,
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
        width: "100%",
        background: "#020617",
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
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
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#020617",
      }}
    >
      <DemoHeader />
      {!licenseKey ? (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.16)",
            color: "#fef3c7",
            padding: "10px 16px",
            fontSize: 12,
          }}
        >
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
          showDownloadButton
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
          sceneConfig={sceneConfig as SceneConfig}
          onLoadError={() => {
            console.error("ModelViewer failed to load.");
          }}
        />
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            left: "50%",
            bottom: 12,
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
        >
          <p
            style={{
              pointerEvents: "auto",
              margin: 0,
              maxWidth: 720,
              background: "rgba(15, 23, 42, 0.72)",
              padding: "8px 12px",
              fontSize: 11,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            &quot;Red Room&quot; by LaisLH:{" "}
            <a
              href="https://skfb.ly/6VBJR"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit" }}
            >
              https://skfb.ly/6VBJR
            </a>
          </p>
        </div>
      </ViewerWindow>
    </main>
  );
}
