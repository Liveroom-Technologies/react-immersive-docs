# guided-tour-demo

A minimal Vite example of an annotation-driven guided walkthrough. Tour stops
are `SceneAnnotationMarker`s in `sceneConfig.annotations` — each just a world
position, title, and description — and the viewer's built-in **Guided Tour**
control flies the camera between them. No per-object bindings are required for
the tour itself.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

1. Press the **Guided Tour** button in the viewer to start the tour.
2. Use the Previous / Stop / Next controls to move between stops.
3. The side panel reflects the active stop's title and index.

Create a license key at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).

## Model

"Art Gallery" (https://skfb.ly/oRXGx) by ALLrounder18 is licensed under
[CC-BY 4.0](http://creativecommons.org/licenses/by/4.0/).
