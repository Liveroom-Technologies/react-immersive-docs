import { useState } from "react";
import type { CSSProperties } from "react";
import { ModelViewer, type SceneConfig } from "@liveroom-tech/react-immersive";
import { objectBindings } from "./objectBindings";
import { sceneConfig } from "./sceneConfig";
import { DemoPageHeader } from "./DemoLayout";

const MODEL_URL = "/art_gallery.glb";

type TourStop = SceneConfig["annotations"][number];

const STOPS: TourStop[] = sceneConfig.annotations;

function DemoHeader() {
  const features = [
    "SceneAnnotationMarker stops",
    "Built-in annotation navigation",
    "Camera flies to worldPosition",
    "No per-object binding required",
  ];

  return (
    <section style={styles.header}>
      <div style={styles.headerInner}>
        <p style={styles.eyebrow}>React Immersive Example</p>
        <h1 style={styles.title}>Guided Showroom Tour</h1>
        <p style={styles.description}>
          A gallery room where <code>SceneAnnotationMarker</code> stops — each
          just a world position, title, and description — drive a guided
          walkthrough. Use the viewer&apos;s built-in{" "}
          <strong>Guided Tour</strong> control to fly between stops; the panel
          reflects the active stop.
        </p>
        <div style={styles.featureList}>
          {features.map((feature) => (
            <span key={feature} style={styles.featureBadge}>
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [activeAnnotation, setActiveAnnotation] = useState<TourStop | null>(
    null,
  );

  const activeIndex = activeAnnotation
    ? STOPS.findIndex((stop) => stop.id === activeAnnotation.id)
    : -1;

  return (
    <main className="demo-page" style={styles.page}>
      <DemoPageHeader
        title="Guided Showroom Tour"
        description="A gallery room where SceneAnnotationMarker stops — each just a world position, title, and description — drive a guided walkthrough. The camera flies between stops via the built-in annotation navigation; no per-exhibit mesh binding required."
        features={[
          "SceneAnnotationMarker stops",
          "Built-in annotation navigation",
          "Camera flies to worldPosition",
          "Position-only markers, no object binding needed",
        ]}
      />
      {!licenseKey ? (
        <div style={styles.warning}>
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
      <div className="demo-viewer-shell" style={styles.viewerShell}>
        <div className="demo-viewer-frame" style={styles.viewerWindow}>
          <ModelViewer
            modelUrl={MODEL_URL}
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            sceneConfig={sceneConfig}
            activeAnnotation={activeAnnotation}
            onActiveAnnotationChange={setActiveAnnotation}
            backgroundColor="#0b0f14"
            camera={{ position: [7, 2, 7], fov: 50, zoom: 1 }}
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showResetButton
            showDownloadButton={false}
            showMouseController={false}
            showAnnotationNavigation
            renderMode="always"
            performanceProfile="auto"
            maxDpr={2}
            refitOnResize={false}
            zoomOnSelected={false}
          />

          <section style={styles.panel}>
            <p style={styles.panelEyebrow}>Guided Tour</p>
            <h2 style={styles.panelTitle}>
              {activeAnnotation ? activeAnnotation.title : "Gallery Overview"}
            </h2>
            <span style={styles.statusBadge}>
              {activeIndex >= 0
                ? `Stop ${activeIndex + 1} / ${STOPS.length}`
                : "Not started"}
            </span>
            {activeAnnotation?.description ? (
              <p style={styles.panelCopy}>{activeAnnotation.description}</p>
            ) : (
              <p style={styles.panelCopy}>
                Press the <strong>Guided Tour</strong> button in the viewer to
                start flying between the annotation stops.
              </p>
            )}
          </section>

          <div style={styles.credit}>
            &quot;Art Gallery&quot; (
            <a
              href="https://skfb.ly/oRXGx"
              target="_blank"
              rel="noreferrer"
              style={styles.creditLink}
            >
              https://skfb.ly/oRXGx
            </a>
            ) by ALLrounder18 is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              style={styles.creditLink}
            >
              CC-BY 4.0
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100dvh",
    minHeight: "100vh",
    flexDirection: "column",
    overflow: "hidden",
    background: "#020617",
    color: "#f8fafc",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  header: {
    borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
    background:
      "linear-gradient(135deg, rgba(17,24,39,0.97), rgba(30,41,59,0.94))",
  },
  headerInner: {
    margin: "0 auto",
    maxWidth: 1280,
    padding: "24px 20px 20px",
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.95)",
  },
  title: {
    margin: "12px 0 10px",
    fontSize: 36,
    lineHeight: 1.05,
  },
  description: {
    margin: 0,
    maxWidth: 1000,
    fontSize: 17,
    lineHeight: 1.6,
    color: "rgba(226, 232, 240, 0.92)",
  },
  featureList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  featureBadge: {
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(15, 23, 42, 0.36)",
    padding: "8px 12px",
    fontSize: 12,
  },
  warning: {
    background: "rgba(245, 158, 11, 0.16)",
    color: "#fef3c7",
    padding: "10px 16px",
    fontSize: 12,
  },
  viewerShell: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    padding: 0,
    background: "#020617",
  },
  viewerWindow: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    position: "relative",
    height: "100%",
    overflow: "hidden",
    border: "none",
    background: "#0b0f14",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
  },
  panel: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10001,
    width: "min(340px, calc(100% - 32px))",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(7,17,31,0.9)",
    padding: 12,
    color: "#fff",
    backdropFilter: "blur(12px)",
  },
  panelEyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#67e8f9",
  },
  panelTitle: {
    margin: "10px 0 0",
    fontSize: 18,
  },
  statusBadge: {
    display: "inline-block",
    marginTop: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "3px 8px",
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
  },
  panelCopy: {
    margin: "12px 0 0",
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    lineHeight: 1.5,
  },
  credit: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
  },
  creditLink: {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
} satisfies Record<string, CSSProperties>;
