# texture-upload-demo

A minimal Vite example of `onTextureUpload`. Shoppers upload their own artwork
onto a product (a t-shirt); the built-in **Change Material** action hands the
file to `onTextureUpload`, where a real app would push it to its own storage and
return a durable URL. That URL is committed to the material's
`style.material.texture.path` and broadcast across every panel of the garment.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

1. Pick a shirt color (optional).
2. Click the shirt to select it, then choose **Change Material** in the panel.
3. Upload a JPG, PNG, or WebP — it prints across the whole shirt.
4. The side panel shows the applied artwork and a "durable URL applied" badge;
   use **Remove** to clear it.

Create a license key at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).

## Notes

- `onTextureUpload` returns a data URL here so the print survives without a
  backend; in production you would upload the file and return your hosted URL.
- The t-shirt is four meshes sharing one material; `onObjectBindingsChange`
  broadcasts any material change across all of them for an all-over print.

## Model

"Oversized t-shirt" (https://skfb.ly/oQRZL) by kylelhb is licensed under
[CC-BY 4.0](http://creativecommons.org/licenses/by/4.0/).
