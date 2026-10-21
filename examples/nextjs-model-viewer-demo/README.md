# Next.js model viewer starter

Targets `@liveroom-tech/react-immersive@5.2.0`, React 19.2.4 and Next.js 16.2.7.
Use Node 22.12+.

```bash
npm ci
npm run dev
npm run typecheck
npm run build
```

The dev/build scripts copy the repository's shared `public/red_room.glb` into
this application's `public/` folder. When using this folder on its own,
download https://react-immersive.liveroom.dev/red_room.glb to
`public/red_room.glb` first.

Expect a visible room, a scene-objects panel and a loaded-object count.
SimpleModelViewer needs no runtime key or paid plan, including in production:
https://react-immersive.liveroom.dev/docs/licensing

Model: Red Room by LaisLH, CC BY 4.0 — https://skfb.ly/6VBJR.
The app files are checked against the complete Next.js documentation guide.
