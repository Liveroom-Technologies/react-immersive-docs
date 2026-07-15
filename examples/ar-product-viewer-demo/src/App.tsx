import {
  ModelViewer,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";
import { objectBindings } from "./objectBindings";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  return (
    <main className="demo-page">
      <DemoPageHeader
        title="AR Product Viewer"
        description="A focused retail-ready viewer: inspect the product in 3D, then use AR or VR on a supported device to experience it in your space."
        features={[
          "Mobile-first",
          "View in AR",
          "iOS Quick Look (USDZ)",
          "Android WebXR",
          "Desktop QR handoff",
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
            usdzUrl="/apartment.usdz"
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            enableXR
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
            className="ar-product-viewer-info"
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: 16,
              right: 16,
              maxWidth: 340,
              padding: 16,
              border: "1px solid rgba(148,163,184,.28)",
              background: "rgba(15,23,42,.9)",
              boxShadow: "0 18px 48px rgba(2,6,23,.5)",
            }}
          >
            <strong>View in your space</strong>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#cbd5e1",
              }}
            >
              Explore the model, then use the viewer&apos;s{" "}
              <strong style={{ color: "#fff" }}>AR or VR control</strong>.
              Supported phones can use AR, while compatible headsets can view
              the model in VR. On desktop, choose{" "}
              <strong style={{ color: "#fff" }}>Open on phone</strong> and
              scan the QR code to continue in mobile AR.
            </p>
          </section>
        </div>
      </ViewerWindow>
    </main>
  );
}
