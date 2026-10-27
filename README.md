# React Immersive — React 3D model viewer docs

`react-immersive-docs` is the public documentation and feedback surface for
`@liveroom-tech/react-immersive`.

[Website](https://react-immersive.liveroom.dev) · [Documentation](https://react-immersive.liveroom.dev/docs) · [Live editor](https://react-immersive.liveroom.dev/editor) · [npm](https://www.npmjs.com/package/@liveroom-tech/react-immersive)

**Documentation and starters target 5.2.0 with React 19.** Start with the
[AI Agent Guide](https://react-immersive.liveroom.dev/docs/agent-guide),
[compact Markdown index](https://react-immersive.liveroom.dev/llms.txt),
[Vite setup](https://react-immersive.liveroom.dev/docs/frameworks/vite), or
[Next.js App Router setup](https://react-immersive.liveroom.dev/docs/frameworks/nextjs).
The docs host has its own React dependencies; install the SDK inside a starter
or consuming app, not into the documentation host.

The package itself is commercially maintained and the core source remains
private, but this repo is where users can:

- read the docs
- browse examples
- open public issues
- start discussions

## What Lives Here

- Documentation pages under `pages/`
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

- `simple-model-viewer-demo`
- `model-viewer-demo`
- `binding-builder-demo`
- `switch-room-demo`
- `light-flicker-demo`
- `vehicle-configurator-demo`
- `exploded-view-demo`
- `mouse-controller-demo`
- `cinematic-tour-demo`
- `guided-tour-demo`
- `shareable-view-demo`
- `ar-product-viewer-demo`
- `animation-studio-demo`
- `texture-upload-demo`
- `nextjs-model-viewer-demo`

Run an example from its own folder:

```bash
npm install
npm run dev
```

Some examples require `VITE_LICENSE_KEY`, which can be created at [react-immersive.liveroom.dev/console](https://react-immersive.liveroom.dev/console).

Use Node 22.12+ for the full starter suite. Each example has its own lockfile,
`npm run typecheck`, and `npm run build`. The Next.js starter uses
`NEXT_PUBLIC_LICENSE_KEY` if you add a licensed component; SimpleModelViewer
does not need a key or paid plan, including in production. See [Licensing](https://react-immersive.liveroom.dev/docs/licensing) for the other components.

## Maintain and verify documentation

`pages/` is the shared MDX source. `docs-version.json` records the supported npm
version and peers. Do not hand-edit generated files under `public/docs/`.

```bash
npm run docs:generate
npm run check:docs
npm run check:snippets
npm run check:published
npm run build
```

`check:snippets` installs an isolated consumer under `.cache/` and compiles the
complete onboarding and framework files plus all documented SDK named imports.
`check:published` compares the supported version/peers with npm. Public CI also
typechecks and builds every starter, and checks external links for 404/410.
Build/dev scripts generate clean Markdown, a manifest, small API sections,
`llms.txt`, the optional full bundle, and the package license mirror.

To check snippets against a locally built SDK instead of the installed npm
package, pass its directory:

```bash
npm run check:snippets -- --sdk-path ../react-immersive-core/react-immersive-npm
```

Build that package first. This checks all documented imports and complete
examples without changing the starter manifests or installed dependency.

The long package README examples are retained in `reference/package.md`; npm's
README stays short and links to that extended reference.

When maintaining the hosted website in an adjacent checkout, run
`npm run docs:sync` to copy the MDX, version metadata, license, sample bindings,
reference, and generator into it. Use `npm run docs:sync:check` to detect drift.
Set `REACT_IMMERSIVE_WEBSITE` to use a different website checkout path. Each
repository builds independently after synchronization.
