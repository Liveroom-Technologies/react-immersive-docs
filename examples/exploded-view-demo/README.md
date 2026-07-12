# exploded-view-demo

A minimal `ModelViewer` demo for inspecting a multi-part assembly. The
`showExplodeControls` prop adds an explode slider that separates every bound
mesh outward from the model center and reassembles it — ideal for engines,
gadgets, and vehicles.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

Open the **Exploded view** control in the top-left of the viewer and drag the
slider. Each of the car's 32 bound parts slides out along its own direction;
drag back to zero to reassemble exactly.

Exploded view writes node positions each frame, so it suits static product /
CAD models — avoid combining it with playing skeletal animations.

## Model attribution

"Cartoon Car" (https://skfb.ly/ouxVu) by wallon is licensed under
[CC-BY 4.0](http://creativecommons.org/licenses/by/4.0/).
