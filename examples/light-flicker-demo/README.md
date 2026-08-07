# light-flicker-demo

A Vite example that turns nine static incandescent-bulb meshes into an
asynchronous horror-film lighting effect with React Immersive.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

The demo shows how to:

- Apply atomic material presets with `useObjectBindings`.
- Change the environment, bloom, and vignette with `useSceneConfig`.
- Drive live filament, glass, and point-light intensities from the same values.
- Dim every bulb together in failing-circuit mode.
- Give every bulb independent failure timing in possessed mode.
- Load the `objectBindings` and `sceneConfig` exported by BindingBuilder.
- Use `onViewerReady` for model-specific camera framing.

## Model

["incandescent bulbs"](https://skfb.ly/6YEWL) by Helindu is licensed under
[Creative Commons Attribution](http://creativecommons.org/licenses/by/4.0/).
