import { BindingBuilder } from "@liveroom-tech/react-immersive";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";

  return (
    <main
      style={{
        display: "flex",
        height: "100dvh",
        minHeight: "100vh",
        flexDirection: "column",
        overflow: "hidden",
        background: "#020617",
      }}
    >
      <section
        style={{
          borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
          background:
            "linear-gradient(135deg, rgba(17,24,39,0.97), rgba(30,41,59,0.94))",
          color: "#f8fafc",
        }}
      >
        <div style={{ margin: "0 auto", maxWidth: 1280, padding: "24px 20px 20px" }}>
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
            BindingBuilder
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 960,
              fontSize: 17,
              lineHeight: 1.6,
              color: "rgba(226, 232, 240, 0.92)",
            }}
          >
            A public scene-editor demo that mirrors the larger-screen internal
            editor route for authoring bindings and scene configuration from
            GLB/GLTF assets.
          </p>
        </div>
      </section>
      <div
        style={{
          background: "rgba(245, 158, 11, 0.16)",
          color: "#fef3c7",
          padding: "10px 16px",
          fontSize: 12,
        }}
      >
        {!licenseKey ? (
          <>
            Set <code>VITE_LICENSE_KEY</code> before running this example. Create a key at <a href="https://react-immersive.liveroom.dev/console" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>react-immersive.liveroom.dev/console</a>. The
            editor is desktop-first and works best on larger screens.
          </>
        ) : (
          "The scene editor is built for larger screens. Open this page on desktop or tablet in landscape for the best experience."
        )}
      </div>
      <div style={{ display: "flex", minHeight: 0, flex: 1 }}>
        <BindingBuilder licenseKey={licenseKey} />
      </div>
    </main>
  );
}
