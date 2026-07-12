import type {
  ObjectBinding,
  SceneConfig,
} from "@liveroom-tech/react-immersive";
import { ModelViewer } from "@liveroom-tech/react-immersive";

import objectBindings from "./objectBindings.json";
import sceneConfig from "./sceneConfig.json";

const DEFAULT_MODEL_URL =
  "https://pub-231330919f51417f9bc6a239010def9a.r2.dev/red-room/red_room.glb";
const DEFAULT_MODEL_USDZ_URL =
  "https://pub-231330919f51417f9bc6a239010def9a.r2.dev/red-room/red_room.usdz";

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
        style={{ margin: "0 auto", maxWidth: 1280, padding: "24px 20px 20px" }}
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
        <h1 style={{ margin: "12px 0 10px", fontSize: 36, lineHeight: 1.05 }}>
          ModelViewer
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: 1000,
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(226, 232, 240, 0.92)",
          }}
        >
          The full-featured viewer: object bindings drive color, texture,
          visibility, and actions, with scene config, measurement tools, and XR
          support layered on top.
        </p>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}
        >
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
    <div style={{ flex: 1, minHeight: 0, padding: 20, background: "#020617" }}>
      <div
        style={{
          position: "relative",
          height: "100%",
          minHeight: 560,
          overflow: "hidden",
          border: "1px solid rgba(148, 163, 184, 0.18)",
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
        minHeight: "100vh",
        flexDirection: "column",
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
