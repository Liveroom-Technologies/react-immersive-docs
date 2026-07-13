import { ModelViewer } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";
import { objectBindings } from "./objectBindings";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  return (
    <main className="demo-page">
      <DemoPageHeader
        title="Exploded View"
        description="Inspect an assembly's internals by sliding its parts apart. The explode slider separates every bound mesh outward from the model center, then reassembles it — ideal for engines, gadgets, and multi-part products."
        features={[
          "Explode slider",
          "Per-part separation",
          "Typed-mesh model",
          "Fully reversible",
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
            modelUrl="/cartoon_car.glb"
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            showExplodeControls
            backgroundColor="#080b12"
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel
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
              maxWidth: 320,
              padding: 16,
              border: "1px solid rgba(148,163,184,.28)",
              background: "rgba(15,23,42,.9)",
              boxShadow: "0 18px 48px rgba(2,6,23,.5)",
            }}
          >
            <strong>Exploded view</strong>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#cbd5e1",
              }}
            >
              Open the <strong style={{ color: "#fff" }}>Exploded view</strong>{" "}
              control in the top-left and drag the slider. Each of the
              car&apos;s 32 parts slides out along its own direction; drag back
              to zero to reassemble.
            </p>
          </section>
          <p
            style={{
              position: "absolute",
              bottom: 4,
              left: "50%",
              transform: "translateX(-50%)",
              margin: 0,
              fontSize: 10,
              color: "rgba(248,250,252,.85)",
              whiteSpace: "nowrap",
            }}
          >
            &quot;Cartoon Car&quot; (
            <a
              style={{ color: "inherit" }}
              href="https://skfb.ly/ouxVu"
              target="_blank"
              rel="noreferrer"
            >
              https://skfb.ly/ouxVu
            </a>
            ) by wallon is licensed under{" "}
            <a
              style={{ color: "inherit" }}
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC-BY 4.0
            </a>
          </p>
        </div>
      </ViewerWindow>
    </main>
  );
}
