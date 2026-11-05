# Venue tour starter

A Vite + React tour of an event hall:

- **Overview**, **Stage**, **Bar** and **Entrance** buttons fly the camera to
  each stop and open its card. Clicking a hotspot in the hall does the same.
- The stops (titles, descriptions and camera views) are content, loaded from
  `public/tour.json` at runtime, so they change without a rebuild.
- Open the page with `?edit` for editor mode: change a stop's text,
  frame the camera and **Use current view**, preview it, then **Publish tour**.

Targets `@liveroom-tech/react-immersive@6.2.0` and React 19.2.4.
Use Node 20.19+ or 22.12+.

## Run

```bash
npm ci
cp .env.example .env.local   # then set VITE_LICENSE_KEY
npm run dev
```

Open http://localhost:2222 for visitors and http://localhost:2222/?edit for editor mode.
`ModelViewer` needs a runtime key. A free key works on `localhost`; create one at
https://react-immersive.liveroom.dev/console.

```bash
npm run typecheck
npm run build
```

## Where edits go

In this starter **Publish tour** downloads the new `tour.json`, so you can see
exactly what would be saved. To publish for real, replace `publishTour` and
`loadTour` in `src/tour.ts` with calls to your own API or CMS, and show the
editor only to signed-in editors. Validate the data on the server.

If you would rather not run that backend, use a hosted project instead: your team
edits hotspots and camera views in the React Immersive editor, and your site
embeds the project. See https://react-immersive.liveroom.dev/docs/content-editing

## Files

| File | What it does |
| --- | --- |
| `src/App.tsx` | Viewer, stop navigation and the editor-mode switch |
| `src/TourEditor.tsx` | Editor mode: edits stop text and captures camera views |
| `src/tour.ts` | Tour data shape, loading and publishing, and conversion to hotspots and camera presets |
| `public/tour.json` | The published tour |
| `scripts/generate-model.mjs` | Regenerates `public/venue.glb` (`npm run generate:model`) |

## How it works

Each stop becomes a hotspot (`sceneConfig.annotations`) whose `cameraView` is
where clicking it flies. The same views are loaded into `useViewerCamera()` with
`setCameraPresets`, so the navigation buttons call `camera.goToPreset(id)`.
Presets passed to `useViewerCamera({ presets })` are only read once, which is why
the starter calls `setCameraPresets` whenever the tour changes.

The hall model is original, built from boxes by `scripts/generate-model.mjs`, and
free to reuse. Replace `public/venue.glb` with your venue and adjust the stop
positions and views in `public/tour.json` (or capture them in the editor).
