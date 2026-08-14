import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ModelViewer,
  material,
  useObjectBindings,
  useSceneConfig,
  useViewerCamera,
  useViewerConnection,
  useViewerEffects,
  type BindingEdit,
  type ViewerEffectChannels,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";
import { horrorSceneConfig } from "./horrorSceneConfig";
import { objectBindings as initialObjectBindings } from "./objectBindings";

const LICENSE_KEY = import.meta.env.VITE_LICENSE_KEY ?? "";
const WARM_GLOW = "#ff9a3c";

type FlickerPreset = "lit" | "failing" | "possessed";

type FlickerSettings = {
  label: string;
  base: number;
  variance: number;
  blackoutChance: number;
  flashChance: number;
  response: number;
  emissiveStrength: number;
  lightStrength: number;
};

type BulbDefinition = {
  id: string;
  modelObjectId: string;
  glassObjectId: string;
  lightId: string;
};

type SceneMood = {
  environmentIntensity: number;
  bloomIntensity: number;
  bloomThreshold: number;
  vignetteDarkness: number;
};

const PRESETS: Record<FlickerPreset, FlickerSettings> = {
  lit: {
    label: "Lit up",
    base: 1,
    variance: 0,
    blackoutChance: 0,
    flashChance: 0,
    response: 0.9,
    emissiveStrength: 12,
    lightStrength: 260,
  },
  failing: {
    label: "Failing circuit",
    base: 0.58,
    variance: 0.48,
    blackoutChance: 0.08,
    flashChance: 0.14,
    response: 0.64,
    emissiveStrength: 6,
    lightStrength: 220,
  },
  possessed: {
    label: "Possessed",
    base: 0.46,
    variance: 0.72,
    blackoutChance: 0.16,
    flashChance: 0.25,
    response: 0.82,
    emissiveStrength: 8,
    lightStrength: 300,
  },
};

const SCENE_MOODS: Record<FlickerPreset, SceneMood> = {
  lit: {
    environmentIntensity: 0.012,
    bloomIntensity: 1.25,
    bloomThreshold: 0.4,
    vignetteDarkness: 0.75,
  },
  failing: {
    environmentIntensity: 0.008,
    bloomIntensity: 1.45,
    bloomThreshold: 0.35,
    vignetteDarkness: 0.85,
  },
  possessed: {
    environmentIntensity: 0.006,
    bloomIntensity: 1.7,
    bloomThreshold: 0.28,
    vignetteDarkness: 0.92,
  },
};

const BULBS: BulbDefinition[] = Object.values(initialObjectBindings).flatMap(
  (binding) => {
    const match = /^Cylinder(\d+)_Material008_0$/.exec(
      binding.modelObjectId,
    );
    if (!match) return [];

    const glassObjectId = `Cylinder${String(Number(match[1]) - 3).padStart(3, "0")}_Material001_0`;
    if (!(glassObjectId in initialObjectBindings)) return [];

    return [
      {
        id: binding.id,
        modelObjectId: binding.modelObjectId,
        glassObjectId,
        lightId: `bulb-light-${binding.id}`,
      },
    ];
  },
);

const BULB_EFFECT_ID = "horror-bulbs";

