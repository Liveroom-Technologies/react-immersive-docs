# cinematic-tour-demo

A minimal `ModelViewer` demo of the cinematic auto-camera — the camera glides
through a space on its own, like a film, following a list of authored waypoints.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

The camera auto-plays through the waypoints and loops. Use the **play / pause**
control in the top-left of the viewer, or grab the model — touching the camera
pauses the glide and hands control back.

## About the path

`cinematic` takes a list of `waypoints` (camera `position` + look-at `target`).
The camera follows a smooth Catmull-Rom spline through them at a constant
on-screen speed. Pass boolean `true` (or fewer than two waypoints) instead to
get a zero-config showcase orbit.

Waypoints are easiest to author visually in `BindingBuilder`'s **Cinematic**
tab: frame the model, click **Add waypoint from current view**, then reorder /
preview / delete. That stores them on `sceneConfig.cinematic`, which the viewer
also reads.
