import {
  ModelViewer,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "../../shared/DemoLayout";

const makeBinding = (
  id: string,
  modelObjectId: string,
  label: string,
): ObjectBinding => ({
  id,
  modelObjectId,
  type: "other",
  label,
  status: "normal",
  selectable: true,
  hoverable: true,
  visible: true,
  style: {},
  actions: [],
  metrics: {},
  metadata: {},
});
const objectBindings: Record<string, ObjectBinding> = {
  Object_4: makeBinding("glass", "Object_4", "Window glass"),
  bake_1: makeBinding("baked-lighting", "bake_1", "Baked lighting"),
  Object_6: makeBinding("shell", "Object_6", "Apartment shell"),
  rendertotexture_2: makeBinding(
    "textures",
    "rendertotexture_2",
    "Interior textures",
  ),
  Object_8: makeBinding("kitchen", "Object_8", "Kitchen"),
  Object_9: makeBinding("living-area", "Object_9", "Living area"),
  bakeplantas_3: makeBinding("plants", "bakeplantas_3", "Plants"),
  Object_11: makeBinding("furniture", "Object_11", "Furniture"),
  "B-ACC-06-Plant_4": makeBinding(
    "accent-plant",
    "B-ACC-06-Plant_4",
    "Accent plant",
  ),
  Object_13: makeBinding("details", "Object_13", "Interior details"),
};

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
              the model in VR.
            </p>
          </section>
        </div>
      </ViewerWindow>
    </main>
  );
}
