# switch-room-demo

This example shows a small room model with four lights and two switches.

It demonstrates a simple object binding pattern:

- Start with exported `objectBindings`.
- Add actions to the switch records.
- Each switch action includes `effects` that patch the relevant light bindings.
- Pass the bindings into `ModelViewer` as React state.
- Update the same bindings when `onAction` fires.
- Use `ModelViewer`'s custom `lights` prop to make the whole scene darker or brighter based on the bound light state.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

Create a key at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).

The room model is included locally in `public/switch-room.glb`.
