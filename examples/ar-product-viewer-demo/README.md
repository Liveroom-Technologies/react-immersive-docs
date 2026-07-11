# ar-product-viewer-demo

A minimal, mobile-first `ModelViewer` demo for retail and e-commerce AR. It
uses `enableXR` for WebXR and `usdzUrl` to offer iOS Quick Look.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

Open it on a supported phone or tablet and tap **View in AR**. The bundled GLB
is used by the web viewer; the bundled USDZ model is handed to iOS Quick Look.
