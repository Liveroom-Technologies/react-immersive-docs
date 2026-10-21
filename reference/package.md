# React Immersive — 3D model viewer for React

`@liveroom-tech/react-immersive` is a React-based 3D model viewer for interactive GLB, GLTF, OBJ, FBX, USDZ, STL, and PLY assets. It renders a model with React Three Fiber, lets users click named meshes, shows a built-in side panel for the selected object, and supports per-object actions such as color changes, texture uploads, and visibility toggles.

[AI Agent Guide](https://react-immersive.liveroom.dev/docs/agent-guide) · [Markdown index](https://react-immersive.liveroom.dev/llms.txt) · [Website](https://react-immersive.liveroom.dev) · [Documentation](https://react-immersive.liveroom.dev/docs) · [Live editor](https://react-immersive.liveroom.dev/editor) · [npm](https://www.npmjs.com/package/@liveroom-tech/react-immersive) · [GitHub](https://github.com/Liveroom-Technologies/react-immersive-docs)

Documentation baseline: **5.2.0 · React 19**. See the
[Vite](https://react-immersive.liveroom.dev/docs/frameworks/vite) and
[Next.js](https://react-immersive.liveroom.dev/docs/frameworks/nextjs) setup guides
for complete first-render files and the
[version notes](https://react-immersive.liveroom.dev/docs/releases) before upgrading.

## What It Does

The library currently exports:

```ts
import {
  material,
  ModelViewer,
  patchBindings,
  patchSceneConfig,
  useObjectBinding,
  useObjectBindingIds,
  useObjectBindings,
  useSceneConfig,
  useShareableViewerState,
  useViewer,
  useViewerActions,
  useViewerAnimations,
  useViewerCamera,
  useViewerConnection,
  useViewerEffects,
  useViewerHover,
  useViewerIsolation,
  useViewerModel,
  useViewerSelection,
  MATERIAL_BLENDING_MODES,
  MATERIAL_SIDES,
} from "@liveroom-tech/react-immersive";
import { SimpleModelViewer } from "@liveroom-tech/react-immersive/simple-model-viewer";
import { BindingBuilder } from "@liveroom-tech/react-immersive/binding-builder";
```

Each component has its own entry point, so an app downloads only the ones it
imports.

It also exports types for `ObjectBinding`, `ObjectBindingMaterial`, `ObjectBindingsController`, `ObjectActionEvent`, `ObjectTransformSpace`, `SceneConfig`, `SceneConfigPatch`, `SceneConfigController`, `AnimationControls`, `CinematicConfig` / `CinematicWaypoint`, and related shapes used throughout this document.

`ModelViewer` provides:

- GLB/GLTF, OBJ/MTL, FBX, USDZ, STL, and PLY model rendering through `@react-three/fiber`
- camera-driven 3D Tiles streaming through `tilesetUrl`, with configurable screen-space error and bounded tile cache
- orbit/pan/zoom camera controls via `CameraControls`
- auto-fits the model on load, and re-fits when the canvas is resized (window resize, device rotation, or a panel opening/closing), toggleable through `refitOnResize` to instead preserve the user's orbit/zoom
- scene lighting through `sceneConfig.lighting`, with the `sceneLight` helper and a runtime lights controller
- optional custom camera configuration through a `camera` prop
- optional custom background color through a `backgroundColor` prop
- optional shadow rendering toggle through a `shadows` prop (on by default)
- optional on-screen movement controller through `showMouseController` and its tuning props
- optional canvas-focused keyboard camera navigation through `enableKeyboardNavigation`
- keyboard object navigation, screen-reader selection announcements, and reduced motion for visitors who ask for it (see [Accessibility](#accessibility))
- optional top-right camera orientation control through `showViewGizmo`
- optional per-object move and rotate gizmo through `moveModeEnabled`, with World/Local axis alignment through `objectTransformSpace`
- optional custom left object data panel through `customObjectBindingDataPanel`
- optional custom right scene objects panel through `customSceneObjectsPanel`
- your own UI over the 3D view through `overlay`, and react-three-fiber content inside the scene through `unsafe_sceneChildren`
- optional hiding of either built-in panel through `showObjectBindingDataPanel` and `showSceneObjectsPanel`
- optional model export button through `showDownloadButton` and `downloadFilename`, opt-in PNG capture through `preserveDrawingBuffer`, plus an independent `showResetButton` toggle for the rest of that action bar
- an optional UV Checker toolbar button through `showUvCheckerButton`, for inspecting UV scale, stretching, seams, orientation, and missing UV0 coordinates directly in `ModelViewer`
- glTF material variants (`KHR_materials_variants`) as swatch rows, one per option group, through `showMaterialVariants`, selected by `sceneConfig.model.activeVariants`
- distance, angle, polygon area, and point-to-plane measurements with vertex/edge snapping and bounding dimensions through `showMeasureTools` and `measurementUnit`
- an exploded-view slider that slides each bound part outward from the model center to reveal interior/assembly structure through `showExplodeControls`
- isolation that ghosts or hides everything but the objects you focus on, through `isolation` / `onIsolationChange` and `showIsolateControls`
- a section cut that opens the model along an axis, with a draggable plane, through `showSectionTools` and `sceneConfig.section`
- a cinematic auto-camera that glides the camera along authored waypoints (or a zero-config showcase orbit), like a film, through `cinematic`, with a play/pause control that yields the moment you touch the camera
- video export of a cinematic pass or turntable revolution, through the download menu or `captureVideo`, as browser-supported WebM/MP4 or an animated GIF
- `CompareViewer`, which shows two configurations (or two models) with one camera, as a before/after slider or side by side
- opt-in WebGPU rendering through `perf={{ webgpu: true }}`, falling back to WebGL where the browser lacks it
- lazy loading: a viewer starts its 3D view when it's near the screen, and a page of viewers stays within the browser's limit on 3D views, with a `poster` image and an optional "View in 3D" button (`reveal`) until the view is there (see [Lazy loading and posters](#lazy-loading-and-posters))
- a guided-tour control cluster (Previous/Stop/Next) for stepping through annotations, toggleable via `showAnnotationNavigation`
- optional annotation detail popups on marker hover via `showAnnotationOnHover`
- PBR, Matcap, and UV Checker renderer modes, with the checker exposing UV stretching, seams, rotation, and missing UV0 data directly on the model
- a `sceneConfig` prop accepting the same scene-wide config (lighting, environment, background, post-processing, animations, annotations) authored by `BindingBuilder`'s Scene tab
- WebGL context-loss recovery with a reload button and automatic rebuild when the context returns, keeping the camera and the visitor's changes
- render-loop and perf tuning through `renderMode`, `maxDpr`, `performanceProfile`, and compressed-asset decoder options (`dracoDecoderPath`, `ktx2TranscoderPath`, `meshopt`)
- WebXR "View in your space" (AR) and "Enter VR" through `enableXR`, with tap-to-place, pinch-to-resize, and twist-to-rotate AR placement gestures
- mesh selection by object name
- a built-in left side panel for the selected object
- object-specific action buttons driven by `objectBindings`
- built-in color picking that commits the chosen hex into `objectBindings.style.material.baseColor`
- built-in texture upload that commits a URL into `objectBindings.style.material.texture.path` (blob URL by default, or a durable URL when `onTextureUpload` is provided)
- per-object `MeshPhysicalMaterial` overrides for metalness, roughness, emissive, normal/bump, AO, displacement, clearcoat, sheen, anisotropy, specular, transmission, thickness, reflectivity, sidedness, and limited blending modes
- per-object visibility toggling through `objectBindings.visible`
- decals: images and text printed on an object's surface through `objectBindings.decals`, placed from the surface point pointer events report
- data-driven looks through `sceneConfig.styleRules`: colour scales from metrics, material overrides by status or metadata, and pulsing alarms
- hover and selected-state highlighting
- external selection state control through `selectedObject` and `onObjectSelect`
- hover callbacks through `onObjectHover`
- double-click, right-click, and touch long-press callbacks through `onObjectDoubleClick` and `onObjectContextMenu`
- model-ready callbacks through `onModelLoaded`
- model-load error callbacks through `onLoadError`
- camera change callbacks through `onCameraChange`
- viewer-ready callbacks through `onViewerReady`
- action event callbacks through `onAction`
- opt-in engagement analytics through `onEngagement`, with `debugEngagement` console logging
- animation playback for GLB/GLTF, FBX, and USDZ models with supported embedded animations through `onAnimationsReady`
- annotation marker callbacks through `onAnnotationsChange` and controlled/uncontrolled `activeAnnotation` / `onActiveAnnotationChange`

`BindingBuilder` provides:

- a design-time UI for generating starter bindings from GLB, GLTF, OBJ, FBX, USDZ, STL, and PLY assets, gated by `licenseKey` (see "`BindingBuilder` licensing & plan tiers" below)
- demo model loading or custom `.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, `.ply`, or model ZIP bundle upload
- editable binding fields for identity, basics, style, actions, metrics, metadata, and saved camera state
- per-object move and rotate authoring with a geometry-centered pivot, World/Local axes, numeric fields, and restore-to-authored-transform support
- a one-click material preset gallery (wood, metal, chrome, glass, plastic, fabric, ceramic, concrete, etc.)
- undo/redo for both the Object tab's bindings and the Scene tab's config, independently, with `Cmd/Ctrl+Z` / `Cmd/Ctrl+Shift+Z` shortcuts
- a Scene tab for the same `sceneConfig` shape `ModelViewer` accepts (lighting, environment, background, post-processing, animations, annotations, and cinematic camera paths)
- a Cinematic sub-tab for authoring a camera path visually, frame the model, capture the current view as a waypoint, reorder/preview/delete waypoints, and toggle loop/auto-play; stored on `sceneConfig.cinematic` and replayed by `ModelViewer`'s `cinematic` prop
- import a previously exported `objectBindings.json` or `sceneConfig.json` and merge it back onto the current model/config
- live preview using `ModelViewer`
- export as JSON or TypeScript, bundled into a `.zip` with a `materials/` folder automatically when any texture field was filled by file upload, otherwise a plain file
- license-tier gating for some editor features (texture maps, environment lighting/backgrounds, wireframe preview, animation configuration, annotations, style rules, post-processing)

`SimpleModelViewer` provides:

- a lightweight GLB/GLTF/OBJ/FBX/USDZ/STL/PLY viewer with no bindings or actions that does not require a `licenseKey`
- optional local `.glb`, standalone/data-URI `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, `.ply`, or model ZIP bundle upload mode for ad-hoc inspection without relying on the `modelUrl` asset
- built-in scene objects panel with search and visibility toggles
- a built-in environment/scene settings panel (background color, environment preset, auto-rotate, exposure, ambient + directional light) toggleable via `showSceneSettingsPanel`, with each control's initial value seedable via props
- click-to-select and fit-to-object focus behavior
- optional background color and model lifecycle callbacks
- a smaller API surface for simple inspection use cases

## Why `objectBindings` Exists

`objectBindings` solves the gap between a raw GLB/GLTF file and an interactive
product experience. A model file gives you geometry, materials, and mesh node
names. It does not know that `"CarBody"` is configurable, that `"FrontDoor"`
should open a panel, or that `"Wall_A"` should expose metadata and a saved
camera view.

`objectBindings` is the bridge between those raw mesh names and your app's
domain model. It is a serializable record, keyed by mesh node name, that lets
you:

- declare which meshes are interactive
- carry live render state such as visibility, local transforms, and per-object material overrides
- attach actions like `change-color`, `change-material`, and `toggle-visibility`
- store metadata and metrics alongside the 3D scene
- save camera framing so object focus can use curated views

Because it is plain data, bindings can be authored by hand, generated through
`BindingBuilder`, stored in a database, versioned as JSON, and round-tripped
through `onObjectBindingsChange` so your app state and the 3D scene stay in
sync.

## Why It Is Worth The Setup

At first glance, `objectBindings` can look like extra setup. That is true only
if your goal is to render a model and do nothing else with it.

If the model needs to behave like part of your application, bindings stop being
overhead and start being the abstraction that keeps the project maintainable.
They give you a single source of truth instead of scattering logic across mesh
refs, material mutations, raycasting handlers, and custom UI glue.

The short version:

- without bindings, the model is a visual asset
- with bindings, the model becomes application state

If you only need a viewer, use `SimpleModelViewer`. If you need selection,
customization, persistence, metadata, object-level actions, or app-driven
behavior, bindings are usually the right tradeoff.

## Example Applications Where Bindings Shine

- product configurators for cars, furniture, apparel, appliances, or custom goods
- e-commerce customization flows where meshes map to real purchasable options
- CPQ and sales tools where 3D parts correspond to business rules and pricing
- real estate and interior design tools with clickable rooms, walls, fixtures, and finishes
- industrial and engineering viewers for assemblies, equipment, and maintenance workflows
- training and guided walkthroughs with annotations, steps, and saved object viewpoints
- digital twins and operational dashboards where scene parts map to live assets, metrics, and alerts
- smart building controls where lights, switches, sensors, HVAC units, and doors map to real-time app behavior

The pattern is consistent: if users need to say "this exact part of the model
has its own meaning, state, or behavior," object bindings are a strong fit.

## Installation

```bash
npm install @liveroom-tech/react-immersive three @react-three/fiber
```

Import the stylesheet for each component you use, once, from your
application root (for example, Next.js `app/layout.tsx`):

```tsx
import "@liveroom-tech/react-immersive/styles.css"; // ModelViewer
import "@liveroom-tech/react-immersive/simple-model-viewer.css"; // SimpleModelViewer
import "@liveroom-tech/react-immersive/binding-builder.css"; // BindingBuilder
```

The styles ship as a static CSS file rather than a runtime-injected `<style>`
tag, so a strict CSP does not need `style-src 'unsafe-inline'`. Tailwind is not
required in the consuming app.

If a component's stylesheet is missing, it renders unstyled, and in
development it logs a console warning naming the import to add.

Peer dependencies, which your app provides so there's exactly one copy of each:

- `react` and `react-dom` 19
- `three` 0.184
- `@react-three/fiber` 9

Everything else, including drei, post-processing, and WebXR support, installs
with the package.

`ModelViewer` and `BindingBuilder` require a `licenseKey` at runtime (see [`licenseKey`](#licensekey)). Get one from the Developer Portal, see [Resources](#resources) below.

## Resources

- [Developer Portal](https://react-immersive.liveroom.dev), sign in, pick a plan, and generate a `licenseKey`
- [Docs](https://react-immersive.liveroom.dev/docs), full reference for every component, hook, and prop
- [Examples & community repo](https://github.com/liveroom-technologies/react-immersive-docs/examples), public docs source, starter examples, and community resources
- [Report a bug / request a feature](https://github.com/liveroom-technologies/react-immersive-docs/issues), for public bug reports, docs issues, and feature requests
- [Discussions & Q&A](https://github.com/liveroom-technologies/react-immersive-docs/discussions), ask questions, share ideas, and compare approaches
- [Private support / security](mailto:developers@liveroom.xyz?subject=React%20Immersive%20Support), for license, account, confidential customer, or security-sensitive issues
- [Live editor](https://react-immersive.liveroom.dev/editor), try `BindingBuilder` in the browser without installing anything
- [npm package](https://www.npmjs.com/package/@liveroom-tech/react-immersive)

## Quick Start

The shortest working viewer lets `ModelViewer` generate the bindings itself:

```tsx
import { ModelViewer } from "@liveroom-tech/react-immersive";

export default function Example() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <ModelViewer
        modelUrl="/model.glb"
        licenseKey="your-license-key"
      />
    </div>
  );
}
```

Every mesh in the model can then be hovered and selected, and opens the side
panel with Change Color, Change Material, and Toggle Visibility (or, for meshes
whose names contain "light", Toggle Light, Change Light Color, and Set
Brightness). See
[Generating bindings automatically](#generating-bindings-automatically) for how
to keep and refine the generated bindings.

To control the viewer from your own UI, use `useViewer`. It connects every
viewer hook to `ModelViewer` at once:

```tsx
import { ModelViewer, useViewer } from "@liveroom-tech/react-immersive";

export default function Configurator() {
  const viewer = useViewer();

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <ModelViewer
        modelUrl="/model.glb"
        licenseKey="your-license-key"
        {...viewer.props}
      />
      <button
        onClick={() => viewer.bindings.setBaseColor({ group: "paint" }, "#b91c1c")}
      >
        Paint it red
      </button>
      <button onClick={() => viewer.camera.resetView()}>Reset view</button>
    </div>
  );
}
```

`viewer.bindings`, `viewer.selection`, `viewer.hover`, `viewer.camera`,
`viewer.model`, `viewer.animations`, `viewer.actions`, `viewer.scene`,
`viewer.isolation`, `viewer.effects`, and `viewer.connection` are the results of the hooks they're
named after (`useObjectBindings`, `useViewerSelection`, and so on), so
everything below applies to them. Without a `bindings` option, `useViewer`
generates bindings from the model like `objectBindings="auto"`; pass
`useViewer({ bindings })` to start from your own. It also accepts
`sceneConfig`, `camera` (the `useViewerCamera` options), and `onAction`,
`onObjectSelect`, `onObjectHover`, and `onLoadError` callbacks. `sceneConfig`
is passed to `ModelViewer` only once you've supplied one or changed the scene
through `viewer.scene`, so the default scene behaves as if none were passed.
Props set on `ModelViewer` after the spread take precedence.

The full example below authors bindings by hand and wires up every hook
individually, which is what `useViewer` does for you. Wire them yourself when
state lives elsewhere, such as bindings owned by a store:

```tsx
import {
  ModelViewer,
  useObjectBinding,
  useObjectBindings,
  useViewerActions,
  useViewerAnimations,
  useViewerCamera,
  useViewerHover,
  useViewerModel,
  useViewerSelection,
} from "@liveroom-tech/react-immersive";
import { defineObjectBindings } from "@liveroom-tech/react-immersive/utils";

const initialBindings = defineObjectBindings({
  CarBody: {
    id: "car-body",
    modelObjectId: "CarBody",
    type: "body",
    label: "Car Body",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        texture: {
          path: "/materials/oak-wood.jpg",
        },
      },
    },
    metrics: {},
    metadata: {
      category: "exterior",
    },
    actions: [
      { id: "change-color", label: "Change Color", type: "command" },
      { id: "change-material", label: "Change Material", type: "command" },
      { id: "toggle-visibility", label: "Toggle Visibility", type: "command" },
      {
        id: "toggle-body",
        label: "Toggle Body",
        type: "command",
        effects: [{ target: "CarBody", visibility: "toggle" }],
      },
    ],
  },
});

export default function Example() {
  const bindings = useObjectBindings(initialBindings);
  const {
    objectBindings,
    setObjectBindings,
    hiddenObjects,
    toggleObjectVisibility,
  } = bindings;
  const { selectedObjectBinding, handleObjectSelect } = useViewerSelection();
  const { hoveredObjectBinding, handleHoveredObject } = useViewerHover();
  const camera = useViewerCamera();
  const {
    cameraState,
    resetView,
    focusObject,
    fitScene,
    setCameraTarget,
    handleCameraChange,
    handleViewerReady,
  } = camera;
  const {
    isLoading,
    isReady,
    error,
    bounds,
    objectCount,
    handleModelLoaded,
    handleLoadError,
  } = useViewerModel();
  const animations = useViewerAnimations();
  const { getActionsForObject, handleAction, runAction } = useViewerActions({
    bindings,
    camera,
    animations,
    onAction: (event) => {},
  });
  const focusedBinding = useObjectBinding(objectBindings, "car-body");

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <ModelViewer
        modelUrl="/model.glb"
        licenseKey="your-license-key"
        objectBindings={objectBindings}
        selectedObject={selectedObjectBinding}
        onObjectSelect={handleObjectSelect}
        onObjectHover={handleHoveredObject}
        onCameraChange={handleCameraChange}
        onModelLoaded={handleModelLoaded}
        onLoadError={handleLoadError}
        onObjectBindingsChange={setObjectBindings}
        onViewerReady={handleViewerReady}
        onAnimationsReady={animations.handleAnimationsReady}
        onAction={handleAction}
      />

      <button onClick={() => toggleObjectVisibility("car-body")}>
        Toggle Visibility
      </button>
      <button onClick={() => runAction("car-body", "toggle-body")}>
        Run declarative action
      </button>
      <button onClick={() => resetView()}>Reset view</button>
      <button onClick={() => focusObject("car-body")}>Focus Object</button>
      <button onClick={() => fitScene()}>Fit scene</button>
      <button onClick={() => setCameraTarget([0, 0, 0])}>Target origin</button>
      <pre>{JSON.stringify(getActionsForObject("car-body"), null, 2)}</pre>
      <pre>{JSON.stringify(cameraState, null, 2)}</pre>
      <pre>
        {JSON.stringify(
          { isLoading, isReady, error, bounds, objectCount },
          null,
          2,
        )}
      </pre>
      <pre>{JSON.stringify(hiddenObjects, null, 2)}</pre>
      <pre>{JSON.stringify(hoveredObjectBinding, null, 2)}</pre>
      <pre>{JSON.stringify(focusedBinding, null, 2)}</pre>
    </div>
  );
}
```

If you want a simple helper for selection state, the library also exports:

```tsx
const {
  selectedObjectBinding,
  setSelectedObjectBinding,
  handleObjectSelect,
  clearSelection,
} = useViewerSelection();
```

If you want to resolve a binding from an object identifier, the library also exports:

```tsx
const binding = useObjectBinding(objectBindings, "car-body");
```

`useObjectBinding` checks, in order:

- the object binding map key
- `binding.id`
- `binding.modelObjectId`

If you want a flat list of every `modelObjectId` across your bindings, the library also exports:

```tsx
const ids = useObjectBindingIds(objectBindings);
// → ["CarBody", "WheelFL", "WheelFR", ...]
```

If you want one state owner for binding patches, materials, and visibility, use `useObjectBindings`:

```tsx
const {
  objectBindings,
  setObjectBindings,
  updateObjectBindings,
  selectObjectBindings,
  selectObjectBindingIds,
  setMaterial,
  setBaseColor,
  setTexture,
  clearTexture,
  copyMaterial,
  resetMaterial,
  getMaterial,
  setTransform,
  resetTransform,
  updateMetadata,
  addDecal,
  updateDecal,
  removeDecal,
  hiddenObjects,
  hiddenObjectIds,
  hideObject,
  showObject,
  toggleObjectVisibility,
  isObjectHidden,
  clearHiddenObjects,
} = useObjectBindings(initialBindings);

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onObjectBindingsChange={setObjectBindings}
/>;
```

`useObjectBindings` owns the state used by the viewer. Every setter uses a functional update, so consecutive material, visibility, and general binding updates in the same tick compose instead of overwriting each other.

Object identifiers accepted by its methods can be:

- the object binding map key
- `binding.id`
- `binding.modelObjectId`

You can also target bindings by a shared `group`, `tag`, or object `type`. Groups
represent one named set, while tags let a binding participate in several sets:

```tsx
updateObjectBindings({ group: "paint" }, { selectable: false });
setBaseColor({ tag: "exterior" }, "#2563eb");
hideObject({ type: "wheel" });

const exteriorBindings = selectObjectBindings({ tag: "exterior" });
const paintIds = selectObjectBindingIds({ group: "paint" });

setTexture({ group: "screens" }, "/images/dashboard.png");
clearTexture({ tag: "printable" }, "baseColor");
copyMaterial("wheel-front", { group: "wheels" });

setTransform("door-left", {
  rotation: [0, Math.PI / 2, 0],
});
resetTransform("door-left");
updateMetadata({ group: "lights" }, { state: "on" });
```

When a parent or store owns the state, use the pure `selectBindings` and
`selectBindingKeys` helpers for the same queries, and `patchBindings` to update
all matches. Import these helpers from
`@liveroom-tech/react-immersive/utils` when the module must remain usable from a
React Server Component; the main entry continues to re-export them for
backwards compatibility.

The hook returns:

- `objectBindings` and `setObjectBindings`
- `updateObjectBindings` for any binding field or atomic edit batch
- `selectObjectBindings` and `selectObjectBindingIds` for group, tag, or type queries
- `setMaterial`, `setBaseColor`, `setTexture`, `clearTexture`, `copyMaterial`, `resetMaterial`, and `getMaterial`
- `setTransform` and `resetTransform` for persistent local-space model transforms
- `updateMetadata` for recursively merged application data
- `addDecal`, `updateDecal`, and `removeDecal` for images and text printed on objects (see [Decals](#decals))
- `hiddenObjects`: a derived map of hidden binding keys
- `hiddenObjectIds`: the currently hidden binding IDs
- `hideObject`, `showObject`, `toggleObjectVisibility`
- `isObjectHidden`
- `clearHiddenObjects`

For scene-wide state, use `useSceneConfig`:

```tsx
const {
  sceneConfig,
  setSceneConfig,
  updateSceneConfig,
  resetSceneConfig,
  lights,
} = useSceneConfig(initialSceneConfig);

const enableUvChecker = () =>
  updateSceneConfig({
    model: { renderer: "uv-checker" },
    lighting: { ambient: { intensity: 0.5 } },
  });

lights.setIntensity("bulb-light", 4);
lights.setColor("bulb-light", "#ffd27d");
lights.toggle("bulb-light");
lights.attach("bulb-light", {
  objectId: "bulb-filament",
  offset: [0, -0.2, 0],
});

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  sceneConfig={sceneConfig}
/>;

<button onClick={enableUvChecker}>Show UV checker</button>;
```

Nested objects merge recursively, while arrays and tuples are replaced. Every
update uses a functional state updater, so consecutive calls compose. Use the
pure `patchSceneConfig(sceneConfig, patch)` utility when a store or parent owns
the scene state. The namespaced `lights` controller also provides `add`,
`update`, `remove`, `show`, `hide`, `toggle`, `setIntensity`, `setColor`,
`attach`, and `detach`. Attached lights follow a bound model object without an
R3F light component.

For high-frequency visual effects, use `useViewerEffects`. It mutates the live
viewer efficiently, requests demand-rendered frames automatically, and restores
its runtime changes on cleanup. Application code does not need Three.js node or
material access:

```tsx
const {
  addPointLight,
  flicker,
  handleViewerReady,
  overrideEffect,
  stopEffect,
} = useViewerEffects();

useEffect(() => {
  flicker(
    {
      materials: [
        {
          targets: { group: "filaments" },
          values: { emissiveIntensity: [0.02, 8] },
        },
      ],
      lights: [
        {
          lights: ["light-left", "light-right"],
          intensity: [0, 180],
        },
      ],
    },
    { id: "bulbs", synchronized: true, blackoutChance: 0.1 },
  );

  return () => stopEffect("bulbs");
}, [flicker, stopEffect]);

<ModelViewer
  modelUrl="/bulbs.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onViewerReady={(viewer) => {
    handleViewerReady(viewer);
    addPointLight({
      id: "light-left",
      target: "filament-left",
      color: "#ff9a3c",
      intensity: 0,
      distance: 30,
    });
  }}
/>;

<button onClick={() => overrideEffect("bulbs", 0, 800)}>Blackout</button>;
```

`transition`, `timeline`, `pulse`, and `flicker` share material, transform, and
light channels. `setMaterial`, `setTransform`, and `getWorldPosition` cover
immediate runtime work. `addPointLight`, `updatePointLight`, and
`removePointLight` manage lights attached to model objects. `resetRuntime` stops
active effects, restores snapshotted values, and disposes runtime lights.

If you want to keep hover state in sync with the viewer, the library also exports:

```tsx
const { hoveredObjectBinding, handleHoveredObject } = useViewerHover();

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onObjectHover={handleHoveredObject}
/>;
```

`useViewerHover` returns:

- `hoveredObjectBinding`: the currently hovered binding or `null`
- `handleHoveredObject`: a callback you can pass directly to `onObjectHover`

If you want model lifecycle and scene metadata, the library also exports:

```tsx
const {
  isLoading,
  isReady,
  error,
  bounds,
  objectCount,
  materialVariants,
  objects,
  handleModelLoaded,
  handleObjectCatalog,
  handleLoadError,
} = useViewerModel();

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onModelLoaded={handleModelLoaded}
  onObjectCatalog={handleObjectCatalog}
  onLoadError={handleLoadError}
/>;
```

`useViewerModel` returns:

- `isLoading`: `true` until the model has loaded or failed
- `isReady`: `true` after a successful model load
- `error`: the most recent load/render error, or `null`
- `bounds`: the loaded scene bounds as `min`, `max`, `center`, and `size`
- `objectCount`: the number of mesh objects in the loaded scene
- `materialVariants`: the names of the model's glTF material variants, or an
  empty array (see [`showMaterialVariants`](#showmaterialvariants))
- `objects`: every bindable object in the model as a `ViewerObjectInfo`, once
  `handleObjectCatalog` is passed to `onObjectCatalog`
- `handleModelLoaded`: a callback you can pass directly to `onModelLoaded`
- `handleObjectCatalog`: a callback you can pass directly to `onObjectCatalog`
- `handleLoadError`: a callback you can pass directly to `onLoadError`

If you want to inspect or trigger binding actions programmatically, the library also exports:

```tsx
const { getActionsForObject, handleAction, runAction } = useViewerActions({
  bindings,
  scene,
  camera,
  animations,
  onAction: (event) => {},
});

const actions = getActionsForObject("car-body");
await runAction("car-body", "power-on");

<ModelViewer onAction={handleAction} />;
```

`useViewerActions` returns:

- `getActionsForObject`: resolves the actions configured for a binding by key, `binding.id`, or `binding.modelObjectId`
- `handleAction`: executes an action event and can be passed directly to `ModelViewer.onAction`
- `runAction`: finds and executes an action, then resolves to its event, or `null` if the binding or action cannot be found

Actions can declare ordered `effects` for object-binding patches, scene patches, visibility, camera controls, and animation controls. Pass the corresponding hook controllers into `useViewerActions`; omitted optional controllers cause only their effect category to be skipped.

`runAction` executes declarative effects only. It does not invoke viewer-owned behavior such as opening a picker or running the built-in visibility toggle. For programmatic visibility, call the bindings controller directly or declare a custom action with a visibility effect.

## `BindingBuilder`

`BindingBuilder` is an exported design-time helper component for authoring `objectBindings` in the browser.

Basic usage:

```tsx
import "@liveroom-tech/react-immersive/binding-builder.css";
import { BindingBuilder } from "@liveroom-tech/react-immersive/binding-builder";

export default function App() {
  return <BindingBuilder licenseKey="your-license-key" />;
}
```

`BindingBuilder` accepts one required prop and the same optional decoder
configuration as the viewers:

```ts
type BindingBuilderProps = {
  licenseKey: string;
  dracoDecoderPath?: string | false;
  ktx2TranscoderPath?: string | false;
  meshopt?: boolean;
};
```

`licenseKey` is validated the same way as `ModelViewer`'s (see [`licenseKey`](#licensekey) below). While the key is being checked, `BindingBuilder` renders a "Verifying license…" placeholder; if it's invalid, it renders an error message instead of the editor.

Current behavior, Object tab:

- upload a `.glb`, standalone/data-URI `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, or `.ply` file, or a `.zip` bundle (a `.gltf` with its `.bin` and textures, an `.obj` with its MTL and textures, or an `.fbx` with external textures)
- traverse renderable mesh nodes and generate starter bindings automatically
- for an object without texture coordinates (STL, most PLY), the **Material** image map fields are turned off with a note, and the starter actions leave out **Change Material** (see [STL and PLY](#stl-and-ply))
- edit binding identity, label, type, status, booleans, style, actions, metrics, metadata, and saved camera state
- add decals to the selected object from the **Decals** panel: upload an image or add text to place it automatically at the centre of the camera-facing surface, then set its size, rotation, and opacity; **Move** lets you drag the decal across the object's surface. Release to save, or press Escape to cancel. Uploaded images are exported under `materials/` with the bindings
- move and rotate the selected object from the **Move & Rotate** panel using a geometry-centered pivot, World/Local axis alignment, or numeric position and degree fields; restore its authored transform with one click
- apply a one-click material preset (wood, metal, chrome, glass, plastic, fabric, ceramic, concrete, etc.) onto the selected object's material
- undo/redo the current bindings (toolbar buttons or `Cmd/Ctrl+Z` / `Cmd/Ctrl+Shift+Z`); rapid edits coalesce into a single undo step
- import a previously exported `objectBindings.json`, merged onto the current model by `modelObjectId`
- export the current bindings as JSON or TypeScript, with TypeScript exports wrapped in `defineObjectBindings` to preserve literal IDs, bundled into a `.zip` (with a `materials/` folder) when any texture field was filled by uploading a file, otherwise a plain file

Current behavior, Scene tab:

- configure the same `SceneConfig` shape `ModelViewer`'s `sceneConfig` prop accepts (lighting, environment, background, ground shadows, wireframe, post-processing, animations, annotations)
- configure auto-rotation and its speed, exported as `sceneConfig.model.autoRotate` and `sceneConfig.model.autoRotateSpeed`
- preview animation clips, several at once and forwards or backwards, and set each clip's loop mode (loop, play once, or ping-pong), speed, and display name
- check changes with **Compare** above the preview: a before/after divider across the preview, with the project as it was opened on the left and as it is now on the right; orbiting either side moves both, and **Pin** on the "Before" label makes the current state the "before" for the next round of changes
- pick which of the model's glTF material variants the scene starts with, one per option group, exported as `sceneConfig.model.activeVariants`
- isolate a node from the Scene Nodes list to see it on its own in the preview while you edit it (not exported)
- set up a section cut (**General → Section Cut**: axis, position, and side to keep), exported as `sceneConfig.section`; the preview has the section toolbar and draggable plane too
- build style rules (**Rules** sub-tab) that restyle objects from their metrics, status, and metadata, with suggestions from the model's bindings, a live match count, and a live preview; exported as `sceneConfig.styleRules`
- position and rotate directional, point, and spot lights with transform gizmos; spot lights also expose angle and penumbra controls
- undo/redo the scene config independently of the Object tab's bindings history
- import a previously exported `sceneConfig.json`, merged by top-level section
- export the current scene config as JSON or TypeScript

Preview:

- the selected node previews live in an embedded `ModelViewer`

Autosave:

- the session (the model, its object bindings, and the scene settings, with an uploaded model file included) is saved to this browser's IndexedDB, in a database named `react-immersive:binding-builder`, shortly after each edit and when the tab is hidden or closed
- **Restore last session** in the preview's "⋯" menu reopens it; one session is kept per browser
- while there are edits on screen, leaving or reloading the page asks for confirmation
- if the browser refuses to store a session, usually for lack of space, the editor says so; export your work to keep it
- enable **Transform gizmo**, select a mesh, then use the arrows and plane handles to move it or the rings to rotate it; all changes are saved to `binding.transform`

### `BindingBuilder` licensing & plan tiers

Some editor features are gated by the license's plan tier (the server-returned `tier`, normalized to `"free" | "starter" | "growth"`):

| Tier      | Unlocks                                                                                                                                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `free`    | All 3 components are available. `SimpleModelViewer` is fully available, while `ModelViewer` and `BindingBuilder` are limited to local development with base color, metalness/roughness sliders, and basic scene settings only |
| `starter` | + Texture maps, the specular workflow, reflectivity, environment lighting, environment backgrounds, wireframe preview, animation configuration, annotations, style rules, decals                                              |
| `growth`  | + Post-processing effects                                                                                                                                                                                                     |

A locked feature renders in place (not hidden) with a message naming the required plan, so it stays discoverable while editing.

## `SimpleModelViewer`

`SimpleModelViewer` is an exported lightweight viewer for cases where you want to load a GLB, GLTF, OBJ, FBX, USDZ, STL, or PLY asset, inspect meshes, and toggle visibility without building `objectBindings`. It can either load a fixed `modelUrl` or, when `enableModelUpload` is turned on, let the user drag-and-drop or choose a local model at runtime.

Basic usage:

```tsx
import "@liveroom-tech/react-immersive/simple-model-viewer.css";
import { SimpleModelViewer } from "@liveroom-tech/react-immersive/simple-model-viewer";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <SimpleModelViewer modelUrl="/model.glb" />
    </div>
  );
}
```

`SimpleModelViewer` does not take a `licenseKey`, licensing is enforced by `ModelViewer` and `BindingBuilder` only.

Sizing note:

- `SimpleModelViewer` fills the width and height of its parent container
- give the parent an explicit height (for example `100vh`, `480px`, or a Tailwind class like `h-[100px]`) when you want a fixed viewer height

Current behavior:

- discovers renderable meshes directly from the loaded model scene
- renders a right-side scene objects panel with search and visibility toggles
- renders a left-side environment/scene settings panel (background color, environment preset, auto-rotate, exposure, ambient + directional light) toggleable via `showSceneSettingsPanel`, with every control seedable via props
- optionally replaces `modelUrl` with a drag-and-drop / file-picker flow when `enableModelUpload` is enabled
- lets users click a mesh or panel row to select and focus it
- fits the full scene on initial load
- uses built-in ambient, directional, and environment lighting

Use `SimpleModelViewer` when you want a quick inspection viewer.
Use `ModelViewer` when you need binding-driven styling, actions, metadata, custom panels, exports, or animation integrations.

If you want camera state and imperative camera helpers, the library also exports:

```tsx
const camera = useViewerCamera({
  initialPosition: [0, 2, 8],
  initialTarget: [0, 1.2, 0],
});

const {
  cameraState,
  resetView,
  focusObject,
  fitScene,
  setCameraTarget,
  lookAt,
  orbitTo,
  dollyTo,
  savePreset,
  goToPreset,
  handleCameraChange,
  handleViewerReady,
} = camera;

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onCameraChange={handleCameraChange}
  onViewerReady={handleViewerReady}
/>;
```

`useViewerCamera` returns:

- `cameraState`: the latest camera `position`, `target`, `fov`, and `zoom`
- `resetView`: resets the controls to their initial saved state
- `focusObject`: fits the camera to a binding by key, `binding.id`, or `binding.modelObjectId`
- `fitScene`: fits the camera to the whole loaded scene
- `setCameraTarget`: sets the camera target to a given `[x, y, z]`
- `setCameraState`: restores a full camera state (`position`/`target`/`fov`/`zoom`) previously read from `cameraState`
- `lookAt`: moves the position and target together
- `orbitTo`: orbits to azimuth and polar angles in degrees (azimuth 0 is the front, 90 the right; polar 0 is straight down, 90 level)
- `dollyTo`: moves to a distance from the current target
- `savePreset`: captures the current camera under a name
- `goToPreset`: moves to a named camera preset
- `handleCameraChange`: a callback you can pass directly to `onCameraChange`
- `handleViewerReady`: a callback you can pass directly to `onViewerReady`

Pass `initialPosition`, `initialTarget`, and optional named `presets` to `useViewerCamera` to configure the first view without writing an `onViewerReady` wrapper.

If you want a link that opens the viewer the way it looks now, the library also exports `useShareableViewerState`. It keeps the camera, the hidden objects, and the selection in the page URL's hash (`#view=…`), and puts them back when the link is opened:

```tsx
const viewer = useViewer();
const share = useShareableViewerState({
  cameraState: viewer.camera.cameraState,
  setCameraState: viewer.camera.setCameraState,
  objectBindings: viewer.bindings.objectBindings,
  onObjectBindingsChange: viewer.bindings.setObjectBindings,
  selectedObjectBinding: viewer.selection.selectedObjectBinding,
  setSelectedObjectBinding: viewer.selection.setSelectedObjectBinding,
});

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  {...viewer.props}
  onViewerReady={(ready) => {
    viewer.props.onViewerReady(ready);
    void share.restoreFromUrl();
  }}
  refitOnResize={false}
/>;

<button onClick={() => navigator.clipboard.writeText(share.getShareUrl())}>
  Copy link
</button>;
```

`useShareableViewerState` takes:

- `cameraState` and `setCameraState`: from `useViewerCamera` (`viewer.camera`)
- `objectBindings` and `onObjectBindingsChange`: the bindings and their setter; hidden objects are restored by setting their `visible` to `false`
- `selectedObjectBinding` and `setSelectedObjectBinding`: from `useViewerSelection` (`viewer.selection`). `ModelViewer` also needs `selectedObject` (`viewer.props` passes it), or a restored selection won't show
- `paramKey`: the hash key the view is stored under. Default `"view"`
- `debounceMs`: how long after a change the hash is updated, in milliseconds. Default `400`
- `autoSync`: keep the hash up to date as the view changes. Default `true`. With `false`, write it with `syncUrl` or build links with `getShareUrl`

`useShareableViewerState` returns:

- `getShareUrl`: the current page URL with the current view in its hash, without changing the address bar
- `syncUrl`: writes the current view into the hash now, with `history.replaceState`, so no history entry is added
- `restoreFromUrl`: applies the view in the hash, if there is one, and resolves `true` once it has applied all of it. Called again, it does nothing until the hash holds a different view, so it's safe to call from `onViewerReady`, which runs often

Things to know:

- The link holds the view, not the model. Keep whatever identifies the model, such as a route or query parameter, in the URL too. Objects are stored by `binding.id`, so links keep working while the ids stay the same.
- The hash is only updated after `restoreFromUrl` has been called once, so an incoming link isn't overwritten before it's read. Call it even if you don't restore links; with nothing in the hash it does nothing.
- When the bindings come from the model, as with `useViewer` or `objectBindings="auto"`, they exist only once it has loaded, after the first `onViewerReady`. A link that hides or selects objects then restores its camera at once and waits for them: `onViewerReady` runs again when the bindings arrive, and that call hides and selects them. The hash isn't updated while it waits.
- The camera jumps to the shared view without a transition. `refitOnResize={false}` keeps a later resize from re-framing the model away from it.
- The hook listens for `hashchange`, so pasting a newer link into an open tab applies it.

See the [Shareable View example](https://react-immersive.liveroom.dev/examples/shareable-view) and the [`useShareableViewerState` docs](https://react-immersive.liveroom.dev/docs/hooks/use-shareable-viewer-state).

If your GLB/GLTF model contains animations, the library also exports:

```tsx
const {
  clips,
  currentClip,
  isPlaying,
  speed,
  play,
  pause,
  stop,
  setSpeed,
  handleAnimationsReady,
} = useViewerAnimations();

<ModelViewer
  modelUrl="/character.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onAnimationsReady={handleAnimationsReady}
/>;
```

`useViewerAnimations` returns:

- `clips`: an array of animation clip names found in the GLB/GLTF file
- `clipDetails`: clip metadata including `sourceName` and `duration` in seconds
- `currentClip`: the clip played most recently, while it's active, or `null`
- `isPlaying`: `true` while any clip is playing (not paused, finished, or stopped)
- `speed`: the playback speed of `currentClip` (default `1`)
- `time`: the live playback position of `currentClip`, in seconds (updates while playing)
- `duration`: the length of `currentClip`, in seconds
- `active`: every active clip (playing, paused, or finished) with its `status`, `time`, `duration`, `speed`, and `reverse`, most recently played last
- `play(clip, options?)`: starts a clip by name, replacing the clips already playing unless `options.alongside` is set; `options.fade` blends over that many seconds, and `options.reverse` plays it backwards. A paused clip resumes instead of restarting
- `pause(clip?)`: pauses one clip, or every active clip, at its current time
- `stop(clip?)`: stops one clip, or every active clip, and resets the pose
- `setSpeed(speed, clip?)`: changes the playback speed (e.g. `0.5` for half speed, `2` for double) of one clip, or of every active clip and those played later without their own speed
- `seek(time, clip?)`: scrubs one clip, or every active clip, to an absolute time in seconds (works while playing or paused), clamped to the clip length
- `handleAnimationsReady`: a callback you can pass directly to `onAnimationsReady`

Example with playback controls:

```tsx
const { clips, currentClip, isPlaying, play, pause, stop, setSpeed } =
  useViewerAnimations();

// Play/pause toggle
<button onClick={() => (isPlaying ? pause() : play(currentClip ?? clips[0]))}>
  {isPlaying ? "Pause" : "Play"}
</button>

// Stop
<button onClick={() => stop()}>Stop</button>

// Speed slider
<input
  type="range"
  min="0.1"
  max="3"
  step="0.1"
  defaultValue="1"
  onChange={(e) => setSpeed(Number(e.target.value))}
/>

// Clip selector
{clips.map((name) => (
  <button key={name} onClick={() => play(name)}>
    {name} {currentClip === name && isPlaying ? "▶" : ""}
  </button>
))}
```

Several clips can play at once. `play` replaces the clips already playing
unless you pass `alongside: true`, and the other controls act on one clip when
you name it, or on every active clip when you don't:

```tsx
const animations = useViewerAnimations();

// Open both doors together, then close the left one.
animations.play("DoorLeftOpen", { alongside: true });
animations.play("DoorRightOpen", { alongside: true });
animations.play("DoorLeftOpen", { alongside: true, reverse: true });

// Blend from walking to running over half a second.
animations.play("Run", { fade: 0.5 });

animations.pause("Wheels"); // one clip
animations.stop(); // every clip

// What's active, and how far along each clip is
animations.active.map(({ clip, status, time }) => `${clip}: ${status} at ${time}s`);
```

A clip whose `loopMode` is `"once"` holds its last pose when it finishes
(`status: "finished"`) until it's stopped or played again, so an opened door
stays open. `"ping-pong"` plays forwards then backwards, repeatedly. Playing a
clip that's already playing in the same direction leaves it running; playing
it the other way turns it around where it is.

## `CompareViewer`

Shows two configurations next to each other with one camera: a before and
after of a renovation, two paint options, the current part against its
replacement. Each side is a full [`ModelViewer`](#public-api),
so a side can differ in anything a viewer takes: `objectBindings`,
`sceneConfig`, material variants, even a different `modelUrl`.

```tsx
import "@liveroom-tech/react-immersive/styles.css";
import { CompareViewer } from "@liveroom-tech/react-immersive";

<div style={{ height: 600 }}>
  <CompareViewer
    modelUrl="/kitchen.glb"
    licenseKey="your-license-key"
    before={{ label: "Current", objectBindings: currentBindings }}
    after={{ label: "Proposed", objectBindings: proposedBindings }}
  />
</div>;
```

### Layouts

- **`layout="slider"`** (default) lays the two views over each other. A divider
  splits them: the left of it shows `before`, the right shows `after`. Drag the
  divider, or focus it and use the arrow keys, Page Up/Down, Home, and End. It
  is a slider to screen readers, with each side's label and share.
- **`layout="side-by-side"`** shows the two views next to each other, each half
  the width.

```tsx
<CompareViewer
  modelUrl="/car.glb"
  licenseKey="your-license-key"
  layout="side-by-side"
  before={{ sceneConfig: { ...config, model: { ...config.model, activeVariants: ["Paint: Red"] } } }}
  after={{ sceneConfig: { ...config, model: { ...config.model, activeVariants: ["Paint: Blue"] } } }}
/>
```

### One camera

Orbiting, panning, or zooming either side moves both. The side you last
grabbed leads and the other copies it every frame, so a fly-in, a zoom to a
selected object, or a refit on one side shows on both. With two different
models, the views line up on the same point in space, so the models should
share a coordinate system.

### Props

```ts
type CompareViewerProps = Partial<ModelViewerProps> & {
  licenseKey: string;
  before: CompareViewerSide; // the left side
  after: CompareViewerSide; // the right side
  layout?: "slider" | "side-by-side"; // default "slider"
  split?: number; // the divider, 0 (left edge) to 1; default 0.5
  onSplitChange?: (split: number) => void;
};

type CompareViewerSide = Partial<ModelViewerProps> & {
  label?: string; // shown over the side; default "Before" / "After"
};
```

Every other prop is shared by both sides, and a side's own props win.
Callbacks run per side: give `before.onObjectSelect` and
`after.onObjectSelect` to tell the sides apart. Both sides start from the
`minimal` [preset](#presets-and-grouped-props),
with no panels or buttons, so their interfaces don't overlap; pass `preset`
or `ui` to change that. Pass `split` to control the divider yourself;
without it, `CompareViewer` keeps the position.

> Each side has its own WebGL (or [WebGPU](#webgpu)) canvas. The two share one download and parse of the model file, but the GPU holds two copies of its geometry and textures.

`poster`, `loading` and `reveal` work as on
[`ModelViewer`](#lazy-loading-and-posters). With `reveal="interaction"`, one
**View in 3D** button starts both sides.

The divider and the default side labels use the
[`labels`](https://react-immersive.liveroom.dev/docs/reference/labels) keys `compareBefore`, `compareAfter`,
`compareDivider`, and `compareDividerValue`.

## Presets and grouped props

`preset` sets `ModelViewer` up for a common kind of page:

| Preset | For | What it sets |
| --- | --- | --- |
| `minimal` | Just the model | Hides both panels, the download and reset buttons, tour controls, and the material variant buttons |
| `showcase` | A product on display | Everything `minimal` does, plus auto-rotation |
| `configurator` | Customers changing parts | Shows the selected object's panel, the reset button, and the material variant buttons; hides the scene objects panel and download |
| `inspector` | Checking a model | Every panel, the view gizmo, the measure, UV checker, exploded-view, section-cut, and isolate tools, and keyboard navigation |

`MODEL_VIEWER_PRESETS` lists exactly which props each preset sets.

Related props are also available as groups, which keeps a configured viewer
readable:

```tsx
<ModelViewer
  modelUrl="/car.glb"
  licenseKey="your-license-key"
  preset="configurator"
  ui={{ download: "car.glb" }}
  tools={{ measure: { unit: "cm" } }}
  controls={{ autoRotate: 0.5, zoom: false, limits: { maxDistance: 20 } }}
  perf={{ profile: "low" }}
  xr={{ enabled: true, usdzUrl: "/car.usdz" }}
/>
```

| Group | Fields, and the flat prop each one sets |
| --- | --- |
| `ui` | `objectPanel` (`showObjectBindingDataPanel`), `sceneObjects` (`showSceneObjectsPanel`), `download` (`showDownloadButton`; a string also sets `downloadFilename`), `reset` (`showResetButton`), `fullscreen` (`showFullscreenButton`), `loadingOverlay` (`showLoadingOverlay`), `viewGizmo` (`showViewGizmo`), `mouseController` (`showMouseController`; `{ position, opacity }` also sets `mouseControllerPosition` and `mouseControllerOpacity`), `annotationNavigation` (`showAnnotationNavigation`), `annotationOnHover` (`showAnnotationOnHover`), `highlightOnHover`, `materialVariants` (`showMaterialVariants`), `objectNavigator` (`showObjectNavigator`) |
| `tools` | `measure` (`showMeasureTools`; `{ unit }` also sets `measurementUnit`), `uvChecker` (`showUvCheckerButton`), `explode` (`showExplodeControls`), `section` (`showSectionTools`), `isolate` (`showIsolateControls`), `texturePositioning` (`texturePositioning`) |
| `controls` | `enabled` (`enableCameraControls`), `keyboard` (`enableKeyboardNavigation`), `zoom` (the opposite of `disableZoom`), `zoomOnSelect` (`zoomOnSelected`), `autoRotate` (a number also sets `autoRotateSpeed`), `refitOnResize`, `limits` (`cameraLimits`), `moveSensitivity`, `zoomSensitivity`, `reducedMotion` |
| `perf` | `renderMode`, `maxDpr`, `profile` (`performanceProfile`), `preserveDrawingBuffer`, `webgpu` |
| `tiles` | `url` (`tilesetUrl`), `errorTarget` (`tilesErrorTarget`), `cacheSize` (`tilesCacheSize`) |
| `xr` | `enabled` (`enableXR`), `usdzUrl`, `scaleMode` (`arScaleMode`), `mobileHandoffUrl` |
| `decoders` | `draco` (`dracoDecoderPath`), `ktx2` (`ktx2TranscoderPath`), `meshopt` |

A preset only fills in defaults: a flat prop overrides it, and a grouped prop
overrides both. The flat props keep working exactly as before.

## Public API

The source code currently defines `ModelViewer` with these props:

```ts
type Props = {
  preset?: "minimal" | "showcase" | "configurator" | "inspector";
  ui?: ModelViewerUiOptions;
  tools?: ModelViewerToolsOptions;
  controls?: ModelViewerControlsOptions;
  perf?: ModelViewerPerfOptions;
  tiles?: ModelViewerTilesOptions;
  xr?: ModelViewerXrOptions;
  decoders?: ModelViewerDecoderOptions;
  modelUrl: string;
  poster?: string;
  loading?: "lazy" | "eager"; // default "lazy"
  reveal?: "auto" | "interaction"; // default "auto"
  tilesetUrl?: string | null;
  tilesErrorTarget?: number;
  tilesCacheSize?: number;
  onObjectCatalog?: (objects: ViewerObjectInfo[]) => void;
  modelFormat?: "glb" | "gltf" | "obj" | "fbx" | "usdz" | "stl" | "ply";
  licenseKey: string;
  objectBindings?: Record<string, ObjectBinding> | "auto"; // default "auto"
  selectedObject?: ObjectBinding | null;
  panelHoveredObject?: ObjectBinding | null;
  onObjectBindingsChange?: (next: Record<string, ObjectBinding>) => void;
  onObjectSelect?: (binding: ObjectBinding | null) => void;
  onObjectHover?: (binding: ObjectBinding | null) => void;
  onObjectDoubleClick?: (event: ObjectPointerEvent) => boolean | void;
  onObjectContextMenu?: (event: ObjectPointerEvent) => void;
  onModelLoaded?: (model: ViewerModelInfo) => void;
  onLoadError?: (error: unknown) => void;
  onProgress?: (event: ProgressEvent) => void;
  cameraControllerType?: "orbit" | "pointerLock";
  onCameraControllerChange?: (
    controller: "orbit" | "pointerLock",
  ) => void;
  onAction?: (event: ObjectActionEvent) => void;
  onEngagement?: (event: ViewerEngagementEvent) => void | Promise<void>;
  debugEngagement?: boolean;
  onHiddenObjectsChange?: (next: Record<string, boolean>) => void;
  onCameraChange?: (state: ViewerCameraState) => void;
  onViewerReady?: (viewer: ViewerReadyState) => void;
  onTextureUpload?: (file: File, objectId: string) => Promise<string>;
  texturePositioning?: boolean | TexturePositioningControls;
  onAnimationsReady?: (controls: AnimationControls) => void;
  onAnnotationsChange?: (annotations: AnnotationMarker[]) => void;
  activeAnnotation?: AnnotationMarker | null;
  onActiveAnnotationChange?: (annotation: AnnotationMarker | null) => void;
  camera?: ViewerCameraConfig;
  cameraLimits?: CameraLimits;
  backgroundColor?: string;
  shadows?: boolean;
  showObjectBindingDataPanel?: boolean;
  customObjectBindingDataPanel?: (
    props: CustomObjectBindingDataPanelProps,
  ) => React.ReactNode;
  customSceneObjectsPanel?: (
    props: CustomSceneObjectsPanelProps,
  ) => React.ReactNode;
  showSceneObjectsPanel?: boolean;
  showDownloadButton?: boolean;
  downloadFilename?: string;
  showResetButton?: boolean;
  showFullscreenButton?: boolean;
  showLoadingOverlay?: boolean;
  showMouseController?: boolean;
  mouseControllerPosition?:
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right"
    | "center"
    | "center-bottom"
    | "center-top";
  mouseControllerOpacity?: number;
  moveSensitivity?: number;
  zoomSensitivity?: number;
  sceneConfig?: SceneConfig;
  disableZoom?: boolean;
  zoomOnSelected?: boolean;
  highlightOnHover?: boolean;
  enableCameraControls?: boolean;
  moveModeEnabled?: boolean;
  objectTransformSpace?: "local" | "world";
  enableKeyboardNavigation?: boolean;
  showObjectNavigator?: boolean;
  reducedMotion?: "user" | "always" | "never";
  onAutoFit?: () => Promise<boolean>;
  refitOnResize?: boolean;
  renderMode?: "always" | "demand";
  maxDpr?: number;
  preserveDrawingBuffer?: boolean;
  webgpu?: boolean;
  performanceProfile?: "auto" | "high" | "low";
  dracoDecoderPath?: string | false;
  ktx2TranscoderPath?: string | false;
  meshopt?: boolean;
  showMeasureTools?: boolean;
  showUvCheckerButton?: boolean;
  showExplodeControls?: boolean;
  showSectionTools?: boolean;
  isolation?: ViewerIsolation | null;
  onIsolationChange?: (isolation: ViewerIsolation | null) => void;
  showIsolateControls?: boolean;
  showMaterialVariants?: boolean;
  cinematic?: boolean | CinematicConfig;
  measurementUnit?: string;
  enableXR?: boolean;
  usdzUrl?: string;
  arScaleMode?: "normalized" | "real-world";
  mobileHandoffUrl?: string;
  showAnnotationNavigation?: boolean;
  showAnnotationOnHover?: boolean;
  onSceneConfigChange?: (config: SceneConfig) => void;
  showViewGizmo?: boolean;
  overlay?: React.ReactNode;
  unsafe_sceneChildren?: React.ReactNode;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};
```

### `modelUrl`

URL or public path to a `.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, or `.ply` model. Hosted GLTF, OBJ, and FBX assets must serve external buffers, MTL files, and textures at their declared relative paths. USDZ dependencies are contained in the USDZ package. Use `modelFormat` when a signed or extensionless URL cannot be auto-detected.

Example:

```tsx
modelUrl = "/model.glb";
```

### `modelFormat`

Optional explicit format for signed or extensionless model URLs. Normal URLs
ending in `.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, or `.ply` are detected automatically.

### STL and PLY

STL and PLY files hold geometry only: no object names, materials or
animations.

- **One object per file**, named after the file: `bracket.stl` loads as one
  object keyed `bracket`, which its bindings use. A text STL with several named
  solids loads one object per solid. A `.zip` holding one STL or PLY file also
  works.
- **Colour:** objects start a matte grey. A PLY file's vertex colours show as
  they are, and picking a colour (or texture) replaces them.
- **No texture coordinates:** STL files have none and PLY files rarely do, so an
  image can't be mapped onto them. The viewer's **Change Material** says so
  instead of offering an upload, BindingBuilder turns off its image map fields
  for that object, and new bindings leave Change Material out. [Decals](#decals)
  work without texture coordinates. This applies to any object without them, in
  any format.
- **Units and orientation:** STL files are usually in millimetres with Z up, so a
  part can load lying on its back. Turn it upright with
  [`sceneConfig.model.rotation`](#sceneconfig) (BindingBuilder: **Scene** →
  model rotation, −90° on X), and set [`measurementUnit`](#measurementunit) to
  `"mm"`. In AR, the default `"normalized"` [`arScaleMode`](#arscalemode) fits the
  model to a metre; `"real-world"` would read millimetres as metres.
- **PLY point clouds** (points with no faces) can't be shown; the viewer
  explains why instead of loading them.

### 3D Tiles streaming

Use `tilesetUrl` to stream a processed 3D Tiles model instead of downloading
`modelUrl` as one monolithic asset. `modelUrl` remains required by the component
API, but `tilesetUrl` is the render source while streaming is enabled.

```tsx
<ModelViewer
  modelUrl="/models/campus.glb"
  tilesetUrl="/models/campus/tileset.json"
  tilesErrorTarget={8}
  tilesCacheSize={800}
  onObjectCatalog={(objects) => console.log(objects)}
  {...props}
/>
```

- `tilesErrorTarget` controls the screen-space error target. Lower values load
  sharper tiles and use more bandwidth/GPU memory. Default: `8`.
- `tilesCacheSize` is the maximum number of parsed tiles kept in the client
  cache. Default: `800`.
- `onObjectCatalog` receives the bindable-object catalog from `objects.json`
  before all referenced tiles have loaded. See [`onObjectCatalog`](#onobjectcatalog).

Bindings, selection, hover, material overrides, transforms, exploded view, and
scene renderer modes use the same public API in streamed and monolithic modes.
The tileset and its tile payloads must be browser-accessible, and the optional
object catalog must sit beside `tileset.json` as `objects.json`.

### `licenseKey`

License key for the library. Required.

### `objectBindings`

A map keyed by the model node name, or `"auto"`, the default (see
[Generating bindings automatically](#generating-bindings-automatically)). Each
key should match a mesh name from the GLB/GLTF file.

`objectBindings` is the single source of truth for all visual state. Changes to the binding record drive rendering:

- `visible` controls mesh visibility
- `style.material.baseColor` sets the mesh color (committed by the built-in color picker on close)
- `style.material.texture.path` sets the mesh texture (committed by the built-in texture upload; uses `onTextureUpload` for a durable URL when provided, otherwise a session-scoped blob URL)
- `style.material.*` applies per-object `MeshPhysicalMaterial` overrides such as emissive, metalness, roughness, opacity, clearcoat, sheen, anisotropy, specular, transmission, thickness, reflectivity, and sidedness
- `cameraState.position` and `cameraState.target` define the camera view to use when that object is focused or selected from the viewer UI

Example:

```ts
import { defineObjectBindings } from "@liveroom-tech/react-immersive/utils";

export const objectBindings = defineObjectBindings({
  Object_2: {
    id: "obj-2",
    modelObjectId: "Object_2",
    type: "body",
    visible: true,
    cameraState: {
      position: [2.8, 1.6, 4.2],
      target: [0, 0.8, 0],
    },
    style: {
      material: {
        baseColor: "#ff0000",
        texture: {
          path: "/materials/body-finish.jpg",
        },
      },
    },
    actions: [
      { id: "change-color", label: "Change Color", type: "command" },
      { id: "change-material", label: "Change Material", type: "command" },
      { id: "toggle-visibility", label: "Toggle Visibility", type: "command" },
    ],
    metrics: {},
    metadata: {},
  },
});
```

`defineObjectBindings` validates the complete record while preserving its exact keys and literal values. Use `ObjectBindingKey<typeof objectBindings>` for the binding-key union and `ObjectBindingActionId<typeof objectBindings, "Object_2">` for that binding's action-id union. It returns the input unchanged at runtime.

If a binding's `modelObjectId` (or its key) doesn't match any node in the
loaded model, that binding can never be selected. `ModelViewer` then shows a
dismissible banner with the number of mismatched bindings, and logs a console
warning naming them. Log [`onObjectCatalog`](#onobjectcatalog) to see the
model's node names.

#### Generating bindings automatically

`objectBindings` defaults to `"auto"`: leave it out and `ModelViewer` generates
a binding for every mesh when the model loads, so you don't need to know the
node names up front:

```tsx
<ModelViewer modelUrl="/model.glb" licenseKey="your-license-key" />
```

Each generated binding is keyed by the node name, with a readable `label`
(`"Wheel_FL"` becomes `"Wheel FL"`), an inferred `type`, a unique `id`, and
built-in actions: `change-color`, `change-material`, and `toggle-visibility`,
or `toggle-light`, `change-light-color`, and `set-brightness` for meshes whose
names contain "light". For a streamed model (`tilesetUrl`), the bindings come
from the object catalog, so objects are bindable before their tiles load.

The generated bindings are passed to `onObjectBindingsChange` once they exist,
and again after every edit. To keep them, and to refine them later, store them
and pass them back:

```tsx
const [objectBindings, setObjectBindings] = useState<
  Record<string, ObjectBinding> | "auto"
>("auto");

<ModelViewer
  modelUrl={modelUrl}
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onObjectBindingsChange={setObjectBindings}
/>;
```

After the first change the viewer is controlled by your state as usual. Set the
state back to `"auto"` when you switch to a different model. While the prop is
`"auto"`, bindings the same model already had are kept when it reloads, so
runtime edits survive; a different `modelUrl` starts from fresh bindings.

The same defaults are available as functions from both entry points (they are
also what `BindingBuilder` generates):

```ts
import {
  buildBindingsFromNodes,
  createDefaultBinding,
  inferType,
} from "@liveroom-tech/react-immersive/utils";

const bindings = buildBindingsFromNodes(["CarBody", "Wheel_FL"]);
const door = { ...createDefaultBinding("FrontDoor"), label: "Front door" };
inferType("Wheel_FL"); // "wheel"
```

Every generated action is one `ModelViewer` performs itself, so every
generated button works without extra setup.

### `selectedObject`

Optional currently selected object binding, or `null` when nothing is selected.

If provided, `ModelViewer` behaves as a controlled component.
If omitted, `ModelViewer` manages its own selection state internally.

When the selected object has a `cameraState` with both `position` and `target`, the viewer uses that saved camera view for focus/select behavior instead of falling back to `fitToBox`.

### `panelHoveredObject`

Optional externally controlled binding to highlight as hovered by a custom
scene-objects panel. It takes precedence over the built-in panel and canvas
hover while `highlightOnHover` is enabled. Pass `null` when no panel row is
hovered.

### `onObjectSelect`

Optional callback called when the user clicks a mesh or closes the side panel.

Behavior:

- clicking a mesh calls `onObjectSelect(binding)`
- closing the panel calls `onObjectSelect(null)`
- clicking the same mesh again still selects it; selection is not toggled off automatically
- if the binding includes `cameraState.position` and `cameraState.target`, the viewer moves the camera to that saved view when focusing that object

### `onObjectHover`

Optional callback called when the user hovers a mesh in the model.

Behavior:

- pointer over a mesh calls `onObjectHover(binding)`
- pointer out calls `onObjectHover(null)`

### `onObjectDoubleClick`

Optional callback called when the user double-clicks an object.

```ts
onObjectDoubleClick?: (event: ObjectPointerEvent) => boolean | void

type ObjectPointerEvent = {
  binding: ObjectBinding;
  clientX: number; // viewport coordinates
  clientY: number;
  pointerType: string; // "mouse" | "pen" | "touch"
  surface?: { position: Vec3; normal: Vec3 }; // where on the object, in its own space
};
```

Return `true` to say you handled it: the viewer then skips its own double-click
behavior, which moves the camera's orbit point to that spot (or starts texture
positioning, when `texturePositioning` is on). Return nothing to keep it.

### `onObjectContextMenu`

Optional callback called when the user right-clicks an object, or long-presses
it on a touch screen. Use it to open your own menu:

```tsx
<ModelViewer
  {...props}
  onObjectContextMenu={({ binding, clientX, clientY }) =>
    openMenu({ for: binding.id, x: clientX, y: clientY })
  }
/>
```

It receives the same `ObjectPointerEvent` as `onObjectDoubleClick`, with the
position where the gesture started, ready for a `position: fixed` menu. A
right-click fires when the button is released without the pointer moving, so a
right-drag still pans the camera. A long-press fires after half a second, and
not if the finger moves or a second finger touches down (a pinch); lifting the
finger afterwards doesn't select the object. Objects with `selectable: false`
don't fire it.

### `onHiddenObjectsChange`

Optional callback fired with the derived hidden-object map whenever the current binding data changes hidden visibility state.

### `onObjectBindingsChange`

Optional callback fired when the viewer's built-in UI updates binding data.

This fires for:

- visibility toggles (`binding.visible`)
- color picks (`binding.style.material.baseColor`), committed when the color picker closes
- texture uploads (`binding.style.material.texture.path`), committed immediately (via `onTextureUpload` when provided, otherwise as a blob URL)
- texture removal (`binding.style.material.texture` cleared)
- object movement and rotation (`binding.transform.position` and `binding.transform.rotation`)

If you want the viewer and your app state to stay in sync, pass `objectBindings` from state and wire this callback back into that state setter.

### `onObjectCatalog`

Optional callback listing every bindable object in the model: each named mesh,
under the identifier `objectBindings` is keyed by. It's the quickest way to find
out what your meshes are called:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  onObjectCatalog={(objects) => console.table(objects)}
/>
```

It fires each time a model loads. For a streamed model (`tilesetUrl`) the list
comes from `objects.json` beside `tileset.json`, before the tiles containing
those objects have necessarily loaded. Each entry is a `ViewerObjectInfo`:

```ts
type ViewerObjectInfo = {
  name: string; // the key to use in objectBindings
  triangles: number;
  minimum: [number, number, number];
  maximum: [number, number, number];
};
```

`minimum` and `maximum` are the object's bounds in the model's own units, in
Z-up coordinates as in 3D Tiles: a point at glTF `(x, y, z)` is `(x, -z, y)`
here. They're the same for loaded and streamed models, and don't change when the
viewer moves or scales the model. To keep the list in state, use
`useViewerModel` and pass its `handleObjectCatalog`.

### `onModelLoaded`

Optional callback fired after the model has loaded, with its bounds and mesh
count:

```ts
(model: ViewerModelInfo) => void

type ViewerModelInfo = {
  bounds: { min: Vec3; max: Vec3; center: Vec3; size: Vec3 }; // world space
  objectCount: number; // meshes in the loaded scene
  materialVariants: string[]; // glTF material variant names, if any
  materialVariantGroups: MaterialVariantGroup[]; // the same, as option groups
};
```

For the model's object names, use [`onObjectCatalog`](#onobjectcatalog).

### `onLoadError`

Optional callback fired if the model fails to load or render.

Current callback shape:

```ts
(error: unknown) => void
```

Whether or not you pass it, `ModelViewer` shows a message in place of the
model that explains the likely cause: a missing file (404), refused access
(401/403), a blocked cross-origin request (CORS), a web page served instead of
a model, or a file that isn't the expected format. It includes the URL and the
underlying error. Set `showLoadingOverlay={false}` to show your own instead.

### `onProgress`

Called with the loader's `ProgressEvent` while a monolithic model is being
downloaded. When `event.lengthComputable` is true, progress is
`event.loaded / event.total`; the built-in loading overlay uses the same value.

```ts
onProgress?: (event: ProgressEvent) => void
```

### `onAction`

Optional callback fired when a built-in action button is clicked from the side panel.

Current event shape:

```ts
type ObjectActionEvent = {
  objectId: string;
  action: ObjectBindingAction;
  binding?: ObjectBinding;
  screenX?: number;
  screenY?: number;
};
```

### `onEngagement` / `debugEngagement`

Optional interaction analytics. Set `onEngagement` to receive typed
`ViewerEngagementEvent` objects, or set `debugEngagement` to log them in the
browser's developer console with the `[react-immersive engagement]` prefix.
Both are disabled by default. The viewer does not send telemetry or persist
analytics identifiers; your callback decides where events go.

```tsx
import { ModelViewer, type ViewerEngagementEvent } from "@liveroom-tech/react-immersive";

function handleEngagement(event: ViewerEngagementEvent) {
  if (event.type === "part-viewed") {
    console.info("Part viewed:", event.objectKey, event.source);
  }
  if (event.type === "ar-ended") {
    console.info("Time in AR:", event.durationMs);
  }
  // Connect this callback to your application's analytics integration.
}

<ModelViewer
  modelUrl="/car.glb"
  licenseKey={licenseKey}
  onEngagement={handleEngagement}
  debugEngagement
/>
```

Every event includes `sessionId` (an ephemeral ID for this viewer/model),
`timestamp` (ISO format), `elapsedMs`, `modelUrl`, and `tilesetUrl` (or `null`).
Durations use a monotonic clock and are expressed in milliseconds. Session
elapsed time includes loading and background time; it is not an attention metric.

| Event `type` | Details and trigger |
| --- | --- |
| `part-viewed` | `objectId`, `objectKey`, optional `label`, and `source` (`"canvas"`, `"panel"`, or `"keyboard"`). Selecting/focusing a different part; reselecting the current part is ignored. |
| `variant-chosen` | `variant`, `previousVariant` (names, or `null` for the default), and `group` (the option group's name, or `null`). Choosing or clearing a built-in material variant; `previousVariant` is the earlier choice in the same group. |
| `ar-started` | A confirmed immersive WebXR AR session begins. |
| `ar-ended` | `durationMs` and `reason` (`"session-ended"` or `"interrupted"`). A confirmed AR session ends, or tracking stops on model change, unmount, or context loss. |
| `ar-launch-requested` | `channel` (`"quick-look"` or `"mobile-handoff"`). Opening external AR or its QR handoff; this does not claim an AR session started. |
| `tour-started` | `annotationCount`. Starting the guided tour. |
| `tour-completed` | `annotationCount` and `durationMs`. Advancing past its final annotation; emitted once per completed tour. |
| `tour-stopped` | `annotationCount`, `durationMs`, and `reason` (`"stopped"`, `"restarted"`, `"annotations-changed"`, or `"interrupted"`). Leaving a tour before completion. |

Hover, camera motion, renders, and externally supplied selection/variant updates
do not create engagement events. WebXR duration measures the session interval;
Quick Look runs outside the page and has no reliable duration callback. Turning
tracking on during an existing AR session measures from attachment. Callback
changes do not restart timing, and synchronous or asynchronous callback failures are logged without
interrupting the viewer. A new model or re-enabling tracking creates a new
analytics session; WebGL recovery keeps the session ID; context loss ends active intervals
as interrupted.

### `onViewerReady`

Optional callback fired once camera controls are available and again when the
viewer publishes updated ready-state data (for example after model load,
camera changes, or binding changes).

Current callback shape:

```ts
(viewer: ViewerReadyState) => void
```

`ViewerReadyState` includes `captureImage`, an imperative method for grabbing a PNG snapshot of the canvas:

```ts
type ViewerReadyState = {
  objectBindings: Record<string, ObjectBinding>;
  homeCameraState: { position: Vec3; target: Vec3 } | null;
  captureImage: (options?: CaptureImageOptions) => Promise<string>;
  captureVideo: (options?: CaptureVideoOptions) => Promise<Blob>;
  invalidate: () => void;
  rendererBackend: "webgl" | "webgpu"; // which renderer draws; see `webgpu`
  raw: {
    controls: CameraControls; // camera-controls
    scene: Object3D | null; // three.js
    nodes: Record<string, Object3D>; // model nodes by binding key and name
  };
};

type CaptureImageOptions = {
  width?: number;
  height?: number;
  transparent?: boolean;
};
```

`raw` holds the live three.js scene, the camera-controls instance, and the
model's nodes, for integrations the rest of the API doesn't cover. You don't
need it for anything the hooks and props already do, and its shapes are those
libraries' own, so they can change when those libraries do.

`captureImage` requires the opt-in `preserveDrawingBuffer` prop, forces a render, and resolves with a `data:image/png` URL. Pass `width`/`height` to render at a resolution other than the canvas's current size, and `transparent` to hide the configured background so the PNG carries an alpha channel instead. It rejects if called before the viewer is ready or when framebuffer preservation is disabled. The Download PNG menu item is also shown only when this prop is enabled.

```tsx
<ModelViewer
  preserveDrawingBuffer
  onViewerReady={(viewer) => {
    viewer
      .captureImage({ width: 1920, height: 1080, transparent: true })
      .then((dataUrl) => {
        // upload, preview, etc.
      });
  }}
/>;
```

Note: requesting a custom `width`/`height` briefly resizes the live canvas to render at that resolution before restoring it, which can cause a momentary flicker on screen, fine for an occasional snapshot, not for rapid/looped calls.

If camera, effects, screenshots, or custom setup all need the ready viewer, combine them with `useViewerConnection`:

```tsx
const camera = useViewerCamera();
const effects = useViewerEffects();
const connection = useViewerConnection(camera, effects);

<ModelViewer
  preserveDrawingBuffer
  onViewerReady={connection.handleViewerReady}
/>;

const dataUrl = await connection.captureImage({ width: 1920, height: 1080 });
```

`captureVideo` records one complete cinematic pass or turntable revolution and
resolves with a video `Blob`. It is also available on `useViewerConnection` and
`useViewer().connection`. Call it from a button handler after the model has
finished loading and framing; ready-state callbacks run repeatedly as the camera
moves and should not start recordings automatically.

```tsx
const viewer = useViewer();
const abort = new AbortController();

<ModelViewer {...viewer.props} cinematic showDownloadButton />;

// Run in an event handler. Upload the Blob or preview it with an object URL.
const clip = await viewer.connection.captureVideo({
  mode: "turntable", // or "cinematic" to use the enabled camera path
  format: "auto",    // prefers WebM; falls back to MP4. "gif" for an animated GIF
  duration: 12,      // seconds; defaults to path timing or a 24-second orbit
  fps: 30,          // 1–60; actual throughput depends on rendering/encoding
  videoBitsPerSecond: 8_000_000,
  signal: abort.signal,
});
// abort.abort() cancels an in-progress export and discards its data.
```

The download menu offers **Record turntable video** and, when cinematic is
enabled, **Record cinematic video**, plus Auto/WebM/MP4/GIF format selection. A
recording shows progress and a Cancel control. The filename and Blob MIME type
match the encoded format; an explicitly requested unsupported format rejects
instead of silently changing formats. With `loop: true`, a cinematic export
includes the return segment and stops after one cycle.

Recording runs in real time at the canvas's current pixel resolution, includes
post-processing, and hides editor gizmos. It pauses cinematic playback, blocks
viewer gestures, then restores the previous camera pose and controls on success,
cancellation, or failure. Keep the tab visible until recording completes.
`preserveDrawingBuffer` is unnecessary for video. No audio, HTML overlays, or
format transcoding is included. The browser must support
`canvas.captureStream`, and `MediaRecorder` for WebM/MP4; exports reject before framing,
during XR, during another recording, or for durations outside (0, 300] seconds.

**Animated GIF.** Pass `format: "gif"` (or pick **GIF** in the menu's format
select) for a GIF that loops forever, for places that don't play video, such as
email, chat, and some marketplaces:

```ts
const gif = await connection.captureVideo({
  mode: "turntable",
  format: "gif",
  gifWidth: 480, // pixels; the height follows the canvas. Default 480
  // fps defaults to 15, and a turntable to an 8-second turn
});
```

A GIF holds 256 colours per frame and stores every frame whole, so it is much
larger than a video of the same length and shows some banding on smooth
gradients. Frames are taken from the same stream as a video and encoded as
they're captured, so a long recording doesn't build up memory. Each frame lasts
as long as it really showed, so a busy device drops frames rather than playing
the GIF fast. `videoBitsPerSecond` doesn't apply to GIFs. The encoder
([gifenc](https://github.com/mattdesl/gifenc)) loads only when a GIF is made.

### `onTextureUpload`

Optional async callback for handling texture file uploads. When provided, the viewer calls it instead of creating a blob URL, letting consumers upload to their own storage (S3, Cloudinary, a CDN, etc.) and return a durable URL that survives page reloads.

Current callback shape:

```ts
(file: File, objectId: string) => Promise<string>;
```

The returned string is stored in `binding.style.material.texture.path` via `onObjectBindingsChange`.

If omitted, the viewer falls back to `URL.createObjectURL(file)` which produces a short blob URL that works for the current session but is lost on reload.

Example:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  onObjectBindingsChange={setObjectBindings}
  onTextureUpload={async (file, objectId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("objectId", objectId);
    const res = await fetch("/api/upload-texture", {
      method: "POST",
      body: formData,
    });
    const { url } = await res.json();
    return url; // e.g. "https://cdn.example.com/textures/abc123.png"
  }}
/>
```

### `texturePositioning`

Turns on texture positioning for objects with an uploaded texture. Off by
default. When on, the **Change Material** panel gains Offset X/Y and Rotation
controls, and double-clicking the object puts the viewer in Move/Zoom mode:
drag to move the texture, scroll to scale it, and click the canvas or
**Done positioning** to finish.

```tsx
<ModelViewer modelUrl="/sofa.glb" licenseKey="your-license-key" texturePositioning />
```

Changes are written to the binding's `style.material.texture` (`offset`,
`rotation` in radians, and `scale`), so they reach `onObjectBindingsChange`
and your saved bindings like any other edit.

To handle some of it yourself, pass an object instead of `true`. Any field you
leave out keeps the viewer's own behavior:

```ts
type TexturePositioningControls = {
  offset?: [number, number]; // shown in the Offset fields instead of the binding's
  rotationDegrees?: number; // shown in the Rotation field, 0–360
  onOffsetChange?: (objectId: string, axisIndex: 0 | 1, value: number) => void;
  onRotationChange?: (objectId: string, degrees: number) => void;
  isPositioning?: boolean; // shows "Done positioning" instead of the hint
  onEndPositioning?: () => void; // after Done positioning ends the mode
};
```

`onOffsetChange` and `onRotationChange` replace the viewer's writes from the
panel fields; dragging and scrolling on the canvas still write to the binding.

---

### `onAnimationsReady`

Optional callback fired after the GLB/GLTF model is loaded, providing animation controls. If the model contains no animations, it is still called with an empty `clips` array and no-op control functions.

Current callback shape:

```ts
(controls: AnimationControls) => void
```

Where `AnimationControls` is:

```ts
type AnimationPlayOptions = {
  alongside?: boolean; // keep the clips already playing (default false: replace them)
  fade?: number; // seconds to fade in, and to fade out the clips it replaces
  reverse?: boolean; // play backwards, from where the clip is or from its end
};

type AnimationClipState = {
  clip: string;
  status: "playing" | "paused" | "finished"; // finished: a play-once clip holding its last pose
  time: number; // seconds
  duration: number; // seconds
  speed: number;
  reverse: boolean;
};

type AnimationPlaybackState = {
  currentClip: string | null; // the clip played most recently, while it's active
  isPlaying: boolean; // whether any clip is playing
  speed: number; // speed, position and length of currentClip
  time: number;
  duration: number;
  active: AnimationClipState[]; // every active clip, most recently played last
};

// Leave out clipName to act on every active clip.
type AnimationControls = {
  clips: string[];
  clipDetails?: { sourceName: string; duration: number }[];
  play: (clipName: string, options?: AnimationPlayOptions) => void;
  pause: (clipName?: string) => void;
  stop: (clipName?: string) => void; // stops and resets the pose
  setSpeed: (speed: number, clipName?: string) => void;
  seek?: (time: number, clipName?: string) => void; // absolute time, in seconds
  getState?: () => AnimationPlaybackState;
  subscribe?: (listener: (state: AnimationPlaybackState) => void) => () => void;
};
```

Wire this to `useViewerAnimations().handleAnimationsReady` for the simplest integration.
When `sceneConfig.animations.autoplayClip` is set, `ModelViewer` will auto-play
that clip on load and respect per-clip `loopMode` (`"repeat"`, `"once"`, or
`"ping-pong"`), `speed`, `displayName`, and soft-delete (`hidden`) settings.

### Lighting

Lighting lives in `sceneConfig.lighting`: an ambient light plus a list of
directional, point, spot, and hemisphere lights. Without a `sceneConfig`,
`ModelViewer` uses its default rig (ambient, a hemisphere fill, and a
shadow-casting key light). To use your own lights, patch the default scene
config. `sceneLight` fills in every setting you leave out:

```tsx
import {
  DEFAULT_SCENE_CONFIG,
  patchSceneConfig,
  sceneLight,
} from "@liveroom-tech/react-immersive/utils";

const sceneConfig = patchSceneConfig(DEFAULT_SCENE_CONFIG, {
  lighting: {
    ambient: { intensity: 0.5 },
    lights: [
      sceneLight({ id: "key", type: "directional", position: [4, 8, 4], intensity: 1.6, castShadow: true }),
      sceneLight({ id: "fill", type: "point", position: [-3, 3, 2], intensity: 0.8 }),
    ],
  },
});

<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  sceneConfig={sceneConfig}
/>;
```

To change lights while the app runs, use the lights controller from
`useViewer` (or `useSceneConfig`):

```tsx
const viewer = useViewer({ sceneConfig });

viewer.scene.lights.setIntensity("key", 2.2);
viewer.scene.lights.toggle("fill");
viewer.scene.lights.add({ id: "bulb", type: "point", color: "#ffd27d", intensity: 4 });
viewer.scene.lights.attach("bulb", { objectId: "Lamp", offset: [0, 1.4, 0] });
```

An attached light follows the object, offset from the object's origin in its
local space (the origin is often at its base, not its center). Lighting set up
in `BindingBuilder`'s Scene tab exports as the same `sceneConfig`.

### Style rules

`sceneConfig.styleRules` restyles objects from their own data while the app
runs: a colour for a temperature, grey for a disabled part, a pulsing glow for
an alarm. Each rule picks objects (`target`), checks their data (`when`), and
sets a look (`material`, `colorScale`, `pulse`):

```tsx
const viewer = useViewer({
  bindings,
  sceneConfig: {
    ...DEFAULT_SCENE_CONFIG,
    styleRules: [
      {
        id: "temperature",
        target: { group: "pumps" },
        colorScale: {
          metric: "temperature",
          stops: [[18, "#3b82f6"], [24, "#22c55e"], [32, "#ef4444"]],
        },
      },
      {
        id: "offline",
        when: { status: "disabled" },
        material: { baseColor: "#9ca3af", opacity: 0.4 },
      },
      {
        id: "alarm",
        when: [{ metric: "temperature", above: 32 }, { metadata: "alarm.acknowledged", equals: false }],
        pulse: { color: "#ff3b30", speed: 1.5 },
      },
    ],
  },
});

<ModelViewer modelUrl="/plant.glb" licenseKey="your-license-key" {...viewer.props} />;

// Live data: update the bindings and the looks follow.
viewer.bindings.updateObjectBindings("pump-3", { metrics: { temperature: 34 } });
viewer.bindings.updateObjectBindings("valve-1", { status: "disabled" });
```

- `target` takes the same targets as the binding helpers: an id, a list of
  ids, `{ group }`, `{ tag }`, or `{ type }`. Left out, the rule considers every
  bound object.
- `when` is a condition, or a list that must all match; left out, the rule
  always applies. Conditions: `{ metric, above?, below? }` (the value must be
  greater than `above` and less than `below`; an object without the metric
  doesn't match), `{ status }` with one status or a list (a binding without
  one counts as `"normal"`), and `{ metadata, equals }`, where dots in the key
  reach into nested metadata.
- `material` accepts any `style.material` field. `colorScale` sets
  `baseColor` (or `emissive`, with `channel: "emissive"`) from a metric,
  blending between hex colour stops and taking the nearest stop outside them.
  `pulse` makes the glow fade in and out (`true`, or `{ color, speed }` in
  pulses per second).
- Rules apply in order over each object's own `style.material`, so a later
  rule wins where two set the same field. Hover and selection highlighting
  still show on top.
- Rules only change how objects look. `objectBindings`, `onObjectBindingsChange`,
  and every callback keep the object's own values, so nothing a rule sets is
  saved with the bindings.
- The pulse isn't drawn on streamed 3D Tiles models (`tilesetUrl`); the other
  looks are.

BindingBuilder's Scene tab has a **Rules** sub-tab for building these rules
visually. It suggests your groups, tags, types, metric names, and metadata
keys, shows how many objects each rule matches right now, and previews the
result live. Rules export and import with the rest of `sceneConfig`.

`applyStyleRules(bindings, rules)` (from the main entry or `/utils`) returns
the styled bindings, for example to colour your own list the way the viewer
does, and `colorScaleValue(stops, value)` the colour a scale gives a value, for
a legend.

### `camera`

Optional starting camera: where it is and its lens.

```ts
type ViewerCameraConfig = {
  position?: [number, number, number];
  fov?: number; // vertical field of view in degrees; default 50
  near?: number;
  far?: number;
  zoom?: number;
};
```

Without a `position`, the camera starts at `[0, 0, 5]`. Pass one for predictable framing.

Example:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  camera={{
    position: [0, 2.2, 7],
    fov: 40,
    near: 0.1,
    far: 1000,
  }}
/>
```

Passing an explicit `camera` counts as choosing the initial view yourself, so the mount-time auto-fit (see [`onAutoFit`](#onautofit)) is skipped automatically and your `position`/`fov` stick. Provide `onAutoFit` as well only if you want to run your _own_ fit-to-scene logic instead.

### `cameraLimits`

Constrains how far the orbit camera can zoom, tilt, turn, and pan. Angles are
in degrees.

```tsx
<ModelViewer
  modelUrl="/car.glb"
  licenseKey="your-license-key"
  cameraLimits={{
    minDistance: 2,
    maxDistance: 12,
    maxPolarAngle: 85, // stay above the floor
    minAzimuthAngle: -60, // turn at most 60° either side of the front
    maxAzimuthAngle: 60,
  }}
/>
```

```ts
type CameraLimits = {
  minDistance?: number; // default 0
  maxDistance?: number; // default Infinity
  minPolarAngle?: number; // degrees, default 0
  maxPolarAngle?: number; // degrees, default 180
  minAzimuthAngle?: number; // degrees, default -Infinity
  maxAzimuthAngle?: number; // degrees, default Infinity
  panBoundary?: [
    min: [number, number, number],
    max: [number, number, number],
  ];
  boundaryEnclosesCamera?: boolean; // default false
  boundaryFriction?: number; // default 0
};
```

- **Polar** is the vertical angle: `0` looks straight down from above, `90` is
  level with the target, and `180` looks straight up from below.
- **Azimuth** is the horizontal angle around the vertical axis: `0` views the
  target from the front (+Z), `90` from its right (+X), and `-90` from its left.

`panBoundary` is an axis-aligned world-space box. These limits apply to the
orbit controller; pointer-lock mode is not orbiting around the same target.

### `backgroundColor`

Optional background color for the viewer canvas.

Example:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  backgroundColor="#0f172a"
/>
```

### `shadows`

Optional boolean that controls whether the viewer renders shadows.

Default:

```ts
true;
```

When `true`, the canvas renders soft shadows: the default light rig casts a shadow from a directional key light, furniture and decor meshes cast and receive shadows, and ambient occlusion is applied through post-processing. When `false`, shadow map rendering is disabled entirely on the canvas, so there is no shadow-pass cost (the per-mesh and light `castShadow`/`receiveShadow` flags are simply ignored).

Example:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  shadows={false}
/>
```

> **Interior models (rooms, dollhouses):** a single large mesh usually forms the walls/ceiling enclosure. If that shell cast shadows it would seal the whole interior in darkness when lit from outside, so the viewer automatically detects the enclosure (a mesh spanning most of the scene footprint in both horizontal axes) and excludes it from casting while still letting it **receive** shadows. Furniture and decor then cast realistic contact shadows onto the floor. See [How Rendering Works](#how-rendering-works).

### `onCameraChange`

Optional callback fired whenever the camera moves, with its plain state. It
fires often while the user orbits, pans, or zooms.

```ts
(state: ViewerCameraState) => void

type ViewerCameraState = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number | null;
  zoom: number;
  azimuthAngle?: number; // radians, for setCameraState to restore
  polarAngle?: number; // radians
};
```

It's the same state `useViewerCamera` exposes as `cameraState`, and
`setCameraState` restores it.

### `showObjectBindingDataPanel`

Optional boolean that controls whether the built-in left object details panel is rendered.

Default:

```ts
true;
```

### `customObjectBindingDataPanel`

Optional render prop for replacing the built-in left object details panel.

Current prop shape:

```ts
type CustomObjectBindingDataPanelProps = {
  isOpen: boolean;
  selectedObject: ObjectBinding | null;
  currentAction: ObjectActionEvent | null;
  onClose: () => void;
  onAction: (event: ObjectActionEvent) => void;
};
```

When provided, `ModelViewer` passes its existing internal handlers into your custom panel. Your panel can call them, wrap them, or ignore them.

### `overlay`

Your own UI over the 3D view: badges, HUDs, buttons, custom panels. It sits
above the model and below the viewer's toolbars and banners.

```tsx
<ModelViewer
  modelUrl="/sofa.glb"
  licenseKey="your-license-key"
  overlay={
    <div style={{ position: "absolute", top: 16, left: 16 }}>
      In stock <button onClick={addToCart}>Add to cart</button>
    </div>
  }
/>
```

The layer covers the view but lets pointer events through, so the model stays
draggable around your elements. Its direct children receive pointer events, so
position them yourself (for example with `position: "absolute"`) rather than
wrapping everything in one full-size container.

### `unsafe_sceneChildren`

react-three-fiber elements rendered inside the scene, for anything the viewer
can't do itself, such as custom geometry, a helper, or an effect driven by
`useFrame`:

```tsx
import { useFrame } from "@react-three/fiber";

function Marker() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => (ref.current!.rotation.y += delta));
  return (
    <mesh ref={ref} position={[0, 1.5, 0]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

<ModelViewer {...props} unsafe_sceneChildren={<Marker />} />;
```

They're rendered inside their own `Suspense` boundary, so a child that loads
assets doesn't hold up the model. Because they work with three.js directly,
they're outside the viewer's own API: the name says so, and they can break when
three.js or react-three-fiber change. Prefer the props and hooks for anything
they cover.

### `customSceneObjectsPanel`

Optional render prop for replacing the built-in right scene objects panel.

Current prop shape:

```ts
type CustomSceneObjectsPanelProps = {
  objectBindings: Record<string, ObjectBinding>;
  onAction?: (event: ObjectActionEvent) => void;
  onFocus?: (binding: ObjectBinding) => void;
  onHover?: (binding: ObjectBinding | null) => void;
};
```

When provided, `ModelViewer` passes the current bindings plus its built-in action, focus, and hover handlers into your custom panel.

### `showSceneObjectsPanel`

Optional boolean that controls whether the built-in right scene objects panel is rendered.

Default:

```ts
true;
```

### `showDownloadButton`

Optional boolean that enables the download split-button (export GLB, export the
model's UV layout, and—when `preserveDrawingBuffer` is enabled—export a PNG
screenshot).

Default:

```ts
true;
```

UV export downloads an editable 2048×2048 SVG UV-island outline when the model
uses one material. For multi-material models it downloads a ZIP containing one
SVG texture template per material. Meshes without a `uv` attribute are omitted;
when the model has no UV coordinates, the viewer reports that no layout is
available.

The bottom-right action bar renders when at least one of `showResetButton`, `showDownloadButton`, `showFullscreenButton` (when supported), or (`showAnnotationNavigation` with annotations present) is `true`.

### `downloadFilename`

Optional filename stem for the built-in model export button.

Default:

```ts
"model";
```

### `showResetButton`

Optional boolean that shows the "reset camera view" button in the bottom-right action bar.

Default:

```ts
true;
```

### `showFullscreenButton`

Optional boolean that adds an enter/exit fullscreen toggle to the bottom-right
action bar. Its grouped form is `ui.fullscreen`. Default: `false`.

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey={licenseKey}
  ui={{ fullscreen: true }}
/>
```

Fullscreen expands the whole viewer, including its panels and overlays. The
button reflects browser exits such as Escape, and is hidden when fullscreen is
unavailable. It is temporarily disabled during video recording. Embedded viewers
need an iframe with `allow="fullscreen"` (or `allowFullScreen` in React). A rejected
request displays an error beside the button; see the
[Fullscreen API permissions](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen#security).

### `showLoadingOverlay`

Optional boolean controlling whether the built-in loading overlay is shown while the model is loading and the initial camera fit is settling, and the load-error message if the model fails to load (see [`onLoadError`](#onloaderror)).

Default:

```ts
true;
```

### `showMouseController`

Optional boolean that renders an on-screen joystick controller for moving the camera with a mouse or touch, useful on touch devices or kiosk layouts where drag-to-orbit is awkward.

Default:

```ts
false;
```

### `mouseControllerPosition`

Optional placement for the on-screen controller.

```ts
type MouseControllerPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "center"
  | "center-bottom"
  | "center-top";
```

### `mouseControllerOpacity`

Optional opacity for the on-screen controller.

Default:

```ts
1;
```

### `moveSensitivity`

Optional movement sensitivity for the on-screen controller.

Default:

```ts
0.08;
```

### `zoomSensitivity`

Optional zoom sensitivity for the underlying `CameraControls` zoom interaction (mouse wheel / trackpad / pinch).

Default:

```ts
1.0;
```

Example:

```tsx
<ModelViewer
  modelUrl="/model.glb"
  licenseKey="your-license-key"
  objectBindings={objectBindings}
  showMouseController
  mouseControllerPosition="bottom-right"
  mouseControllerOpacity={0.8}
  moveSensitivity={0.1}
  zoomSensitivity={1.2}
/>
```

### `sceneConfig`

Optional scene-wide configuration object (`SceneConfig`) covering model, camera, lighting, wireframe, shadows, environment, background, ground shadows, post-processing, animations, and annotations. It is the same shape authored by `BindingBuilder`'s Scene tab. If omitted, the viewer uses its built-in default scene config.

`sceneConfig.animations` drives autoplay and per-clip playback settings, and `sceneConfig.annotations` seeds the annotation markers rendered on the model.

`sceneConfig.model.renderer` accepts `"pbr"`, `"matcap"`, or `"uv-checker"`.
UV Checker temporarily replaces every mesh material with an unlit numbered test
chart without changing `objectBindings` or uploaded textures. Switching back
restores the original material references. Meshes without UV0 coordinates appear
magenta and trigger an explanatory notice.

```tsx
<ModelViewer
  {...props}
  sceneConfig={{
    ...sceneConfig,
    model: { ...sceneConfig.model, renderer: "uv-checker" },
  }}
/>
```

### `onSceneConfigChange`

Called with an updated `SceneConfig` when viewer-owned scene editing changes
the configuration. Currently this is used when a light-position or rotation
gizmo moves a scene-config light. Update controlled `sceneConfig` state with
the value returned by this callback.

```ts
onSceneConfigChange?: (config: SceneConfig) => void
```

### `disableZoom`

Optional boolean. When `true`, the viewer never zooms the camera to an object on selection (selection still highlights and fires callbacks).

Default:

```ts
false;
```

### `zoomOnSelected`

Optional boolean controlling whether selecting an object zooms/fits the camera to it. Set to `false` to keep the current camera framing on selection. Zooming is also skipped when `disableZoom` is `true`.

Default:

```ts
true;
```

### `highlightOnHover`

Controls hover highlighting for the canvas, built-in object list, and
`panelHoveredObject`. Default: `true`. On very large models, viewport hover is
disabled for performance, while panel-row highlighting remains available.

### Moving and rotating objects

Set `moveModeEnabled` to show a centered Drei `PivotControls` gizmo for the
selected bound object. Translation arrows, plane handles, and rotation rings
are available together; scaling is not enabled. While object editing is on,
the camera controls are paused so pointer drags manipulate the object instead
of the camera.

```tsx
import { useState } from "react";
import {
  ModelViewer,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";

export function EditableViewer({
  initialBindings,
}: {
  initialBindings: Record<string, ObjectBinding>;
}) {
  const [objectBindings, setObjectBindings] = useState(initialBindings);

  return (
    <ModelViewer
      modelUrl="/model.glb"
      licenseKey="your-license-key"
      objectBindings={objectBindings}
      onObjectBindingsChange={setObjectBindings}
      moveModeEnabled
      objectTransformSpace="world"
    />
  );
}
```

Click a bound mesh to select it, then drag an arrow to move on one axis, a
plane handle to move on two axes, or a ring to rotate. The pivot is placed at
the center of the selected object's renderable geometry, so rotation happens
around the object itself even when the source model's node origin is elsewhere.

`objectTransformSpace` accepts:

- `"world"` (default): the gizmo remains aligned with the scene axes
- `"local"`: the gizmo follows the selected object's current orientation

Axis space changes the direction of the handles; it does not change the
object's position when toggled. The resulting `transform.position` and
`transform.rotation` values are always persisted in the object's local space,
with rotation stored in radians.

Passing `onObjectBindingsChange` makes binding edits controlled, so the parent
must store the returned record as shown above. Without that callback,
`ModelViewer` keeps edits internally for the mounted viewer. Similarly, when
you pass `selectedObject`, update it from `onObjectSelect`; otherwise selection
is managed internally.

### `enableCameraControls`

Optional boolean controlling orbit, pan, and zoom input. Default: `true`.
Camera controls are temporarily disabled whenever `moveModeEnabled` is on.

### `cameraControllerType` / `onCameraControllerChange`

Selects the active camera interaction mode:

- `"orbit"` (default) uses orbit, pan, and zoom controls.
- `"pointerLock"` captures the pointer for first-person look-around. Leaving
  pointer lock returns the viewer to orbit mode.

The viewer's camera-controller menu can manage this internally. Pass
`cameraControllerType` to control it from application state and update that
state from `onCameraControllerChange`.

```tsx
const [controller, setController] = useState<"orbit" | "pointerLock">("orbit");

<ModelViewer
  {...props}
  cameraControllerType={controller}
  onCameraControllerChange={setController}
/>
```

Auto-rotation pauses while pointer-lock mode is active.

### `autoRotate` / `autoRotateSpeed`

Enables automatic orbiting and controls its speed. Defaults are `false` and
`1`. When these props aren't passed, `sceneConfig.model.autoRotate` and
`sceneConfig.model.autoRotateSpeed` apply, so a scene exported from
`BindingBuilder` can carry the same behavior. When they are passed, they win.

```tsx
<ModelViewer {...props} autoRotate autoRotateSpeed={0.75} />
```

Auto-rotate doesn't start for visitors who ask their device to reduce motion.
See [`reducedMotion`](#reducedmotion).

### `enableKeyboardNavigation`

Optional boolean enabling camera shortcuts after the viewer canvas is clicked
or focused. Default: `false`. Use `W`/`S` to move forward/back, `A`/`D` to
truck left/right, Space/`C` to move up/down, and the arrow keys to orbit.
`Shift` + Up/Down moves forward/back. Keyboard navigation is inactive while
object editing or camera controls are disabled. While the canvas has focus, a
screen reader reads out what its keys do (the `cameraKeyboardHelp` label).

### Accessibility

The viewer can be used without a mouse, and reads out what is happening:

- **Moving through objects with the keyboard.** Tabbing into the viewer reaches
  a small object list at the top of the canvas, shown only while it has focus.
  The arrow keys (or `Home` and `End`) move through the objects and highlight
  each one in the scene. Typing a letter jumps to an object whose name starts
  with it. `Enter` or Space selects the object, exactly as clicking it would,
  and `Escape` clears the selection. Screen readers hear each object's name and
  its position ("Wheel, 3 of 12"). The list follows the scene objects panel's
  order. It skips hidden objects, and objects an isolation has set aside.
- **Announcing the selection.** Every change of selection is announced, whether
  it came from a click, the keyboard, the objects panel, or your app ("Wheel
  selected", "Selection cleared").
- **The scene objects panel.** Each row is a button, so the panel can be used
  from the keyboard too. Focusing a row highlights its object, and the
  visibility buttons name the object they hide or show.
- **Reduced motion.** See [`reducedMotion`](#reducedmotion) below.

All of this text can be translated with `labels`.

### `showObjectNavigator`

Optional boolean for the keyboard object list described above. Default: `true`.
It takes no space until a keyboard user reaches it, so it's on by default. Set it
to `false` when your app provides its own way to choose objects from the
keyboard. It is hidden while measuring, since clicks then place points instead
of selecting. Keyboard selections reach `onEngagement` as `part-viewed` events
with `source: "keyboard"`.

```tsx
<ModelViewer {...props} ui={{ objectNavigator: false }} />
```

### `reducedMotion`

Cuts motion the viewer starts on its own, for visitors who find it hard to
watch. Default: `"user"`, which follows the visitor's device setting
(`prefers-reduced-motion`). `"always"` and `"never"` override it. Also
`controls.reducedMotion`; the type is exported as `ReducedMotionSetting`.

When motion is reduced:

- Auto-rotate doesn't start.
- A `cinematic` path with `autoPlay` waits for its play button.
- Camera moves jump straight to where they're going instead of gliding: the
  first framing, focusing a selected object, resetting the view, saved views,
  guided-tour stops, and moves made through `useViewerCamera`.
- Panels, menus and popups appear in place instead of sliding or fading in.
  Loading spinners keep turning, since they show that something is still
  happening.

Motion the visitor asks for still plays: the cinematic play button, video
export, and dragging the camera. The viewer doesn't change animations your app
starts, such as model clips, effects, or style rule pulses. To respect the
setting there too, check `matchMedia("(prefers-reduced-motion: reduce)")` in
your app. `SimpleModelViewer` takes the same prop.

### `showViewGizmo`

Optional boolean showing a clickable orientation gizmo in the top-right of the
viewer. Default: `false`. It indicates the camera's view of the scene axes and
can snap the camera to an axis; it is separate from the selected object's
transform gizmo and is hidden while `moveModeEnabled` is on.

### `onAutoFit`

Optional async callback fired once the model has loaded and the scene is ready. When provided, the viewer calls it so consumers can run their own fit-to-scene behavior (e.g. an animated fit); if omitted, the viewer falls back to its internal `fitScene`, unless an explicit [`camera`](#camera) prop was given, in which case that position is treated as the chosen initial view and `fitScene` is skipped.

Current callback shape:

```ts
() => Promise<boolean>;
```

### `refitOnResize`

Optional boolean controlling whether the camera re-frames the model to fit whenever the canvas is resized, a browser window resize, a device rotation, or a side panel opening/closing (which changes how much width the canvas has). Set to `false` to preserve the user's current orbit/zoom across resizes; the camera aspect stays correct either way, so the model never distorts, it just isn't re-centered. This only affects re-fits _after_ the initial mount-time auto-fit.

While a selected object is framed (see `zoomOnSelected`), a resize frames that object again rather than the whole model, so the object panel opening doesn't undo the zoom. An object with an authored `cameraState` keeps that view. Once the selection is cleared, or something else moves the camera away from the object, resizes frame the whole model again.

Default:

```ts
true;
```

### `onAnnotationsChange`

Optional callback fired when the annotation markers on the model change (added, edited, or removed through the viewer UI).

Current callback shape:

```ts
(annotations: AnnotationMarker[]) => void
```

Where `AnnotationMarker` is the `SceneAnnotationMarker` shape:

```ts
type AnnotationMarker = {
  id: number;
  worldPosition: [number, number, number];
  localPosition: [number, number, number];
  title: string;
  description: string;
};
```

### `activeAnnotation` / `onActiveAnnotationChange`

Optional controlled state for which annotation is currently open. Pass `activeAnnotation` to control it from your app, and `onActiveAnnotationChange` to be notified when the viewer wants to open (`AnnotationMarker`) or close (`null`) one. If `activeAnnotation` is left `undefined`, the viewer manages this state internally (uncontrolled).

Current shapes:

```ts
activeAnnotation?: AnnotationMarker | null;
onActiveAnnotationChange?: (annotation: AnnotationMarker | null) => void;
```

### `renderMode`

Optional render loop mode. `"demand"` (default) only re-renders the canvas when something changes (camera move, state update, animation frame); `"always"` runs a continuous render loop.

### `maxDpr`

Optional upper bound for the device pixel ratio used when rendering, so retina/4K displays don't render at full 2–3x cost.

Default:

```ts
2;
```

### `preserveDrawingBuffer`

Optional boolean that retains the WebGL framebuffer for PNG screenshots. It is
`false` by default to avoid imposing framebuffer-retention cost on every frame.
Enable it when using `captureImage` or the built-in Download PNG action.

Default:

```ts
false;
```

### `webgpu`

Optional boolean. Draws with three.js's WebGPU renderer when the browser has
WebGPU, and with WebGL otherwise. Default: `false`. Also `perf.webgpu`.

```tsx
<ModelViewer {...props} perf={{ webgpu: true }} />
```

The viewer asks the browser for a WebGPU adapter once per page before
creating its canvas. Without one, it uses WebGL and says so once in the
console. `onViewerReady` reports which renderer is drawing as
`rendererBackend` (`"webgl"` or `"webgpu"`). The WebGPU renderer is loaded only
by viewers that use it.

With WebGPU, the model, materials, bindings, hover highlight, picking,
animations, decals, annotations, measurement, video and GIF export, and tone
mapping and exposure work as they do with WebGL. Some features are built on
WebGL and are left out:

- The post-processing effects (outline, bloom, depth of field, and the rest)
  don't draw. Tone mapping and exposure from `sceneConfig.postProcessing` still
  apply, through the renderer.
- Contact shadows (`sceneConfig.groundShadows` in shadow-catcher mode) don't
  draw.
- The section cut and the move gizmo (`moveModeEnabled`) aren't available, and
  the console says so if they're asked for.
- AR and VR sessions in the browser (WebXR) aren't offered. Quick Look on iOS
  and the phone hand-off still work.
- Measurement lines are one pixel wide.

`captureImage` and the Download PNG action work with WebGPU without
`preserveDrawingBuffer`. A lost WebGPU device shows the same **Reload viewer**
message as a lost WebGL context.

### Lazy loading and posters

`loading`, `poster` and `reveal` decide when a viewer creates its 3D view, and
what shows in its place until then. They matter most on pages with many
viewers, such as a product grid: browsers allow a page about 16 WebGL contexts
and take the oldest away past that.

```tsx
<ModelViewer {...props} poster="/chair.webp" />
<ModelViewer {...props} poster="/chair.webp" reveal="interaction" />
```

`loading` is `"lazy"` by default. A lazy viewer:

- starts its 3D view when it comes within about 200px of the screen. One that's
  on the screen when the page loads starts at once.
- shares the page's live 3D views with the other lazy viewers: at most 12, or 6
  on phones and tablets. Viewers on the screen come first. One scrolled away
  from keeps its view while there's room, so coming back is instant. When the
  room is needed, it's put away, leaving a picture of its last frame, and is
  built again when it comes back near the screen.
- comes back as it was: the camera, picked variants, light and section-cut
  changes, isolation, the exploded view, the camera controller, the UV checker,
  the annotation filter, and, when the viewer keeps `objectBindings` itself,
  the changes made to them. The selection and open panels don't come back. `onModelLoaded` and
  `onViewerReady` run again, with a new viewer.
- stops drawing while it's off the screen, and starts again when it's back.
  Browsers already stop drawing in hidden tabs.

`loading="eager"` starts the 3D view at once and keeps it. Eager viewers don't
count towards the 12. `BindingBuilder`'s preview is eager.

`poster` is an image shown in the viewer's place until its 3D view is drawn,
then fades out; the loading message shows over it. It's fitted inside the
viewer. To fill the viewer instead, set the CSS variable
`--ri-poster-fit: cover` on a parent. A render of the model framed as the
viewer frames it works best: [`captureImage`](#onviewerready) can make one.

`reveal="interaction"` keeps the poster, with a **View in 3D** button, until the
visitor presses it, so only the products someone picks use a 3D view. The
button's text is the [`labels`](https://react-immersive.liveroom.dev/docs/reference/labels)
key `viewIn3D`. `reveal` is `"auto"` by default: the view starts on its own.

The same three props work on [`SimpleModelViewer`](#simplemodelviewer-public-api)
and [`CompareViewer`](#compareviewer).

---

### `performanceProfile`

Optional control over how aggressively the viewer trades visual fidelity for a stable WebGL context on constrained GPUs.

```ts
performanceProfile?: "auto" | "high" | "low";
```

- `"auto"` (default), applies a reduced profile on handheld/mobile browsers and other low-power touch devices: the postprocessing pipeline is skipped, soft shadows are disabled, and the device pixel ratio is capped. Desktop-class touch devices may still keep the higher-quality path when they advertise plenty of memory. This keeps mobile GPUs within their memory budget so the context isn't lost, which also keeps WebXR (`enableXR`) usable, since a lost context can't start a session.
- `"high"`, always render at full quality (postprocessing, soft shadows, full `maxDpr`), even on mobile. Use when you know the target devices can handle it.
- `"low"`, always apply the reduced profile, on any device.

Default:

```ts
"auto";
```

If the WebGL context is lost, rendering pauses and the viewer displays a
**Reload viewer** button. This message appears even with
`ui={{ loadingOverlay: false }}`. When the browser fires `webglcontextrestored`,
the viewer automatically rebuilds its canvas and scene; the reload button starts
the same rebuild without waiting for browser restoration.

Recovery uses the current props and cached model assets, and cancels video
recording. The rebuilt viewer keeps its camera and the visitor's changes, as a
lazy viewer does when it comes back (see
[Lazy loading and posters](#lazy-loading-and-posters)); the selection,
measurements and playback start over.
`onSceneLoaded`, `onModelLoaded`, `onAnimationsReady`, and `onViewerReady` run again
for the rebuilt scene, so integrations receive fresh controls and object refs.

### `dracoDecoderPath` / `ktx2TranscoderPath` / `meshopt`

Optional controls for the compressed-asset decoders used when loading the GLB/GLTF asset.

```ts
dracoDecoderPath?: string | false;
ktx2TranscoderPath?: string | false;
meshopt?: boolean;
```

Meshopt is bundled and enabled by default. DRACO and KTX2 are also enabled by
default through immutable, versioned decoder builds hosted on the first-party
`assets.react-immersive.liveroom.dev` domain. They are fetched lazily only when a model
uses the corresponding compression format.

```ts
dracoDecoderPath =
  "https://assets.react-immersive.liveroom.dev/three-r184/draco/";
ktx2TranscoderPath =
  "https://assets.react-immersive.liveroom.dev/three-r184/basis/";
```

Pass `false` to disable either decoder. For a fully self-hosted or offline
deployment, version-matched files are included under `dist/decoders`.

Copy those files into your app's public/static directory during deployment:

```sh
cp -R node_modules/@liveroom-tech/react-immersive/dist/decoders public/react-immersive-decoders
```

Then pass the public URL directories (including the trailing slash):

```tsx
<ModelViewer
  dracoDecoderPath="/react-immersive-decoders/draco/"
  ktx2TranscoderPath="/react-immersive-decoders/basis/"
  {...props}
/>
```

The same props are available on `SimpleModelViewer` and `BindingBuilder`. When
using the built-in defaults with a strict CSP, allow the first-party asset
origin and decoder workers; a typical baseline is
`connect-src 'self' https://assets.react-immersive.liveroom.dev; worker-src 'self' blob:; script-src 'self' 'wasm-unsafe-eval'`.
Self-hosted paths only require `'self'`. Older browsers may require their
WebAssembly fallback policy as well.

### `showUvCheckerButton`

Optional boolean that shows a UV Checker toggle button over the canvas. Turning it on temporarily replaces the model's materials with the numbered diagnostic texture; turning it off restores the renderer configured by `sceneConfig`. Missing UV0 coordinates are shown in magenta.

```tsx
<ModelViewer showUvCheckerButton {...props} />
```

Default:

```ts
false;
```

### `showMeasureTools`

Optional boolean that shows measurement tools and a toggleable bounding-box
dimensions overlay. Start measuring, then choose a tool:

- **Distance:** pick points for distances between consecutive picks.
- **Angle:** pick an arm, the angle's vertex, and the other arm. The readout is
  in degrees, with an arc around the middle pick.
- **Area:** pick polygon corners in boundary order, then **Finish area**. The
  closed polygon is shaded and labeled in square units. Concave polygons are
  supported; nonplanar, crossing, touching, duplicate, or collinear boundaries
  show an error. Use Undo to correct a pick.
- **Point to plane:** pick a reference face, then a point. The tool highlights
  the picked triangle and shows the shortest distance to its infinite plane,
  with a perpendicular segment to the projected point.

**No snapping** keeps picks on the surface. **Snap: vertex**, **Snap: edge**,
and **Snap: auto** snap within 12 CSS pixels to vertices or triangle edges on
the picked face. Auto prioritizes nearby vertices. Hover markers identify the
snap target; snapped picks are yellow. Snapping respects world transforms,
instances, and the current pose of skinned/morph geometry. Mesh triangulation
edges can also be snap targets.

Undo removes the last pick; Clear removes the current measurement. Switching
tools clears picks. A new pick after a completed angle, area, or point-to-plane
measurement starts another measurement. Picks are snapshots in world space;
model changes, display rotation, and binding transforms clear them. Pause
animated models before measuring a pose. Hidden objects, decals, and editor
helpers are excluded from picking.

Default:

```ts
false;
```

### `measurementUnit`

Optional unit suffix appended to distance and dimension readouts; area uses its
squared form (for example `m²`). Angles always use degrees. glTF models are
authored in meters by spec, so values are not converted; this only changes the
displayed label.

Default:

```ts
"m";
```

### `showExplodeControls`

Optional boolean that shows an exploded-view slider over the canvas. It slides each bound part outward from the model center to reveal interior/assembly structure, then back to reassemble. Best suited to static product/CAD models, the offset writes node positions each frame, so it conflicts with a playing skeletal animation.

Default:

```ts
false;
```

### `showMaterialVariants`

Shows swatch buttons, centered at the bottom of the viewer, for switching
between the model's glTF material variants (the `KHR_materials_variants`
extension): the colorways, finishes, or trims a product file ships with. Each
button shows the variant's colour when its material is a plain colour. It
appears for a glTF/GLB with any variants. Default `true`.

Variants come in **option groups**, one row each. Choosing a variant replaces
the other choice in its row and keeps the other rows, so a paint colour and a
wheel style combine. Clicking the chosen variant again returns that row to the
file's default materials. The viewer works out the groups from the file:

- A name like `"Paint: Red"` or `"Paint / Red"` puts the variant in a row
  labelled **Paint**, with a button labelled **Red**.
- Otherwise, variants that restyle the same parts share a row, and variants
  that restyle different parts get separate rows. A shoe's `"midnight"`,
  `"beach"` and `"street"` colorways, which all restyle the same parts, are one
  row.

The variants shown are `sceneConfig.model.activeVariants`, at most one from
each group, which is also how you choose them yourself:

```tsx
import { chooseMaterialVariant, useViewer } from "@liveroom-tech/react-immersive";

const viewer = useViewer();

<ModelViewer modelUrl="/car.glb" licenseKey="your-license-key" {...viewer.props} />;

// Once the model has loaded
viewer.model.materialVariants; // ["Paint: Red", "Paint: Blue", "Wheels: Sport", "Wheels: Classic"]
viewer.model.materialVariantGroups;
// [
//   { name: "Paint", variants: [{ name: "Paint: Red", label: "Red", swatch: "#ff0000" }, ...] },
//   { name: "Wheels", variants: [{ name: "Wheels: Sport", label: "Sport" }, ...] },
// ]

viewer.scene.updateSceneConfig({ model: { activeVariants: ["Paint: Red", "Wheels: Sport"] } });
viewer.scene.updateSceneConfig({ model: { activeVariants: [] } }); // the defaults

// Your own swatches: swap a choice within its group, keeping the others.
const active = viewer.scene.sceneConfig.model.activeVariants ?? [];
viewer.scene.updateSceneConfig({
  model: {
    activeVariants: chooseMaterialVariant(active, "Paint: Blue", viewer.model.materialVariantGroups),
  },
});
```

- A variant sets each object's starting material. `objectBindings` material
  overrides (`style.material`) still apply on top of it, and clearing an
  override returns to the variant's material rather than the file's default.
- Objects no active variant maps keep their default material, bound or not.
  If two active variants map the same object, the later one in the list wins.
- A variant's materials and textures load the first time it's chosen; the
  current look stays until they're ready.
- With `onSceneConfigChange`, a pick goes to your scene config (`useViewer`
  wires this up). Without it, `ModelViewer` keeps the picks itself until
  `sceneConfig.model.activeVariants` or `modelUrl` changes.
- A name the model doesn't have is skipped with a console warning listing the
  model's variants.
- An action can switch variants with a scene-config effect:
  `{ sceneConfig: { model: { activeVariants: ["Paint: Red"] } } }`.
- Swatches use the colour of the material a variant puts on the most vertices.
  A textured material gets no swatch, just its label, so showing the buttons
  never loads textures.
- Each pick reaches [`onEngagement`](#onengagement--debugengagement) as a
  `variant-chosen` event with its `group`.
- `onModelLoaded` reports `materialVariants` and `materialVariantGroups`, and
  BindingBuilder's Scene tab (**General**, one select per group) picks the
  variants the exported scene config starts with. OBJ, FBX, USDZ, STL, PLY, and
  streamed 3D Tiles models have no variants.
- Scene configs saved before option groups, with a single
  `model.materialVariant`, still show that variant.

### Decals

`binding.decals` prints images and text onto an object's surface: a logo on a
shirt, a name on a mug, a label on a machine. Each decal is projected onto the
object and follows it as it moves, and it's saved with the binding like any
other edit.

```tsx
const viewer = useViewer();

<ModelViewer
  modelUrl="/mug.glb"
  licenseKey="your-license-key"
  {...viewer.props}
  // Put the customer's text where they double-click.
  onObjectDoubleClick={({ binding, surface }) => {
    if (!surface) return;
    viewer.bindings.addDecal(binding.id, {
      text: customerName,
      color: "#1e293b",
      ...surface, // position and normal, in the object's own space
      size: 0.06, // width in model units
    });
    return true; // skip the viewer's own double-click behavior
  }}
/>;

const id = viewer.bindings.addDecal("mug", { image: "/logos/acme.png", position, normal, size: 0.05 });
viewer.bindings.updateDecal("mug", id, { size: 0.08, rotation: Math.PI / 12 });
viewer.bindings.removeDecal("mug", id);
```

```ts
type ObjectBindingDecal = {
  id: string;
  image?: string; // a URL or public path
  text?: string; // shown when there's no image
  color?: string; // text colour, default "#ffffff"
  fontFamily?: string; // CSS font family, default "sans-serif"
  fontWeight?: "normal" | "bold"; // default "bold"
  position: [number, number, number]; // on the object, in its own space
  normal: [number, number, number]; // the way the surface faces there
  size: number; // width in model units; the height follows the image or text
  rotation?: number; // radians around the normal, default 0
  opacity?: number; // 0–1, default 1
};
```

- `onObjectDoubleClick` and `onObjectContextMenu` report `surface`: the point
  under the pointer and the way the surface faces, in the object's own space,
  which is exactly what a decal's `position` and `normal` take.
- `addDecal` returns the decal's id (pass your own `id` to choose it), and
  takes the same targets as the other binding helpers, so
  `addDecal({ group: "panels" }, …)` prints on each. Decals are plain binding
  data: you can also set `decals` directly.
- A decal wraps onto the surface around its position, reaching about half
  its size in depth, so it follows gentle curves without printing on the far
  side of a thin part.
- A decal fades with its object when that object is ghosted by isolation or
  made see-through by a style rule, and is cut by a section cut.
- To let the people using your viewer add their own, give a binding the
  built-in `add-text` and `add-image` actions:

  ```ts
  actions: [
    { id: "add-text", label: "Add Text", type: "command" },
    { id: "add-image", label: "Add Image", type: "command" },
  ]
  ```

  Each opens a control under its button in the object panel. **Add Text**
  takes the text and a colour; **Add Image** takes an image file (sent through
  `onTextureUpload` when you pass it, so the saved URL lasts; otherwise a
  blob URL for this session). The decal appears automatically at the centre
  of the camera-facing surface, ready to drag, resize, turn, or remove. **Move** enables dragging across
  the object's surface; release to save, or press Escape to cancel. The
  **Position** arrows move a decal in small steps relative to the current
  view, without needing to grab it. Click for a fine adjustment or hold an
  arrow for continuous movement. Each step stays on the nearby visible surface.
  Every change is saved to the
  binding's `decals` and reported through `onObjectBindingsChange`. While a
  decal is in Move mode, a hint shows over the viewer and Escape cancels
  the current drag without removing the centred decal.
- On a rigged (skinned) mesh a decal bends with the animation: it takes on
  the bone weights of the surface under it and is driven by the same skeleton.
  A click on a posed mesh is stored at the matching point of its rest shape, so
  a decal lands where you clicked whatever pose the model is in. Over a joint
  that bends sharply across few polygons, the decal's outer edge can sit a
  hair off the surface. Decals don't follow morph targets (blend shapes).
- Decals need the binding's object to be a mesh, and aren't drawn on streamed
  3D Tiles models.

### Isolating objects

`isolation` focuses the view on some objects: everything else is ghosted
(drawn faintly) or hidden, and clicks and hovers pass through to what's
isolated. Nothing about the bindings changes, and clearing the isolation puts
everything back. It's view state, like the selection, so it isn't part of
`sceneConfig`.

```tsx
const viewer = useViewer();

<ModelViewer
  modelUrl="/engine.glb"
  licenseKey="your-license-key"
  {...viewer.props}
  tools={{ isolate: true }}
/>;

viewer.isolation.isolate({ group: "gearbox" }); // ghost everything else
viewer.isolation.isolate(["piston-1", "piston-2"], { mode: "hide" });
viewer.isolation.clearIsolation();
```

```ts
type ViewerIsolation = {
  target: ObjectBindingTarget; // an id, a list of ids, { group }, { tag }, or { type }
  mode?: "ghost" | "hide"; // default "ghost"
  ghostOpacity?: number; // 0–1, default 0.12
};

isolation?: ViewerIsolation | null;
onIsolationChange?: (isolation: ViewerIsolation | null) => void;
showIsolateControls?: boolean; // tools.isolate
```

- Pass `isolation` (including `null`) to control it, and update it from
  `onIsolationChange`; `useViewer` wires both, as `viewer.isolation`. Leave
  `isolation` out and `ModelViewer` keeps it itself, clearing it when
  `modelUrl` changes. `useViewerIsolation` is the same state on its own.
- `showIsolateControls` (`tools.isolate`, default `false`) adds an isolate
  button to each row of the scene objects panel (click again to show all) and
  a "Show all" pill at the bottom of the viewer while anything is isolated.
- An action can isolate with an `isolation` effect:
  `{ isolation: { target: { group: "engine" } } }`, or `{ isolation: null }`
  to show everything again. Pass `isolation` to `useViewerActions` for it
  (`useViewer` does).
- A target that matches no object isolates nothing, rather than fading out
  the whole model. Ghosting never raises an object's own lower opacity, and
  style rules still apply underneath.
- `applyIsolation` (main entry and `/utils`) applies an isolation to bindings
  the same way, for rendering your own lists.

### `showSectionTools`

Shows a section-cut button over the canvas (`tools.section`). It cuts the model
open along an axis, hiding everything on one side of a plane, to look inside
assemblies, equipment, and buildings. Default `false`. Not available with
[`webgpu`](#webgpu).

With the cut on, the toolbar picks the axis (X, Y, or Z), the position along
it, and which side stays, and a plane appears across the model that you can
drag. The cut is stored in `sceneConfig.section`, so you can also set it
yourself, author it in BindingBuilder, or switch it from an action:

```tsx
viewer.scene.updateSceneConfig({
  section: { enabled: true, axis: "y", position: 0.4, flip: false }, // a floor-plan cut
});
```

```ts
type SceneSectionConfig = {
  enabled: boolean;
  axis: "x" | "y" | "z"; // world axis the cut runs across
  position: number; // 0 at the model's minimum along the axis, 1 at its maximum
  flip: boolean; // keep the higher side instead of the lower one
};
```

- The cut applies to the model only; lights, helpers, and gizmos stay whole.
  It also shows without the toolbar whenever `sceneConfig.section.enabled` is
  set; the draggable plane appears only with `showSectionTools`.
- While the cut is on, the model's materials render both sides of each
  surface, so a cut part shows its inside surfaces instead of disappearing.
  There are no solid caps over the cut.
- Clicking and hovering ignore whatever is cut away, so the parts you can see
  behind the cut are the ones you select.
- Toolbar changes go to `onSceneConfigChange` when you pass it (`useViewer`
  does); otherwise `ModelViewer` keeps them until `sceneConfig.section` or
  `modelUrl` changes.
- The measuring tool can still pick points on the hidden side of a cut.

Default:

```ts
false;
```

### `cinematic`

Optional cinematic auto-camera. The camera glides along a path on its own, like a film, ideal for showing off a gallery, apartment, or product with no user interaction. Renders a play/pause button over the canvas; grabbing the camera (or selecting a part) pauses it.

```ts
cinematic?: boolean | CinematicConfig;

type CinematicConfig = {
  waypoints?: CinematicWaypoint[]; // camera keyframes to glide through
  duration?: number; // seconds for one full pass (auto-scales when omitted)
  loop?: boolean; // default true
  autoPlay?: boolean; // start once the model has loaded and framed (default false); waits for the play button under reduced motion
};

type CinematicWaypoint = {
  position: [number, number, number];
  target: [number, number, number]; // world-space look-at point
};
```

- Boolean `true` (or an object with fewer than two waypoints) gives a zero-config **showcase orbit** around the model's bounding sphere.
- Two or more `waypoints` author a **walkthrough**: the camera follows a smooth Catmull-Rom spline through them at a constant on-screen speed, looping seamlessly.
- Waypoints are easiest to capture visually in `BindingBuilder`'s **Cinematic** tab, which stores them on `sceneConfig.cinematic`.

A path can also come from `sceneConfig.cinematic`. The `cinematic` prop overrides it: a boolean toggles the feature (`true` keeps any authored waypoints, `false` forces it off), and an object overrides field-by-field, so you can keep the authored waypoints while overriding, say, `autoPlay` or `loop`.

```tsx
// Zero-config showcase orbit
<ModelViewer cinematic ... />

// Authored walkthrough
<ModelViewer
  cinematic={{
    waypoints: [
      { position: [4, 2, 6], target: [0, 1, 0] },
      { position: [-3, 2, 4], target: [0, 1, 0] },
      { position: [-5, 2, -2], target: [0, 1, 0] },
    ],
    loop: true,
    autoPlay: true,
  }}
  ...
/>

// Keep the BindingBuilder-authored path, just autoplay it
<ModelViewer sceneConfig={sceneConfig} cinematic={{ autoPlay: true }} ... />
```

Default: disabled.

### `enableXR`

Optional boolean that enables XR entry points. On WebXR-capable browsers, the viewer shows a **"View in your space"** (AR) and/or **"Enter VR"** button once `navigator.xr.isSessionSupported(...)` resolves `true` for that mode. On iPhone/iPad, WebXR AR is not available, but if you also pass [`usdzUrl`](#usdzurl), the viewer shows a **"View in AR"** button that launches Apple Quick Look instead.

On entering a session the model is rested on the floor a short distance in front
of the viewer. By default it is normalized to ~1 m on its longest axis so
arbitrary uploads and room scenes are framed safely. Set
[`arScaleMode`](#arscalemode) to `"real-world"` for product AR, which preserves
the GLB's authored metre scale.

**AR placement gestures**, inside an AR session the viewer now uses an explicit placement flow:

- before placement, a bottom label says **"Move your device over a flat surface"** until a hit-testable surface is found
- once a surface is found, a reticle appears on it and the label changes to **"Tap to place"**
- tapping the screen or the label places the model at the reticle
- after placement, **pinch** (two fingers) resizes the model and **twist** rotates it around its vertical axis without changing its position
- a bottom **"Relocate"** button lets the user press-and-hold to bring the reticle back; releasing the button places the model at the current reticle position

VR sessions keep the initial framed placement (there are no real surfaces to hit-test against).

> Postprocessing is automatically disabled during an XR session (the effect composer isn't WebXR-aware). Note also that on low-power devices the default [`performanceProfile`](#performanceprofile) of `"auto"` already disables postprocessing and soft shadows, important for keeping the WebGL context alive so AR can start at all.

Default:

```ts
false;
```

### `usdzUrl`

Optional `USDZ` URL used as an Apple-device fallback when `enableXR` is `true`.
On iPhone/iPad, if WebXR AR is unavailable and this prop is provided, the viewer
shows a **"View in AR"** button that launches Apple Quick Look for the given
asset.

```ts
usdzUrl?: string;
```

Notes:

- this should point to a `.usdz` file that Safari can fetch directly
- Android / WebXR-capable devices ignore this and continue using the normal WebXR AR flow
- if `usdzUrl` is omitted, Apple handheld devices simply won't get an AR button

### `arScaleMode`

Controls the initial model size inside WebXR AR and VR sessions.

```ts
arScaleMode?: "normalized" | "real-world";
```

- `"normalized"` (default) fits the longest model dimension to approximately
  1 metre. Use this for arbitrary uploads and room-scale scenes.
- `"real-world"` preserves the GLB's authored scale. glTF units are metres, so
  use this for product models exported at their real dimensions.

Users can still pinch to resize after placement in either mode.

### `showAnnotationNavigation`

Optional boolean that shows the "Guided Tour" control cluster when the model has at least one annotation: a single "Guided Tour" button that, once started, becomes Previous/Stop/Next controls for stepping through annotations in order.

Default:

```ts
true;
```

### `showAnnotationOnHover`

Optional boolean that temporarily opens an annotation's detail popup when the
pointer hovers over its marker. Moving the pointer away closes the hover popup
after a short grace period. Clicking a marker still locks its popup open until
it is closed.

Default:

```ts
false;
```

```tsx
<ModelViewer {...props} showAnnotationOnHover />
```

### Theming the scene objects / object binding panels

The scene objects panel and object binding data panel read their colors,
borders, shadows, and fonts from CSS custom properties (`--ri-sidepanel-*`
and `--ri-databinding-*`) instead of hardcoded values, each with the current
look baked in as a fallback. Override them on a `.ri-viewer` ancestor to
re-skin those panels:

```css
.my-app .ri-viewer {
  --ri-sidepanel-bg: #1a0033;
  --ri-sidepanel-accent: #ff2d75;
}
```

See the full variable list in the [`ModelViewer` docs](https://react-immersive.liveroom.dev/docs/reference/model-viewer#theming).

## `SimpleModelViewer` Public API

```ts
type SimpleModelViewerProps = {
  modelUrl: string;
  poster?: string; // see ModelViewer's poster
  loading?: "lazy" | "eager"; // default "lazy"
  reveal?: "auto" | "interaction"; // default "auto"
  modelFormat?: "glb" | "gltf" | "obj" | "fbx" | "usdz" | "stl" | "ply";
  dracoDecoderPath?: string | false;
  ktx2TranscoderPath?: string | false;
  meshopt?: boolean;
  backgroundColor?: string;
  showSceneObjectsPanel?: boolean;
  showSceneSettingsPanel?: boolean;
  enableModelUpload?: boolean;
  zoomOnSelected?: boolean;
  highlightOnHover?: boolean;
  showLoadingOverlay?: boolean;
  refitOnResize?: boolean;
  reducedMotion?: "user" | "always" | "never"; // see ModelViewer's reducedMotion
  // Initial values for the scene settings (environment) panel
  backgroundEnabled?: boolean;
  autoRotate?: boolean;
  envPreset?: PresetsType; // @react-three/drei environment preset
  exposure?: number;
  ambientIntensity?: number;
  ambientColor?: string;
  directionalIntensity?: number;
  directionalColor?: string;
  onModelLoaded?: (model: ViewerModelInfo) => void;
  onLoadError?: (error: unknown) => void;
};
```

`SimpleModelViewer` does not take a `licenseKey`, licensing is enforced by `ModelViewer` and `BindingBuilder` only.

### `modelUrl`

URL or public path to the `.glb`, `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, or `.ply` model to inspect. Hosted assets must serve external dependencies at their declared relative paths; USDZ dependencies are packaged internally. Use `modelFormat` when a signed or extensionless URL cannot be auto-detected.

### `modelFormat`

Optional explicit format for signed or extensionless model URLs. Normal URLs
ending in a supported extension are detected automatically.

### `poster` / `loading` / `reveal`

Work as on [`ModelViewer`](#lazy-loading-and-posters), sharing the same
page-wide count of live 3D views. When a `SimpleModelViewer` is put away, only
its canvas goes: the panels and their settings stay, and the canvas comes back
with its camera, hidden objects and selection.
`onModelLoaded` runs again when it does.

### `backgroundColor`

Optional canvas background color.

Default:

```ts
"#1a1a1a";
```

### `showSceneObjectsPanel`

Optional boolean that controls whether the right-side scene objects panel is rendered.

Default:

```ts
true;
```

### `showSceneSettingsPanel`

Optional boolean that controls whether the left-side environment/scene settings panel is rendered. It exposes background color/visibility, the `@react-three/drei` environment preset, auto-rotate, exposure, and ambient/directional light color and intensity.

Default:

```ts
true;
```

### Scene settings defaults

The following optional props seed the initial values of the scene settings (environment) panel. Each maps to one control, and the panel stays interactive so the user can still adjust them at runtime. They are initial values (not controlled props): changing one after mount does not override a value the user has since changed in the panel, the exception is `backgroundColor`, which stays in sync live.

| Prop                   | Type          | Panel control           | Default     |
| ---------------------- | ------------- | ----------------------- | ----------- |
| `backgroundEnabled`    | `boolean`     | Background on/off       | `false`     |
| `autoRotate`           | `boolean`     | Auto Rotate             | `false`     |
| `envPreset`            | `PresetsType` | Environment preset      | `"city"`    |
| `exposure`             | `number`      | Exposure                | `1`         |
| `ambientIntensity`     | `number`      | Ambient Light Intensity | `0.6`       |
| `ambientColor`         | `string`      | Ambient Light Color     | `"#ffffff"` |
| `directionalIntensity` | `number`      | Direct Light Intensity  | `1.2`       |
| `directionalColor`     | `string`      | Direct Light Color      | `"#ffffff"` |

`envPreset` accepts any `@react-three/drei` `PresetsType` (for example `"city"`, `"sunset"`, `"dawn"`, `"night"`, `"warehouse"`, `"forest"`, `"apartment"`, `"studio"`, `"park"`, `"lobby"`).

```tsx
<SimpleModelViewer
  modelUrl="/model.glb"
  backgroundEnabled
  envPreset="sunset"
  exposure={1.2}
  ambientIntensity={0.4}
  directionalColor="#fff4e0"
  autoRotate
/>
```

### `zoomOnSelected`

Optional boolean. When `true`, selecting a mesh (via click or the objects panel) zooms/frames the camera on it.

Default:

```ts
false;
```

### `highlightOnHover`

Optional boolean. When `true`, hovering a mesh (in the viewport or the objects panel) highlights it.

Default:

```ts
false;
```

### `showLoadingOverlay`

Optional boolean controlling whether the built-in loading overlay is shown while the model is loading, uploaded files are being prepared, and the initial camera fit is settling.

Default:

```ts
true;
```

### `refitOnResize`

Optional boolean controlling whether the camera re-frames the model to fit whenever the canvas is resized, a browser window resize, a device rotation, or a side panel (scene settings / scene objects) opening or closing. Set to `false` to preserve the user's current orbit/zoom across resizes; the camera aspect stays correct either way, so the model never distorts, it just isn't re-centered.

Default:

```ts
true;
```

### `enableModelUpload`

Optional boolean that swaps the fixed `modelUrl` workflow for a built-in upload UI. It accepts `.glb`, standalone/data-URI `.gltf`, `.obj`, `.fbx`, `.usdz`, `.stl`, `.ply`, or a `.zip` bundle. ZIP bundles may contain a GLTF with its buffers/textures, an OBJ with its optional MTL/textures, or an FBX with external textures. A USDZ file is already a self-contained package and is uploaded directly.

Default:

```ts
false;
```

### `onModelLoaded`

Optional callback fired after the model has loaded, with its bounds and mesh
count (`(model: ViewerModelInfo) => void`, the same payload as `ModelViewer`'s).

### `onLoadError`

Optional callback fired if the model fails to load or render.

## Object Binding Shape

The current source defines these binding types internally:

```ts
type ObjectBindingAction = {
  id: string;
  label: string;
  type: "command";
};

type ObjectBindingCameraState = {
  position?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  zoom?: number;
};

type ObjectBindingMaterial = {
  // exported by the package; includes texture/baseColor plus the supported
  // MeshPhysicalMaterial overrides used by the viewer and BindingBuilder
};

type ObjectBindingStyle = {
  material?: ObjectBindingMaterial;
};

type ObjectBindingTransform = {
  position?: [number, number, number];
  rotation?: [number, number, number]; // radians
  scale?: [number, number, number];
};

type ObjectBinding = {
  id: string;
  type?: ObjectBindingType; // any string; suggestions: "body" | "light" | "wheel" | "wall" | "door" | "furniture" | ...; default "other"
  modelObjectId: string;
  label?: string;
  group?: string;
  tags?: string[];
  visible?: boolean;
  selectable?: boolean;
  hoverable?: boolean;
  transform?: ObjectBindingTransform;
  style?: ObjectBindingStyle;
  decals?: ObjectBindingDecal[];
  actions?: ObjectBindingAction[];
  metrics?: Record<string, number>;
  metadata?: Record<string, unknown>;
  cameraState?: ObjectBindingCameraState;
};
```

Notes:

- the `objectBindings` record is keyed by node name, not by `id`
- `group` and `tags` can be assigned in `BindingBuilder` and used as targets by binding helpers and runtime material or transform effects
- `visible` is live render state, not just an initial default
- `transform` is persistent local-space render state; position values use model units and rotation values use radians
- the transform gizmo is displayed at the center of the object's renderable geometry for intuitive rotation, even if the authored node origin is elsewhere; this does not rewrite the GLB/GLTF origin
- missing transform fields retain their model-authored values, and removing `transform` restores the authored transform
- `style.material.baseColor` is read by the renderer and is the committed source of truth for color picks
- `style.material.texture.path` is read by the renderer and is the committed source of truth for texture uploads (stored as durable URLs via `onTextureUpload` when provided, or session-scoped blob URLs otherwise)
- if no `texture.path` is provided and no `style.material.baseColor` is set, the viewer falls back to the node's original GLB/GLTF material
- supported `style.material` fields are applied as per-object `MeshPhysicalMaterial` overrides, including metalness, roughness, emissive, opacity, alpha masking, normal/bump, AO, displacement, clearcoat, sheen, anisotropy, specular, transmission, thickness, attenuation tint/distance, reflectivity, and side selection
- each `style.material` group also accepts a texture-map slot (`metalnessMap`, `roughnessMap`, `normalMap`, `aoMap`, `clearcoatMap`, etc.); color maps are decoded as sRGB and data maps as linear automatically
- `BindingBuilder` intentionally omits exact Sketchfab glossiness, cavity, and subsurface-scattering workflows; those require preprocessing or a different material pipeline
- `cameraState` stores a saved camera view for the object; when both `position` and `target` are set, the viewer uses that view when the object is focused or selected instead of falling back to `fitToBox`
- `metrics` and `metadata` are displayed in the side panel as nested key/value fields (objects expand into indented child labels)
- `type` groups and filters bindings (for example `hideObject({ type: "wheel" })`). Any string works: `ObjectBindingType` suggests values for vehicles, rooms, furniture, characters, weapons, environment, and more, but a domain it doesn't cover can use its own (`"bone"`, `"turbine-blade"`). Left out, it counts as `"other"`

## Supported Built-In Actions

`ModelViewer` handles eight action ids itself: `change-color`,
`change-material`, `add-text`, `add-image`, `toggle-visibility`,
`toggle-light`, `change-light-color`, and `set-brightness`. Any other id does something only when you handle it in
`onAction` (pass `useViewerActions().handleAction` there to run an action's
declared `effects`). If a binding has such an action and `ModelViewer` has no
`onAction`, its button does nothing, and the viewer logs a console warning
naming each one. Every action also reaches `onAction`, after the viewer's own
handling.

`ACTION_CATALOG` lists the ids `BindingBuilder` offers, and whether the viewer
or your app handles each one (`handling: "viewer" | "host"`):

```ts
import { ACTION_CATALOG, findCatalogAction } from "@liveroom-tech/react-immersive/utils";

findCatalogAction("toggle-light")?.handling; // "viewer"
```

### Implemented behaviors

- `add-text`
  Opens a text box and colour inline beneath the action; the text appears at the centre of the camera-facing surface, ready to drag, resize, turn, or remove. Saved to `binding.decals` (see [Decals](#decals))
- `add-image`
  Opens an image chooser inline beneath the action; the image is placed and edited the same way. Uses `onTextureUpload` for a durable URL when provided, otherwise a session-scoped blob URL
- `toggle-visibility`
  Hides or shows the selected mesh by setting `binding.visible` and calling `onObjectBindingsChange`
- `change-color`
  Opens the color picker inline beneath the action; the chosen hex is applied as a live preview while dragging and committed into `binding.style.material.baseColor` via `onObjectBindingsChange` when the picker closes
- `change-material`
  Opens the texture upload panel inline beneath the action for JPG, PNG, and WebP files; if `onTextureUpload` is provided, the file is passed to it and the returned URL is stored in `binding.style.material.texture.path`; otherwise a session-scoped blob URL is used as the fallback
- `toggle-light`
  Turns the object's light off, or back on
- `change-light-color`
  Opens a color picker inline beneath the action that sets the light's color
- `set-brightness`
  Opens a slider inline beneath the action that sets the light's brightness, from 0 to 200% of what it was when it opened

What "the object's light" is depends on the scene:

- If scene lights are attached to the object (in `BindingBuilder`'s Lighting
  tab, or with `useSceneConfig().lights.attach`), the actions control those
  lights, which light up the room around it. The changes go to
  `sceneConfig.lighting`: to `onSceneConfigChange` if you pass it (`useViewer`
  does, so `viewer.scene` stays current), otherwise `ModelViewer` keeps them
  itself, over whatever `sceneConfig` it's given.
- Otherwise they control the object's own glow: its emissive color and strength,
  saved on the binding as `style.material.emissive` and
  `style.material.emissiveIntensity`, like any other edit. This works on any
  light fixture with no setup, but a glow doesn't light up the objects around
  it. Toggling off and back on restores the previous strength.

## How Rendering Works

At a high level, the current viewer does the following:

1. creates a Three.js canvas; only `fov: 50` is defaulted, so camera position falls back to React Three Fiber's `Canvas` default (`[0, 0, 5]`) unless `camera.position` is passed
2. loads the GLB/GLTF asset with `useGLTF`
3. looks up meshes by the keys in `objectBindings` (resolving `modelObjectId` to find the actual model node)
4. clones each referenced material so edits stay isolated per object (keyed on a structural signature of the binding-to-mesh mapping, not the `objectBindings` reference, so materials are not recreated on every binding update)
5. applies runtime color, texture, and style overrides from `objectBindings` in a `useEffect` (not during render)
6. manages a reference-counted texture cache so the same texture URL is decoded once and disposed when no longer referenced; each texture is decoded in the correct color space, color maps (base color/albedo, emissive, sheen color, specular color) as sRGB and data maps (normal, roughness, metalness, AO, displacement, etc.) as linear, and the cache is keyed by URL **and** color space, so the same image can be reused safely as both a color and a data map
7. adds hover, selected, and panel-hover emissive highlighting
8. creates an `AnimationMixer` for the loaded scene, ticked every frame via `useFrame`, and exposes playback controls through `onAnimationsReady`
9. renders a side panel for the selected object and its configured actions

Only objects listed in `objectBindings` are rendered interactively by the current `Model` component.

### Lighting, shadows, and post-processing

When `shadows` is enabled (the default), the canvas renders soft shadow maps and the viewer applies:

- a default light rig (`Lights`) with ambient + hemisphere fill and a directional key light that casts shadows, sized to the model
- per-mesh `castShadow`/`receiveShadow`, with one exception: the large enclosing "shell" mesh (walls/ceiling of an interior model) is detected by its bounding-box size and excluded from **casting** so a top-down light still reaches the interior, it continues to **receive** shadows, so furniture casts visible contact shadows onto the floor and walls
- a post-processing stack (`EffectComposer`) with SSAO ambient occlusion (normal pass enabled), bloom, vignette, and ACES filmic tone mapping

Pass `shadows={false}` to disable shadow rendering entirely, or set your own lights in `sceneConfig.lighting` (see [Lighting](#lighting)) to replace the default rig.

## UI Behavior

The current component includes its own UI shell:

- a viewer layout that fills its parent container
- a sliding left side panel about `280px` wide (collapses to half-width on narrow screens so the canvas keeps its other half)
- a canvas area that fills the remaining width
- a color picker that expands inline beneath the **Change Color** action
- a texture upload panel that expands inline beneath the **Change Material** action
- a right scene objects panel with search and per-object visibility toggles

Because of that, it works best when mounted in a container with an explicit height.

## Usage Expectations For Models

To use this library successfully, your model asset should follow these expectations:

- the mesh node names must match the keys in `objectBindings` (or be referenced via `modelObjectId`)
- target nodes should have geometry and a supported Three.js mesh material; imported materials are normalized into the editable PBR pipeline
- the file should be accessible from the browser at `modelUrl`; hosted GLTF, OBJ, and FBX assets must also serve external dependencies at their declared relative paths
- OBJ, STL, and PLY do not contain animations; supported FBX and USDZ animation clips are exposed through the same animation controls as glTF
- OBJ, STL, and PLY have no standard unit metadata, so set an appropriate measurement label/scene scale when real-world dimensions matter

If a node name or material name does not match, that object will not render through the interactive binding flow.

### Large models

Viewport picking (click/hover) is accelerated by a BVH index built in a
background worker, so even multi-million-triangle models stay responsive to
the pointer. Models above roughly **12 million triangles** are too large to
index without a significant memory cost, and the viewer degrades gracefully
instead of freezing:

- viewport click/hover picking is disabled (`onObjectSelect` / `onObjectHover`
  do not fire from the canvas); selection through the scene objects panel
  still works
- a dismissible banner tells the user the model is very large, may render
  slowly on their device, and that selection is available through the panel
- the loading overlay calls out the extra work, uploading that much geometry
  to the GPU is a single synchronous operation that can block the page for
  tens of seconds in any WebGL viewer

Orbit, zoom, animations, annotations, and the panels keep working. There is no
viewer-side way to make models of this size feel fast, the per-frame cost is
inherent, and on mobile devices the decoded geometry alone can exceed the
tab's memory budget. Decimate such assets at ingestion (to roughly 2–3M
triangles) instead of shipping the raw export; note that very large
Draco-compressed files need Blender or native tooling to decimate, the WASM
builds of `gltf-transform` and `gltfpack` cannot decode them within their 4GB
address space.

Two related picking notes that apply to models of every size:

- clicks resolve the front-most surface under the pointer; a mesh with
  `selectable: false` does not pass the click through to meshes behind it
- `SimpleModelViewer` renders on demand, an idle viewer draws no frames, so
  it costs no GPU time or battery until something changes

## License

Proprietary, see the [package license](https://react-immersive.liveroom.dev/LICENSE.txt).
SimpleModelViewer needs no license key or paid plan, including in production.
ModelViewer and BindingBuilder require a valid key and the appropriate plan.
See [Licensing](https://react-immersive.liveroom.dev/docs/licensing) for the
component/environment matrix.

### Rich annotations

`sceneConfig.annotations` supports optional `cameraView` (position, target,
orbit angles, fov and zoom), `images: [{ src, alt }]`, `links: [{ href, label }]`,
`category`, and `minDistance` / `maxDistance` in scene units. BindingBuilder's
Annotations tab authors these fields; new markers use automatic close-up tour
framing. Explicitly capture a camera view for custom framing. Marker selection
and guided tours restore saved views when provided. The viewer's category chips
filter markers and tour steps.
Use `annotationCategories` (`null` = all, `[]` = none) and
`onAnnotationCategoriesChange` for controlled filtering, and
`ui.annotationFilters: false` to hide the built-in chips. Distance limits affect
markers only, so their content remains available through tours. Images stay at
their HTTP(S) or relative URLs and are not bundled into exports automatically.

## Translatable viewer text

Both viewers accept a partial `labels` dictionary. Omitted keys use English; changing labels updates text without reloading the model. Named placeholders such as `{count}` can be reordered in translations.

```tsx
<ModelViewer
  licenseKey="your-license-key"
  modelUrl="/car.glb"
  labels={{ guidedTour: "Visite guidée", tapToPlace: "Touchez pour placer", visibleEntries: "{count} éléments visibles" }}
/>
```

`ModelViewerLabels`, `ModelViewerLabelKey`, and `DEFAULT_MODEL_VIEWER_LABELS` are exported from the main package, `/simple-model-viewer`, and `/utils`. See the [full catalog](https://react-immersive.liveroom.dev/docs/reference/labels). Annotation content, metadata, and custom panels use your application's translations.
