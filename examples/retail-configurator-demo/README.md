# Retail configurator starter

A Next.js App Router product page for a three-seat sofa:

- Click a cushion, the frame or a leg to jump to its choices.
- Swatches recolour every matching part through `useProductConfigurator`.
- The URL hash always holds the current choices (`#seat:sage,back:oat,...`), so
  **Copy share link** reopens the same configuration.
- **AR handoff** in the viewer sends this exact configuration to a phone, where
  Quick Look or WebXR places it at real-world scale.

Targets `@liveroom-tech/react-immersive@6.2.0`, React 19.2.4 and Next.js 16.2.7.
Use Node 22.12+.

## Run

```bash
npm ci
cp .env.example .env.local   # then set NEXT_PUBLIC_LICENSE_KEY
npm run dev
```

`ModelViewer` needs a runtime key. A free key works on `localhost`; create one at
https://react-immersive.liveroom.dev/console. Production needs a paid plan with your
domain registered: https://react-immersive.liveroom.dev/docs/licensing

```bash
npm run typecheck
npm run build
npm start
```

## Files

| File | What it does |
| --- | --- |
| `app/product.ts` | The product definition (groups, swatches, prices) and the bindings that put each sofa part in a group |
| `app/Configurator.tsx` | Viewer, part picking, swatches, share link and AR |
| `app/ConfiguratorLoader.tsx` | Loads the viewer on the client only |
| `app/layout.tsx` | Imports the viewer stylesheet once |
| `scripts/generate-model.mjs` | Regenerates `public/sofa.glb` (`npm run generate:model`) |

## Use your own model

Replace `public/sofa.glb` and change the node names in `app/product.ts` to match
yours. Each binding's `group` decides which choice recolours it, so one swatch can
reach several meshes even when they share a material in the file.

## Testing AR on a phone

The phone has to load the page and the model itself, so `localhost` won't work;
the handoff dialog says so. Deploy a preview (or use an HTTPS tunnel to your dev
server), open it on the desktop, and scan the QR code from **AR handoff**. On
iPhone/iPad, **View in AR** opens Quick Look; on Android it starts WebXR. A free
key only validates on `localhost`, so a deployed preview needs a key for that
domain. Details: https://react-immersive.liveroom.dev/docs/reference/configured-ar

The sofa model is original, built from boxes by `scripts/generate-model.mjs`, and
free to reuse.
