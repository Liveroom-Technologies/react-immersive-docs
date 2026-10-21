# Working with the public documentation

This repository contains public documentation and examples for the proprietary
`@liveroom-tech/react-immersive` package. It does not contain the product source.

- Read `docs-version.json` for the supported package version and peer ranges.
- Use `pages/agent-guide.mdx` for consumer integration guidance and component selection.
- Edit documentation in `pages/`; the generator preserves fenced code and removes presentation wrappers for Markdown exports.
- Run `npm run check:docs` for routes, fragments, versions, sample bindings and generated content.
- Run `npm run check:snippets` for published SDK imports and complete tutorial files. It uses an isolated consumer so the docs host's React version does not affect SDK checks.
- For a changed example, run its typecheck and production build. Keep its manifest and lockfile aligned with the supported SDK version.
- Run `npm run docs:generate` and include the generated `public/llms.txt` update. Other generated public documentation files are ignored and rebuilt on dev/build.
- `npm run docs:sync` mirrors shared sources into an adjacent hosted website checkout; each checkout can build independently.
- SimpleModelViewer needs no key or paid plan, including in production. ModelViewer and BindingBuilder require a key and the appropriate plan. Follow `pages/licensing.mdx` and `PACKAGE-LICENSE.txt`.
