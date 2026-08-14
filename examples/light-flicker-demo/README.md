# light-flicker-demo

A Vite example that turns nine static incandescent-bulb meshes into a
horror-film lighting effect with React Immersive.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

The demo shows how to:

- Apply atomic material presets with `useObjectBindings`.
- Change the environment, bloom, and vignette with `useSceneConfig`.
- Drive filament, glass, and point-light channels with `useViewerEffects`.
- Attach runtime point lights to model objects without Three.js or R3F light code.
- Dim every bulb together in failing-circuit mode.
- Give every bulb independent failure timing in possessed mode.
- Load the `objectBindings` and `sceneConfig` exported by BindingBuilder.
- Use `useViewerCamera` for model-specific camera framing.

## Model

["incandescent bulbs"](https://skfb.ly/6YEWL) by Helindu is licensed under
[Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).
