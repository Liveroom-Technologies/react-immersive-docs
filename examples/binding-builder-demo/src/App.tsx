import { BindingBuilder } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";

  return (
    <main className="demo-page">
      <DemoPageHeader
        title="BindingBuilder"
        description="A public scene-editor demo that mirrors the larger-screen internal editor route for authoring bindings and scene configuration from GLB/GLTF assets."
        features={[
          "Binding authoring",
          "Scene configuration",
          "GLB/GLTF assets",
          "Desktop-first editor",
        ]}
      />
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
            Set <code>VITE_LICENSE_KEY</code> before running this example.
            Create a key at{" "}
            <a
              href="https://react-immersive.liveroom.dev/console"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              react-immersive.liveroom.dev/console
            </a>
            . The editor is desktop-first and works best on larger screens.
          </>
        ) : (
          "The scene editor is built for larger screens. Open this page on desktop or tablet in landscape for the best experience."
        )}
      </div>
      <ViewerWindow>
        <BindingBuilder licenseKey={licenseKey} />
      </ViewerWindow>
    </main>
  );
}
