import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import {
  ModelViewer,
  useViewerCamera,
  type ObjectBinding,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";
import { objectBindings as initialBindings } from "./objectBindings";

const MODEL_URL = "/t-shirt.glb";

// The oversized-tshirt GLB is split into four meshes (front, back, and two
// sleeves) that all share one material. Every bound mesh is part of the shirt,
// so a material change on any panel is broadcast across the whole garment.
const SHIRT_KEYS = Object.keys(initialBindings);

const SHIRT_COLORS = [
  { name: "White", hex: "#f8fafc" },
  { name: "Black", hex: "#111827" },
  { name: "Heather", hex: "#94a3b8" },
  { name: "Forest", hex: "#166534" },
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Navy", hex: "#1e3a8a" },
];

type ShirtMaterial = NonNullable<NonNullable<ObjectBinding["style"]>["material"]>;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function DemoHeader() {
  const features = [
    "onTextureUpload integration",
    "Durable URL, not a blob URL",
    "Built-in Change Material action",
    "Broadcast across all panels",
  ];

  return (
    <section style={styles.header}>
      <div style={styles.headerInner}>
        <p style={styles.eyebrow}>React Immersive Example</p>
        <h1 style={styles.title}>Texture Upload / Custom Print</h1>
        <p style={styles.description}>
          Upload your own artwork onto a product. The viewer&apos;s built-in
          Change Material action hands the file to{" "}
          <code>onTextureUpload</code>, where a real app would push it to its own
          storage and return a durable URL — the returned URL is committed to the
          material and applied across the whole garment.
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
  const [bindings, setBindings] = useState<Record<string, ObjectBinding>>(() =>
    structuredClone(initialBindings),
  );
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  const { handleViewerReady, setCameraTarget } = useViewerCamera();

  // The Sketchfab Y-up correction places the shirt's center ~1.28 units up, so
  // the default look-at target of [0, 0, 0] frames empty space below it.
  const handleReady = useCallback(
    (viewer: ViewerReadyState) => {
      handleViewerReady(viewer);
      setCameraTarget([0, 1.2, 0], false);
    },
    [handleViewerReady, setCameraTarget],
  );

  const appliedMaterial = bindings[SHIRT_KEYS[0]]?.style?.material;
  const appliedTexture = appliedMaterial?.texture?.path ?? null;
  const appliedColor = appliedMaterial?.baseColor ?? null;

  // Write one material across every shirt panel so the garment stays a single
  // customizable unit regardless of which panel the change came from.
  const applyToShirt = useCallback(
    (patch: (material: ShirtMaterial) => ShirtMaterial) => {
      setBindings((current) => {
        const next = { ...current };
        for (const key of SHIRT_KEYS) {
          const binding = current[key];
          if (!binding) continue;
          next[key] = {
            ...binding,
            style: {
              ...binding.style,
              material: patch(binding.style?.material ?? {}),
            },
          };
        }
        return next;
      });
    },
    [],
  );

  // onTextureUpload is the integration point for real apps: instead of the
  // viewer's default session-scoped blob URL, the file is handed to us so we can
  // push it to our own storage (S3, Cloudinary, a CDN…) and return a durable URL
  // that survives reloads. Here we return a data URL as a backend-free stand-in.
  const handleTextureUpload = useCallback(
    async (file: File, _objectId: string) => {
      const durableUrl = await readFileAsDataUrl(file);
      setUploadedName(file.name);
      return durableUrl;
    },
    [],
  );

  // The built-in change-color / change-material / toggle-visibility actions
  // commit to whichever panel was selected; broadcast that panel's material and
  // visibility to the whole shirt so it stays a single unit.
  const handleBindingsChange = useCallback(
    (next: Record<string, ObjectBinding>) => {
      setBindings((current) => {
        const changedKey = SHIRT_KEYS.find((key) => {
          const a = next[key];
          const b = current[key];
          return (
            JSON.stringify(a?.style?.material) !==
              JSON.stringify(b?.style?.material) || a?.visible !== b?.visible
          );
        });
        if (!changedKey) return next;
        const source = next[changedKey];
        const material = source?.style?.material ?? {};
        const broadcast = { ...next };
        for (const key of SHIRT_KEYS) {
          broadcast[key] = {
            ...next[key],
            visible: source?.visible,
            style: { ...next[key]?.style, material: { ...material } },
          };
        }
        return broadcast;
      });
    },
    [],
  );

  const setShirtColor = useCallback(
    (hex: string) => {
      applyToShirt((material) => ({ ...material, baseColor: hex }));
    },
    [applyToShirt],
  );

  const removePrint = useCallback(() => {
    applyToShirt(({ texture: _texture, ...rest }) => rest);
    setUploadedName(null);
  }, [applyToShirt]);

  return (
    <main style={styles.page}>
      <DemoHeader />
      {!licenseKey ? (
        <div style={styles.warning}>
          Set <code>VITE_LICENSE_KEY</code> before running this example. Create a
          key at{" "}
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
      <div style={styles.viewerShell}>
        <div style={styles.viewerWindow}>
          <ModelViewer
            modelUrl={MODEL_URL}
            licenseKey={licenseKey}
            objectBindings={bindings}
            onObjectBindingsChange={handleBindingsChange}
            onTextureUpload={handleTextureUpload}
            onViewerReady={handleReady}
            backgroundColor="#e2e6ea"
            camera={{ position: [0, 1.2, 1.9], fov: 42 }}
            shadows
            showObjectBindingDataPanel
            showSceneObjectsPanel={false}
            showResetButton
            showDownloadButtons={false}
            showMouseController={false}
            renderMode="always"
            performanceProfile="auto"
            maxDpr={2}
            refitOnResize={false}
          />

          <section style={styles.panel}>
            <div style={styles.panelEyebrow}>Custom Print Studio</div>
            <p style={styles.panelCopy}>
              Click the shirt →{" "}
              <span style={{ fontWeight: 600, color: "#0f172a" }}>
                Change Material
              </span>{" "}
              to print your image. <code>onTextureUpload</code> returns a durable
              URL, applied across the whole shirt.
            </p>

            <div style={styles.colorRow}>
              {SHIRT_COLORS.map((color) => {
                const active = appliedColor === color.hex;
                return (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={active}
                    onClick={() => setShirtColor(color.hex)}
                    style={{
                      ...styles.swatch,
                      backgroundColor: color.hex,
                      borderColor: active ? "#0891b2" : "rgba(0,0,0,0.2)",
                      transform: active ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                );
              })}
            </div>

            <div style={styles.appliedRow}>
              {appliedTexture ? (
                <>
                  <img
                    src={appliedTexture}
                    alt="Applied artwork"
                    style={styles.thumb}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={styles.fileName}>
                      {uploadedName ?? "Custom print"}
                    </div>
                    <span style={styles.appliedBadge}>
                      {appliedTexture.startsWith("data:")
                        ? "durable URL applied"
                        : "URL applied"}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove print"
                    onClick={removePrint}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <p style={styles.emptyCopy}>
                  No print yet — upload artwork to see it here.
                </p>
              )}
            </div>
          </section>

          <div style={styles.credit}>
            &quot;Oversized t-shirt&quot; (
            <a
              href="https://skfb.ly/oQRZL"
              target="_blank"
              rel="noreferrer"
              style={styles.creditLink}
            >
              https://skfb.ly/oQRZL
            </a>
            ) by kylelhb is licensed under{" "}
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
    minHeight: "100vh",
    flexDirection: "column",
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
  headerInner: { margin: "0 auto", maxWidth: 1280, padding: "24px 20px 20px" },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.95)",
  },
  title: { margin: "12px 0 10px", fontSize: 36, lineHeight: 1.05 },
  description: {
    margin: 0,
    maxWidth: 1000,
    fontSize: 17,
    lineHeight: 1.6,
    color: "rgba(226, 232, 240, 0.92)",
  },
  featureList: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 },
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
  viewerShell: { flex: 1, minHeight: 0, padding: 20, background: "#020617" },
  viewerWindow: {
    position: "relative",
    height: "100%",
    minHeight: 640,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "#e2e6ea",
    boxShadow: "0 28px 80px rgba(2, 6, 23, 0.55)",
  },
  panel: {
    position: "absolute",
    right: 16,
    bottom: 40,
    zIndex: 10001,
    width: "min(340px, calc(100% - 32px))",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "rgba(255,255,255,0.92)",
    padding: 12,
    color: "#0f172a",
    backdropFilter: "blur(12px)",
    boxShadow: "0 18px 48px rgba(2, 6, 23, 0.28)",
  },
  panelEyebrow: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#0e7490",
  },
  panelCopy: {
    margin: "6px 0 0",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#475569",
  },
  colorRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  swatch: {
    width: 24,
    height: 24,
    flexShrink: 0,
    borderRadius: 999,
    borderStyle: "solid",
    borderWidth: 2,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  appliedRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    borderTop: "1px solid rgba(0,0,0,0.1)",
    paddingTop: 10,
  },
  thumb: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 4,
    border: "1px solid rgba(0,0,0,0.1)",
    objectFit: "cover",
  },
  fileName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 12,
    fontWeight: 500,
  },
  appliedBadge: {
    display: "inline-block",
    marginTop: 4,
    border: "1px solid rgba(5,150,105,0.3)",
    background: "#ecfdf5",
    color: "#047857",
    padding: "1px 6px",
    fontSize: 10,
  },
  removeButton: {
    flexShrink: 0,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    color: "#334155",
    padding: "6px 10px",
    fontSize: 12,
    cursor: "pointer",
  },
  emptyCopy: { margin: 0, fontSize: 11, color: "#64748b" },
  credit: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontSize: 10,
    color: "#475569",
  },
  creditLink: {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
} satisfies Record<string, CSSProperties>;
