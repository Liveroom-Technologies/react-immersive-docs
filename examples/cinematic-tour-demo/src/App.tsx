import { ModelViewer } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";
import { objectBindings } from "./objectBindings";
import { sceneConfig } from "./sceneConfig";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  return (
    <main className="demo-page">
      <DemoPageHeader
        title="Cinematic Tour"
        description="An automatic camera that glides through a space on its own, like a film. The path is a list of waypoints — camera position + look-at keyframes — authored visually in BindingBuilder and replayed by the viewer's cinematic auto-camera."
        features={[
          "Waypoint path",
          "Auto-play + loop",
          "Spline glide",
          "Grab to take over",
        ]}
      />
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
      <ViewerWindow>
        <div>
          <ModelViewer
            modelUrl="/apartment.glb"
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            sceneConfig={sceneConfig}
            // The waypoint path is authored on sceneConfig.cinematic; the prop
            // overwrites that config field-by-field, so this keeps the authored
            // waypoints while forcing autoPlay for the showcase.
            cinematic={{ autoPlay: true }}
            backgroundColor="#080b12"
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showDownloadButton={false}
            showMouseController={false}
            showResetButton
            refitOnResize={false}
          />
          <section
            style={{
              pointerEvents: "none",
              position: "absolute",
              bottom: 16,
              left: 16,
              maxWidth: 340,
              padding: 16,
              border: "1px solid rgba(148,163,184,.28)",
              background: "rgba(15,23,42,.9)",
              boxShadow: "0 18px 48px rgba(2,6,23,.5)",
            }}
          >
            <strong>Cinematic tour</strong>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#cbd5e1",
              }}
            >
              The camera auto-plays along the authored waypoint path and loops.
              Use the <strong style={{ color: "#fff" }}>play / pause</strong>{" "}
              control in the top-left, or grab the model — touching the camera
              hands control back to you.
            </p>
          </section>
        </div>
      </ViewerWindow>
    </main>
  );
}
