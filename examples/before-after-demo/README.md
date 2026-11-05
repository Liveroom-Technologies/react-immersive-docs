# Before/after comparison starter

A Vite + React page comparing a kitchen before and after a renovation with
`CompareViewer`:

- **Slider** lays the two rooms over each other with a divider. Drag it, or
  focus it and use the arrow keys (Home and End jump to the edges).
- **Side by side** shows them next to each other.
- Both panes share one camera: orbit either side and the other follows.
- **Reset view** and **Face the counter** use `useViewerCamera()`. A command from
  the hook moves both panes, whichever one the visitor last dragged.

Targets `@liveroom-tech/react-immersive@6.2.0` and React 19.2.4.
Use Node 20.19+ or 22.12+.

## Run

```bash
npm ci
cp .env.example .env.local   # then set VITE_LICENSE_KEY
npm run dev
```

`CompareViewer` uses two `ModelViewer` panes, so it needs a runtime key. A free key
works on `localhost`; create one at https://react-immersive.liveroom.dev/console.

```bash
npm run typecheck
npm run build
```

## Your own models

Export both versions from the same scene, with the same origin, units and
orientation, so they line up in the slider. Replace
`public/kitchen-before.glb` and `public/kitchen-after.glb`, then adjust
`initialPosition` and `initialTarget` in `src/App.tsx`.

## Choices in this starter

- `objectBindings={{}}` makes the rooms view-only: nothing highlights or opens
  when a customer clicks. Remove it to let them select parts.
- `CompareViewer` uses the `minimal` preset by default, so neither pane shows
  inspector panels.
- The camera hook connects to the `before` pane through its `onViewerReady` and
  `onCameraChange` callbacks. Either pane works.
- Each pane is its own WebGL viewer, so the page holds both models in GPU memory.
  Keep models web-sized (compressed textures, Draco or Meshopt geometry).

Reference: https://react-immersive.liveroom.dev/docs/reference/compare-viewer

The kitchens are original, built from boxes by `scripts/generate-model.mjs`, and
free to reuse.
