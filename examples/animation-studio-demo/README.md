# animation-studio-demo

A minimal Vite example of `useViewerAnimations`. It drives a rigged, animated
GLB with a clip picker, play/pause/stop transport, a scrubbable timeline bound
to the live playback position, speed presets, and a loop-mode toggle.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

1. Pick a clip to play it.
2. Use **Play / Pause / Stop** to control playback.
3. Drag the timeline to scrub, and change the playback speed.
4. Toggle **Loop** between repeat and play-once (driven through
   `sceneConfig.animations`).

Create a license key at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).

## Notes

- Playback speed and loop mode are applied through `sceneConfig.animations` so
  they persist across clip switches; play/pause/stop/seek use the hook directly.
- With **Loop = Play once**, a finished clip resets to its rest pose and clears
  the current clip — that is the viewer's built-in once-playback behavior.

## Model

"DEER - Realistic 3D Model (DEMO FREE)" (https://skfb.ly/pLnZv) by WildMesh 3D
is licensed under [CC-BY 4.0](http://creativecommons.org/licenses/by/4.0/).
