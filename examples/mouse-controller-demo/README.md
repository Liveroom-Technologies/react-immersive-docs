# mouse-controller-demo

A `ModelViewer` demo that enables the built-in on-screen mouse controller.
It lets users tune the movement sensitivity, controller opacity, and placement
at runtime — useful for touchscreen, kiosk, and guided viewing experiences.

## Run

```bash
npm install
VITE_LICENSE_KEY=your-license-key npm run dev
```

Use the controller over the model to move through the scene. The settings panel
updates these `ModelViewer` props directly:

- `showMouseController`
- `moveSensitivity`
- `mouseControllerOpacity`
- `mouseControllerPosition`
