# `react-immersive-docs`

`react-immersive-docs` is the public documentation and feedback surface for
`@live_room/react-immersive`.

The package itself is commercially maintained and the core source remains
private, but this repo is where users can:

- read the docs
- browse examples
- open public issues
- start discussions
- submit docs-focused pull requests

## What Lives Here

- Nextra docs pages under `pages/`
- Public theme and docs shell configuration in `theme.config.tsx`
- Public sample assets in `public/`
- Example apps in `examples/`

## Local Setup

Install dependencies and run the docs site:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
npm run start
```

## Docs Structure

- `pages/index.mdx` overview
- `pages/getting-started.mdx` onboarding and setup
- `pages/introduction.mdx` product rationale and concepts
- `pages/reference/` API reference pages
- `pages/hooks/` hook reference pages
- `pages/examples.mdx` public example index

## Public Examples

Examples live in `examples/` as standalone Vite apps:

- `simple-viewer-upload`
- `simple-model-viewer-demo`
- `model-viewer-demo`
- `binding-builder-demo`

Run an example from its own folder:

```bash
npm install
npm run dev
```

`model-viewer-demo` and `binding-builder-demo` require `VITE_LICENSE_KEY`.
