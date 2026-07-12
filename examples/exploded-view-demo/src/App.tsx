import { ModelViewer } from "@liveroom-tech/react-immersive";
import { objectBindings } from "./objectBindings";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  return (
    <main
      style={{ minHeight: "100vh", background: "#080b12", color: "#f8fafc" }}
    >
      <header style={{ padding: "24px 20px", background: "#0f172a" }}>
        <p
          style={{
            margin: 0,
            color: "#7dd3fc",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          React Immersive example
        </p>
        <h1 style={{ margin: "10px 0", fontSize: 32 }}>Exploded View</h1>
        <p
          style={{
            margin: 0,
            maxWidth: 760,
            lineHeight: 1.55,
            color: "#cbd5e1",
          }}
        >
          Slide an assembly&apos;s parts apart to inspect its internals. The
          <strong> Exploded view</strong> control (top-left of the viewer)
          separates every bound mesh outward from the model center, then
          reassembles it — driven by the single <code>showExplodeControls</code>{" "}
          prop.
        </p>
      </header>
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
      <div style={{ position: "relative", minHeight: "calc(100vh - 150px)" }}>
        <ModelViewer
          modelUrl="/cartoon_car.glb"
          licenseKey={licenseKey}
          objectBindings={objectBindings}
          showExplodeControls
          backgroundColor="#080b12"
          shadows
          showObjectBindingDataPanel={false}
          showSceneObjectsPanel
          showDownloadButtons={false}
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
            control in the top-left and drag the slider. Each of the car&apos;s
            32 parts slides out along its own direction; drag back to zero to
            reassemble.
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
    </main>
  );
}
