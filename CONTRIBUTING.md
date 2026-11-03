# Contributing

Thanks for helping improve the public `react-immersive` experience.

## What We Accept

- Docs corrections and clarity improvements, as [docs issues](https://github.com/Liveroom-Technologies/react-immersive-docs/issues/new?template=docs-issue.yml)
- New or improved examples
- Reproducible public bug reports
- Feature requests with a clear use case

## What We Do Not Accept

- Pull requests against the closed-source package internals
- Pull requests that edit `content/`: those files are published from the website
  on each deploy, so direct edits would be overwritten
- License, billing, or account requests in public
- Security disclosures in issues or discussions
- Uploads of proprietary customer models, textures, or internal code

## Pull Request Scope

Pull requests should stay within:

- `examples/`
- `.github/` community files
- `scripts/check-docs.mjs` and `scripts/check-snippets.mjs`

If an issue requires private product changes, maintainers will track that work
internally and link back here when there is a public update to share.

## Before Opening A PR

1. Open or reference an issue when the change is more than a small typo fix.
2. Keep changes focused and easy to review.
3. Avoid bundling unrelated docs and example edits together.
4. Do not add secrets, internal URLs, or proprietary assets.
5. Run `npm run check:docs` and `npm run check:snippets`. For a changed starter,
   run its `npm ci`, `npm run typecheck`, and `npm run build`.

## Review Notes

- Docs and examples should be clear, minimal, and beginner-friendly.
- Public-facing text should not imply that the package source is open.
- Maintainers may request changes before merging, or close a PR if it depends on private implementation work.