export default function App() {
  const { objectBindings, updateObjectBindings } =
    useObjectBindings(initialObjectBindings);
  const { sceneConfig, updateSceneConfig } =
    useSceneConfig(horrorSceneConfig);
  const effects = useViewerEffects();
  const {
    addPointLight,
    flicker,
    overrideEffect,
    setMaterial: setRuntimeMaterial,
    stopEffect,
    updatePointLight,
  } = effects;
  const camera = useViewerCamera({ initialTarget: [-32, -3, 0] });
  const [preset, setPreset] = useState<FlickerPreset>("failing");
  const [powerOn, setPowerOn] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  const framedSceneRef = useRef<ViewerReadyState["scene"]>(null);
  const settings = PRESETS[preset];
  const effectChannels = useMemo<ViewerEffectChannels>(
    () => ({
      materials: [
        {
          targets: BULBS.map((bulb) => bulb.modelObjectId),
          values: {
            emissiveIntensity: [0.02, settings.emissiveStrength],
          },
        },
        {
          targets: BULBS.map((bulb) => bulb.glassObjectId),
          values: {
            emissiveIntensity: [0, settings.emissiveStrength * 0.16],
          },
        },
      ],
      lights: [
        {
          lights: BULBS.map((bulb) => bulb.lightId),
          intensity: [0, settings.lightStrength],
        },
      ],
    }),
    [settings],
  );

  useEffect(() => {
    const baselineLevel = powerOn ? settings.base : 0;
    const edits: BindingEdit[] = [
      {
        ids: BULBS.map((bulb) => bulb.modelObjectId),
        patch: material({
          baseColor: "#2a1005",
          emissive: WARM_GLOW,
          emissiveIntensity: powerOn
            ? 0.02 + baselineLevel * settings.emissiveStrength
            : 0,
        }),
      },
      {
        ids: BULBS.map((bulb) => bulb.glassObjectId),
        patch: material({
          baseColor: "#160b06",
          emissive: WARM_GLOW,
          emissiveIntensity: powerOn
            ? baselineLevel * settings.emissiveStrength * 0.16
            : 0,
        }),
      },
    ];

    updateObjectBindings(edits);
  }, [powerOn, settings, updateObjectBindings]);

  useEffect(() => {
    const mood = SCENE_MOODS[preset];
    updateSceneConfig({
      environment: { intensity: mood.environmentIntensity },
      postProcessing: {
        bloom: {
          intensity: mood.bloomIntensity,
          luminanceThreshold: mood.bloomThreshold,
        },
        vignette: { darkness: mood.vignetteDarkness },
      },
    });
  }, [preset, updateSceneConfig]);

  useEffect(() => {
    if (!powerOn) {
      stopEffect(BULB_EFFECT_ID);
      setRuntimeMaterial(
        BULBS.map((bulb) => bulb.modelObjectId),
        { emissiveIntensity: 0 },
      );
      setRuntimeMaterial(
        BULBS.map((bulb) => bulb.glassObjectId),
        { emissiveIntensity: 0 },
      );
      BULBS.forEach((bulb) => {
        updatePointLight(bulb.lightId, { intensity: 0 });
      });
      return;
    }

    flicker(effectChannels, {
      id: BULB_EFFECT_ID,
      minLevel:
        preset === "lit"
          ? 1
          : Math.max(0.02, settings.base - settings.variance),
      maxLevel:
        preset === "lit"
          ? 1
          : Math.min(1.2, settings.base + settings.variance),
      interval: preset === "lit" ? 500 : [65, 320],
      response: settings.response,
      blackoutChance: settings.blackoutChance,
      flashChance: settings.flashChance,
      flashLevel: 1.18,
      synchronized: preset !== "possessed",
    });

    return () => {
      stopEffect(BULB_EFFECT_ID);
    };
  }, [
    effectChannels,
    flicker,
    powerOn,
    preset,
    setRuntimeMaterial,
    settings,
    stopEffect,
    updatePointLight,
  ]);

  const setupBulbLights = useCallback((viewer: ViewerReadyState) => {
    if (!viewer.scene || framedSceneRef.current === viewer.scene) return;
    framedSceneRef.current = viewer.scene;

    BULBS.forEach((bulb) => {
      addPointLight({
        id: bulb.lightId,
        target: bulb.modelObjectId,
        color: WARM_GLOW,
        decay: 2,
        distance: 38,
        intensity: 0,
      });
    });
  }, [addPointLight]);
  const { handleViewerReady } = useViewerConnection(
    effects,
    camera,
    setupBulbLights,
  );

  return (
    <main className="demo-page horror-demo">
      {!LICENSE_KEY && (
        <div className="demo-license-warning">
          Set <code>VITE_LICENSE_KEY</code> before running this demo.
        </div>
      )}

      <DemoPageHeader
        title="Light Flicker"
        description="Nine bulbs switch between synchronized circuit failures and independently possessed flicker. BindingBuilder exports and React Immersive runtime APIs turn a static GLB into a horror-film lighting rig."
        features={[
          "useObjectBindings",
          "useSceneConfig",
          "useViewerConnection",
          "useViewerEffects",
          "Atomic material presets",
          "Model-attached point lights",
          "Synchronized runtime effects",
          "BindingBuilder exports",
        ]}
      />

      <ViewerWindow>
        <div className="horror-stage">
          <ModelViewer
            modelUrl="/bulbs.glb"
            licenseKey={LICENSE_KEY}
            objectBindings={objectBindings}
            sceneConfig={sceneConfig}
            onViewerReady={handleViewerReady}
            backgroundColor="#030407"
            camera={{ position: [65, 18, 82], fov: 44 }}
            shadows={false}
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showResetButton
            showDownloadButton={false}
            showMouseController={false}
            highlightOnHover={false}
            zoomOnSelected={false}
            performanceProfile="auto"
            maxDpr={2}
            refitOnResize={false}
          />

          <div className="horror-vignette" />

          <button
            type="button"
            className="panel-toggle"
            onClick={() => setControlsOpen((value) => !value)}
            aria-expanded={controlsOpen}
            aria-label={
              controlsOpen
                ? "Hide Flicker controls"
                : "Show Flicker controls"
            }
          >
            {controlsOpen ? "Close" : "Flicker controls"}
          </button>

          <section
            className={`flicker-panel${controlsOpen ? " is-open" : ""}`}
          >
            <div className="panel-heading">
              <div>
                <div className="panel-kicker">Circuit</div>
                <h2>Unstable power</h2>
              </div>
            </div>

            <div className="preset-grid">
              {(Object.keys(PRESETS) as FlickerPreset[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={preset === key ? "is-active" : ""}
                  onClick={() => setPreset(key)}
                  aria-pressed={preset === key}
                >
                  {PRESETS[key].label}
                </button>
              ))}
            </div>

            <div className="action-grid">
              <button
                type="button"
                onClick={() => overrideEffect(BULB_EFFECT_ID, 0, 900)}
                disabled={!powerOn}
              >
                Blackout
              </button>
              <button
                type="button"
                className="surge-button"
                onClick={() => overrideEffect(BULB_EFFECT_ID, 4, 800)}
                disabled={!powerOn}
              >
                Surge
              </button>
              <button
                type="button"
                className="power-button"
                onClick={() => setPowerOn((value) => !value)}
                aria-label={powerOn ? "Turn power off" : "Turn power on"}
                aria-pressed={powerOn}
              >
                Power
              </button>
            </div>

            <p className="panel-note">
              React Immersive owns the material presets, scene mood, runtime
              flicker, and point lights. The demo never mutates a Three.js node
              or material directly.
            </p>
          </section>

          <p className="demo-credit">
            <a
              href="https://skfb.ly/6YEWL"
              target="_blank"
              rel="noreferrer"
            >
              &quot;incandescent bulbs&quot;
            </a>{" "}
            by Helindu is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              Creative Commons Attribution
            </a>
          </p>
        </div>
      </ViewerWindow>
    </main>
  );
}
