import {
  ModelViewer,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";

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
        <h1 style={{ margin: "10px 0", fontSize: 32 }}>AR Product Viewer</h1>
        <p
          style={{
            margin: 0,
            maxWidth: 760,
            lineHeight: 1.55,
            color: "#cbd5e1",
          }}
        >
          A focused, mobile-first product viewer. On a supported phone or
          tablet, use the viewer&apos;s <strong>AR control</strong> to place the
          apartment in your space.
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
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 16,
            left: 16,
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
            Explore the model, then tap the viewer&apos;s{" "}
            <strong style={{ color: "#fff" }}>View in AR</strong> button.
            Android uses WebXR; iOS opens the bundled USDZ model in Quick Look.
          </p>
        </section>
      </div>
    </main>
  );
}
