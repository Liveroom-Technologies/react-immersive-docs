import { useCallback, useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Link2,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  ModelViewer,
  useShareableViewerState,
  useViewerCamera,
  useViewerSelection,
  type ObjectBinding,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";
import initialBindings from "./objectBindings.json";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";

const MODEL_URL = "/red-room.glb";
const FEATURED_OBJECT_KEYS = [
  "Bed_Bed_0",
  "Chair_Chair_0",
  "Abajour_Abadour2_0",
] as const;

const RESPONSIVE_CSS = `
  .shareable-panel-toggle { display: inline-flex; }
  @media (min-width: 641px) {
    .shareable-panel-toggle { display: none !important; }
  }
  @media (max-width: 640px) {
    .shareable-panel--closed { display: none !important; }
  }
`;

const styles = {
  panel: {
    position: "absolute" as const,
    top: 16,
    left: 16,
    zIndex: 10001,
    width: "min(350px, calc(100% - 24px))",
    padding: 12,
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(7,17,31,.92)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,.45)",
    color: "#fff",
    backdropFilter: "blur(12px)",
  },
  toggle: {
    position: "absolute" as const,
    top: 12,
    left: 12,
    zIndex: 10002,
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 999,
    background: "rgba(2,6,23,.85)",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,.3)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(255,255,255,.1)",
    background: "rgba(255,255,255,.05)",
    padding: 8,
  },
  focusButton: {
    display: "flex",
    minWidth: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    border: 0,
    background: "transparent",
    padding: "6px 8px",
    color: "#fff",
    fontSize: 14,
    textAlign: "left" as const,
    cursor: "pointer",
  },
  iconButton: {
    display: "grid",
    width: 32,
    height: 32,
    flex: "0 0 auto",
    placeItems: "center",
    border: 0,
    background: "transparent",
    color: "rgba(255,255,255,.75)",
    cursor: "pointer",
  },
  actionButton: {
    display: "flex",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    border: 0,
    background: "#0e7490",
    color: "#ecfeff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  outlineButton: {
    display: "flex",
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    border: "1px solid rgba(255,255,255,.2)",
    background: "transparent",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [objectBindings, setObjectBindings] = useState<
    Record<string, ObjectBinding>
  >(() => structuredClone(initialBindings) as Record<string, ObjectBinding>);
  const [controlsOpen, setControlsOpen] = useState(false);
  const {
    cameraState,
    focusObject,
    handleCameraChange,
    handleViewerReady,
    setCameraState,
  } = useViewerCamera();
  const {
    selectedObjectBinding,
    setSelectedObjectBinding,
    handleObjectSelect,
  } = useViewerSelection();
  const { getShareUrl, restoreFromUrl } = useShareableViewerState({
    cameraState,
    setCameraState,
    objectBindings,
    onObjectBindingsChange: setObjectBindings,
    selectedObjectBinding,
    setSelectedObjectBinding,
  });

  const featuredObjects = useMemo(
    () =>
      FEATURED_OBJECT_KEYS.map((key) => ({
        key,
        binding: objectBindings[key],
      })).filter(
        (
          item,
        ): item is {
          key: (typeof FEATURED_OBJECT_KEYS)[number];
          binding: ObjectBinding;
        } => Boolean(item.binding),
      ),
    [objectBindings],
  );

  const handleReady = useCallback(
    (viewer: ViewerReadyState) => {
      handleViewerReady(viewer);
      void restoreFromUrl();
    },
    [handleViewerReady, restoreFromUrl],
  );

  const focusFeaturedObject = useCallback(
    async (binding: ObjectBinding) => {
      setSelectedObjectBinding(binding);
      await focusObject(binding.id);
    },
    [focusObject, setSelectedObjectBinding],
  );

  const toggleVisibility = useCallback((key: string) => {
    setObjectBindings((current) => {
      const binding = current[key];
      if (!binding) return current;
      return {
        ...current,
        [key]: { ...binding, visible: binding.visible === false },
      };
    });
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
    } catch {
      window.prompt("Copy this share link:", getShareUrl());
    }
  }, [getShareUrl]);

  const openShareLink = useCallback(() => {
    window.open(getShareUrl(), "_blank", "noopener,noreferrer");
  }, [getShareUrl]);

  const hiddenCount = featuredObjects.filter(
    ({ binding }) => binding.visible === false,
  ).length;

  return (
    <main className="demo-page">
      <style>{RESPONSIVE_CSS}</style>
      <DemoPageHeader
        title="Shareable View / Deep Link"
        description="Create a precise walkthrough handoff for a client. The link records the camera, the selected object, and any hidden objects — then restores all of it when the recipient opens it."
        features={[
          "Camera state in URL",
          "Selection restored",
          "Hidden objects restored",
          "Copy-ready deep link",
        ]}
      />
      {!licenseKey ? (
        <p className="demo-license-warning">
          Set <code>VITE_LICENSE_KEY</code> before running this example.
        </p>
      ) : null}
      <ViewerWindow>
        <div>
          <ModelViewer
            modelUrl={MODEL_URL}
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            onObjectBindingsChange={setObjectBindings}
            selectedObject={selectedObjectBinding}
            onObjectSelect={handleObjectSelect}
            onCameraChange={handleCameraChange}
            onViewerReady={handleReady}
            backgroundColor="#07111f"
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showResetButton
            showDownloadButton={false}
            showMouseController={false}
            refitOnResize={false}
          />

          <button
            type="button"
            className="shareable-panel-toggle"
            aria-expanded={controlsOpen}
            aria-label={controlsOpen ? "Hide controls" : "Show controls"}
            onClick={() => setControlsOpen((value) => !value)}
            style={{
              ...styles.toggle,
              ...(controlsOpen ? { left: "auto", right: 12 } : {}),
            }}
          >
            {controlsOpen ? (
              <X size={16} />
            ) : (
              <>
                <SlidersHorizontal size={16} /> Controls
              </>
            )}
          </button>

          <section
            style={styles.panel}
            className={controlsOpen ? "" : "shareable-panel--closed"}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#a5f3fc",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                  }}
                >
                  <Link2 size={16} /> Client handoff
                </div>
                <h2 style={{ margin: "8px 0 0", fontSize: 18 }}>
                  Build a walkthrough view
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "rgba(255,255,255,.65)",
                    fontSize: 12,
                    lineHeight: "20px",
                  }}
                >
                  Pick a feature to fly the camera there, hide anything you do
                  not want to discuss, then share the result.
                </p>
              </div>
              <span
                style={{
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.1)",
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  textWrap: "nowrap",
                }}
              >
                {hiddenCount} hidden
              </span>
            </div>

            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              {featuredObjects.map(({ key, binding }) => {
                const hidden = binding.visible === false;
                const selected = selectedObjectBinding?.id === binding.id;
                return (
                  <div
                    key={key}
                    style={{
                      ...styles.item,
                      ...(selected
                        ? {
                            borderColor: "rgba(103,232,249,.6)",
                            background: "rgba(103,232,249,.1)",
                          }
                        : {}),
                    }}
                  >
                    <button
                      type="button"
                      style={styles.focusButton}
                      onClick={() => void focusFeaturedObject(binding)}
                    >
                      <MapPin size={14} color="#a5f3fc" />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {binding.label}
                      </span>
                    </button>
                    <button
                      type="button"
                      style={styles.iconButton}
                      aria-label={`${hidden ? "Show" : "Hide"} ${binding.label}`}
                      onClick={() => toggleVisibility(key)}
                    >
                      {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 8,
                marginTop: 16,
              }}
            >
              <button
                type="button"
                style={styles.actionButton}
                onClick={() => void copyLink()}
              >
                <Copy size={16} /> Copy link
              </button>
              <button
                type="button"
                style={styles.outlineButton}
                onClick={openShareLink}
              >
                <ExternalLink size={16} /> Open link
              </button>
            </div>
            <p
              style={{
                margin: "12px 0 0",
                color: "rgba(255,255,255,.5)",
                fontSize: 11,
                lineHeight: "16px",
              }}
            >
              Try it: select an item, hide another one, copy the link, then open
              it in a new tab.
            </p>
          </section>
        </div>
        <p className="demo-credit">
          &quot;Red Room&quot; (
          <a href="https://skfb.ly/6VBJR" target="_blank" rel="noreferrer">
            https://skfb.ly/6VBJR
          </a>
          ) by wallon is licensed under CC-BY 4.0
        </p>
      </ViewerWindow>
    </main>
  );
}
