# shareable-view-demo

A minimal Vite example of `useShareableViewerState`. It shares and restores
the camera position, selected object, and hidden-object state through the URL
hash.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

1. Click an object to fly the camera to it.
2. Hide one or more objects.
3. Click **Copy link** or **Open link**.
4. Open the generated URL in a fresh tab to restore that exact walkthrough.

Create a license key at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).
