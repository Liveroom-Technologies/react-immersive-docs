# Examples

These examples are safe-to-share public starters for `@liveroom-tech/react-immersive`.

- `simple-model-viewer-demo` mirrors the internal lightweight viewer demo page.
- `model-viewer-demo` mirrors the full binding-driven `ModelViewer` demo.
- `binding-builder-demo` mirrors the public scene-editor style demo.
- `switch-room-demo` shows two switches controlling four lights with exported
  object bindings, action effects, and reactive scene lighting.
- `light-flicker-demo` uses synchronized runtime effects, model-attached point
  lights, camera configuration, and one shared viewer connection to turn a
  static bulb model into a horror lighting scene.
- `vehicle-configurator-demo` shows grouped paint, wheel, trim, aero-kit,
  window-tint, and headlight configurator flows driven by exported object
  bindings.
- `exploded-view-demo` shows `showExplodeControls` adding an explode slider that
  separates a multi-part model into its components and reassembles it.
- `mouse-controller-demo` shows the built-in on-screen controller, with runtime
  controls for movement sensitivity, opacity, and placement.
- `cinematic-tour-demo` shows the `cinematic` auto-camera gliding through a space
  along authored waypoints, with play/pause and grab-to-take-over.
- `shareable-view-demo` shows `useShareableViewerState` restoring an exact
  camera, selection, and visibility state from a share URL.
- `ar-product-viewer-demo` is a minimal retail AR viewer using `enableXR` and
  `usdzUrl` to launch WebXR or iOS Quick Look.
- `guided-tour-demo` shows an annotation-driven walkthrough where
  `SceneAnnotationMarker` stops drive the built-in guided-tour camera
  navigation, with no per-object bindings required.
- `animation-studio-demo` shows `useViewerAnimations` driving a rigged GLB with
  a clip picker, play/pause/stop, a scrubbable timeline, speed control, and a
  loop-mode toggle.
- `texture-upload-demo` shows `onTextureUpload` routing an uploaded image
  through a storage step and applying it as a product's material texture across
  the whole garment.
- `retail-configurator-demo` is a Next.js App Router sofa product page:
  click-to-choose parts, swatches from `useProductConfigurator`, prices, share
  links that restore choices, and AR handoff of the configured sofa.
- `venue-tour-demo` tours an event hall with external stop navigation and
  hotspots. Stops load from JSON at runtime, and an editor mode changes their
  text and camera views and publishes them.
- `before-after-demo` compares two aligned kitchen models with `CompareViewer`
  in slider and side-by-side layouts, with camera buttons moving both panes.

- `engineering-tools-demo` combines section cuts, exploded view, isolation,
  object navigation and calibrated measurements with CSV export.
- `media-export-demo` records the viewer as WebM, MP4 or an animated GIF.
- `asset-qa-demo` inspects sample and local models and shows diagnostics with
  live renderer statistics.
- `multiple-models-demo` places separate GLBs in one scene and edits their
  visibility, active selection and transforms.
- `embedded-page-demo` uses posters, lazy loading and click-to-reveal viewers
  in a scrolling product page.
- `analytics-localisation-demo` logs SDK engagement events and localises both
  viewer labels and scene content.
- `reveal-sequences-demo` plays authored camera and object keyframes with a
  custom timeline.

When adding examples, keep them minimal and avoid committing proprietary models,
textures, or private customer data.
