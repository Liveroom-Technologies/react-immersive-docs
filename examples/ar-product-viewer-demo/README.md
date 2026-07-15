# ar-product-viewer-demo

A minimal, mobile-first `ModelViewer` demo for retail and e-commerce AR. It
uses `enableXR` for WebXR and `usdzUrl` to offer iOS Quick Look.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

On a desktop, use **Open on phone** to display a QR code, then scan it with a
phone to continue in AR. On a supported phone or tablet, tap **View in AR**.
The bundled GLB is used by the web viewer; the bundled USDZ model is handed to
iOS Quick Look.

The demo sets `arScaleMode="real-world"`, so its initial WebXR placement uses
the GLB's authored metre scale. Export the GLB and USDZ at matching real-world
dimensions to keep Android WebXR and iOS Quick Look consistent.

The QR target must be a public URL that the phone can reach. A local Vite URL
such as `http://localhost:2222` will not work unless you expose it through a
secure tunnel.
