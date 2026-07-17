# Examples

These examples are safe-to-share public starters for `@liveroom-tech/react-immersive`.

- `simple-model-viewer-demo` mirrors the internal lightweight viewer demo page.
- `model-viewer-demo` mirrors the full binding-driven `ModelViewer` demo.
- `binding-builder-demo` mirrors the public scene-editor style demo.
- `switch-room-demo` shows two switches controlling four lights with exported
  object bindings, action effects, and reactive scene lighting.
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

When adding examples, keep them minimal and avoid committing proprietary models,
textures, or private customer data.
