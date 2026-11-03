# React Immersive — React 3D model viewer docs

`react-immersive-docs` is the public documentation and feedback surface for
`@liveroom-tech/react-immersive`.

[Website](https://react-immersive.liveroom.dev) · [Documentation](https://react-immersive.liveroom.dev/docs) · [Live editor](https://react-immersive.liveroom.dev/editor) · [npm](https://www.npmjs.com/package/@liveroom-tech/react-immersive)

Start with the
[AI Agent Guide](https://react-immersive.liveroom.dev/docs/agent-guide),
[compact Markdown index](https://react-immersive.liveroom.dev/llms.txt),
[Vite setup](https://react-immersive.liveroom.dev/docs/frameworks/vite), or
[Next.js App Router setup](https://react-immersive.liveroom.dev/docs/frameworks/nextjs).

The package itself is commercially maintained and the core source remains
private, but this repo is where users can:

- read the docs
- browse examples
- open public issues
- start discussions

## What Lives Here

- A published copy of the documentation under `content/`
- Public sample assets in `public/`
- Example apps in `examples/`

## Docs Structure

The docs here are published automatically from the website each time it deploys,
so they always match [the live documentation](https://react-immersive.liveroom.dev/docs).
Direct edits to the published files are overwritten by the next deploy. To report
a problem or suggest a change, [open a docs issue](https://github.com/Liveroom-Technologies/react-immersive-docs/issues/new?template=docs-issue.yml).

- `content/index.mdx` overview
- `content/getting-started.mdx` onboarding and setup
- `content/introduction.mdx` product rationale and concepts
- `content/reference/` API reference pages
- `content/hooks/` hook reference pages
- `content/examples.mdx` public example index

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

`content/`, `docs-version.json`, `PACKAGE-LICENSE.txt`, `reference/package.md`,
`public/llms.txt`, `public/objectBindings.ts`, and
`scripts/generate-agent-docs.mjs` are published from the website. Everything else
here is maintained in this repo. `docs-version.json` records the supported peers.

```bash
npm run docs:generate
npm run check:docs
npm run check:snippets
npm run check:published
```

These commands have no dependencies to install. `check:snippets` installs an
isolated consumer under `.cache/` and compiles the complete onboarding and
framework files plus all documented SDK named imports against the latest npm
release. `check:published` compares the supported peers with npm. Public CI also
typechecks and builds every starter, and checks external links for 404/410.
`docs:generate` writes clean Markdown, a manifest, small API sections, `llms.txt`,
the optional full bundle, and the package license mirror.

To check snippets against a locally built SDK instead of the installed npm
package, pass its directory:

```bash
npm run check:snippets -- --sdk-path ../react-immersive-core/react-immersive-npm
```

Build that package first. This checks all documented imports and complete
examples without changing the starter manifests or installed dependency.

The long package README examples are retained in `reference/package.md`; npm's
README stays short and links to that extended reference.

