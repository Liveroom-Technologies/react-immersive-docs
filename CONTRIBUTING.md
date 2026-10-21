# Contributing

Thanks for helping improve the public `react-immersive` experience.

## What We Accept

- Docs corrections and clarity improvements
- New or improved examples
- Reproducible public bug reports
- Feature requests with a clear use case

## What We Do Not Accept

- Pull requests against the closed-source package internals
- License, billing, or account requests in public
- Security disclosures in issues or discussions
- Uploads of proprietary customer models, textures, or internal code

## Pull Request Scope

Pull requests should stay within:

- `pages/`
- `examples/`
- `.github/` community files
- `scripts/`, `docs-version.json`, and `reference/` documentation tooling
- Generated `public/llms.txt` and public sample bindings

If an issue requires private product changes, maintainers will track that work
internally and link back here when there is a public update to share.

## Before Opening A PR

1. Open or reference an issue when the change is more than a small typo fix.
2. Keep changes focused and easy to review.
3. Avoid bundling unrelated docs and example edits together.
4. Do not add secrets, internal URLs, or proprietary assets.
5. Run `npm run check:docs` and `npm run check:snippets`. For a changed starter,
   run its `npm ci`, `npm run typecheck`, and `npm run build`.
6. Run `npm run docs:generate` after editing MDX. Commit the generated
   `public/llms.txt`; per-page Markdown and the full bundle are build outputs.

## Review Notes

- Docs and examples should be clear, minimal, and beginner-friendly.
- Public-facing text should not imply that the package source is open.
- Maintainers may request changes before merging, or close a PR if it depends on private implementation work.
