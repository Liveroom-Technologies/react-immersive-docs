# Working with the public documentation

This repository contains public documentation and examples for the proprietary
`@liveroom-tech/react-immersive` package. It does not contain the product source.

- Do not edit `content/`, `docs-version.json`, `PACKAGE-LICENSE.txt`, `reference/package.md`, `public/llms.txt`, `public/objectBindings.ts`, or `scripts/generate-agent-docs.mjs`. They are published from the private website repo on each deploy, and direct edits are overwritten. Report docs problems as issues.
- Read `docs-version.json` for the supported peer ranges.
- Use `content/agent-guide.mdx` for consumer integration guidance and component selection.
- Run `npm run check:docs` for routes, fragments, starter versions, sample bindings and generated content.
- Run `npm run check:snippets` for published SDK imports and complete tutorial files. It uses an isolated consumer on the latest npm release.
- For a changed example, run its typecheck and production build. Keep its manifest and lockfile on the same SDK version as the other starters.
- SimpleModelViewer needs no key or paid plan, including in production. ModelViewer and BindingBuilder require a key and the appropriate plan. Follow `content/licensing.mdx` and `PACKAGE-LICENSE.txt`.
