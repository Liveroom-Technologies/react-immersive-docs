import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ModelViewer,
  material,
  useObjectBindings,
  useSceneConfig,
  type BindingEdit,
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

type BulbRuntime = {
  level: number;
  target: number;
  hold: number;
};

type BulbDefinition = {
  id: string;
  modelObjectId: string;
  glassObjectId: string;
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

function clamp(value: number, min = 0, max = 1.2): number {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

const BULBS: BulbDefinition[] = Object.values(initialObjectBindings).flatMap(
  (binding) => {
    const match = /^Cylinder(\d+)_Material008_0$/.exec(
      binding.modelObjectId,
    );
    if (!match) return [];

    const glassObjectId = `Cylinder${String(Number(match[1]) - 3).padStart(3, "0")}_Material001_0`;
    if (!initialObjectBindings[glassObjectId]) return [];

    return [
      {
        id: binding.id,
        modelObjectId: binding.modelObjectId,
        glassObjectId,
      },
    ];
  },
);

type GlowMaterial = {
  emissiveIntensity?: number;
};

type GlowNode = {
  material?: GlowMaterial | GlowMaterial[];
  matrixWorld?: { elements: ArrayLike<number> };
  updateWorldMatrix?: (updateParents: boolean, updateChildren: boolean) => void;
};

type PointLightHandle = {
  intensity: number;
  position: { set: (x: number, y: number, z: number) => unknown };
};

function setNodeIntensity(
  node: ViewerReadyState["nodeRefs"][string] | undefined,
  intensity: number,
): void {
  const material = (node as GlowNode | undefined)?.material;
  if (!material) return;

  const materials = Array.isArray(material) ? material : [material];
  materials.forEach((entry) => {
    entry.emissiveIntensity = intensity;
  });
}

function advanceRuntime(
  runtime: BulbRuntime,
  powerOn: boolean,
  preset: FlickerPreset,
  settings: FlickerSettings,
  forcedBlackout: boolean,
  forcedSurge: boolean,
): number {
  if (!powerOn) {
    runtime.level = 0;
    runtime.target = 0;
    runtime.hold = 1;
    return 0;
  }

  if (forcedBlackout) {
    runtime.target = 0;
    runtime.hold = 1;
  } else if (forcedSurge) {
    runtime.target = randomBetween(3.2, 4);
    runtime.hold = 1;
  } else if (preset === "lit") {
    runtime.level = 1;
    runtime.target = 1;
    runtime.hold = 1;
    return 1;
  } else if (runtime.hold <= 0) {
    const roll = Math.random();

    if (roll < settings.blackoutChance) {
      runtime.target = randomBetween(0, 0.035);
      runtime.hold = Math.floor(randomBetween(2, 9));
    } else if (roll < settings.blackoutChance + settings.flashChance) {
      runtime.target = randomBetween(0.92, 1.18);
      runtime.hold = Math.floor(randomBetween(1, 3));
    } else {
      runtime.target = clamp(
        settings.base + randomBetween(-settings.variance, settings.variance),
      );
      runtime.hold = Math.floor(randomBetween(1, 6));
    }
  } else {
    runtime.hold -= 1;
  }

  const response = forcedSurge
    ? 0.92
    : runtime.target > runtime.level
      ? Math.min(0.92, settings.response + 0.12)
      : settings.response;
  const electricalNoise = randomBetween(
    -settings.variance * 0.08,
    settings.variance * 0.08,
  );

  runtime.level = clamp(
    runtime.level +
      (runtime.target - runtime.level) * response +
      electricalNoise,
    0,
    forcedSurge ? 4 : 1.2,
  );
  return runtime.level;
}

function syncPointLight(
  pointLight: PointLightHandle | null | undefined,
  node: ViewerReadyState["nodeRefs"][string] | undefined,
  intensity: number,
): void {
  if (!pointLight || !node) return;

  const anchor = node as GlowNode;
  anchor.updateWorldMatrix?.(true, false);
  const elements = anchor.matrixWorld?.elements;
  if (!elements) return;

  pointLight.position.set(elements[12], elements[13], elements[14]);
  pointLight.intensity = intensity;
}

export default function App() {
  const { objectBindings, updateObjectBindings } =
    useObjectBindings(initialObjectBindings);
  const { sceneConfig, updateSceneConfig } =
    useSceneConfig(horrorSceneConfig);
  const [preset, setPreset] = useState<FlickerPreset>("failing");
  const [powerOn, setPowerOn] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  const runtimeRef = useRef<BulbRuntime[]>(
    BULBS.map((_, index) => ({
      level: 0.55 + (index % 3) * 0.1,
      target: 0.65,
      hold: index % 4,
    })),
  );
  const sharedFailingRuntimeRef = useRef<BulbRuntime>({
    level: 0.65,
    target: 0.65,
    hold: 0,
  });
  const blackoutUntilRef = useRef(0);
  const surgeUntilRef = useRef(0);
  const nodeRefsRef = useRef<ViewerReadyState["nodeRefs"]>({});
  const pointLightsRef = useRef<Array<PointLightHandle | null>>([]);
  const framedSceneRef = useRef<ViewerReadyState["scene"]>(null);
  const settings = PRESETS[preset];

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
    const tick = () => {
      const now = performance.now();
      const forcedBlackout = now < blackoutUntilRef.current;
      const forcedSurge = now < surgeUntilRef.current;

      const sharedFailingLevel =
        preset === "failing"
          ? advanceRuntime(
              sharedFailingRuntimeRef.current,
              powerOn,
              preset,
              settings,
              forcedBlackout,
              forcedSurge,
            )
          : null;
      const nextLevels =
        sharedFailingLevel !== null
          ? BULBS.map(() => sharedFailingLevel)
          : runtimeRef.current.map((runtime) =>
              advanceRuntime(
                runtime,
                powerOn,
                preset,
                settings,
                forcedBlackout,
                forcedSurge,
              ),
            );

      BULBS.forEach((bulb, index) => {
        const level = nextLevels[index];
        const filamentNode = nodeRefsRef.current[bulb.modelObjectId];
        setNodeIntensity(
          filamentNode,
          powerOn ? 0.02 + level * settings.emissiveStrength : 0,
        );
        setNodeIntensity(
          nodeRefsRef.current[bulb.glassObjectId],
          powerOn ? level * settings.emissiveStrength * 0.16 : 0,
        );

        syncPointLight(
          pointLightsRef.current[index],
          filamentNode,
          level * settings.lightStrength,
        );
      });

    };

    tick();
    const interval = window.setInterval(tick, 65);
    return () => window.clearInterval(interval);
  }, [powerOn, preset, settings]);

  const handleViewerReady = useCallback((viewer: ViewerReadyState) => {
    nodeRefsRef.current = viewer.nodeRefs;
    if (!viewer.scene || framedSceneRef.current === viewer.scene) return;
    framedSceneRef.current = viewer.scene;
    void viewer.controls.setLookAt(-32, 10, 95, -32, -3, 0, false);
  }, []);

  const sceneLights = useMemo(
    () => (
      <>
        <ambientLight color="#526080" intensity={0.006} />
        <directionalLight
          color="#52617f"
          intensity={0.02}
          position={[20, 30, 25]}
        />
        {BULBS.map((bulb, index) => (
          <pointLight
            key={bulb.id}
            ref={(light) => {
              pointLightsRef.current[index] = light;
            }}
            color={WARM_GLOW}
            decay={2}
            distance={38}
            intensity={0}
            position={[0, 0, 0]}
          />
        ))}
      </>
    ),
    [],
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
          "Atomic material presets",
          "onViewerReady runtime effects",
          "Synchronized point lights",
          "BindingBuilder exports",
        ]}
      />

      <ViewerWindow>
        <div className="horror-stage">
          <ModelViewer
            modelUrl="/bulbs.glb"
            licenseKey={LICENSE_KEY}
            objectBindings={objectBindings}
            lights={sceneLights}
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
            renderMode="always"
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
                onClick={() => {
                  blackoutUntilRef.current = performance.now() + 900;
                }}
                disabled={!powerOn}
              >
                Blackout
              </button>
              <button
                type="button"
                className="surge-button"
                onClick={() => {
                  surgeUntilRef.current = performance.now() + 800;
                }}
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
              React Immersive owns the persistent material presets and scene
              mood. Its onViewerReady node handles drive only the rapid glow
              intensity and synchronized point lights.
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
