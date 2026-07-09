# vehicle-configurator-demo

This example shows how a BindingBuilder-exported `objectBindings.ts` file can
power a product configurator.

It demonstrates:

- grouped body-paint, wheel, and trim updates across multiple meshes
- an aero-kit visibility toggle
- window tint controls
- emissive headlights
- clickable parts and side-panel controls sharing the same binding state

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

The car model is included locally in `public/cartoon_car.glb`.
