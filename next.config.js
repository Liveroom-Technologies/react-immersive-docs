const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

async function docsPages() {
  const { pages } = await import("./scripts/generate-agent-docs.mjs");
  return pages();
}

module.exports = withNextra({
  async rewrites() {
    return {
      beforeFiles: (await docsPages()).map((page) => ({
        source: `/${page.slug}`,
        destination: `/docs/${page.slug || "index"}.md`,
        has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
      })),
    };
  },
  async headers() {
    return [
      ...(await docsPages()).map((page) => ({
        source: `/${page.slug}`,
        headers: [
          { key: "Vary", value: "Accept" },
          { key: "Link", value: `</docs/${page.slug || "index"}.md>; rel="alternate"; type="text/markdown"` },
        ],
      })),
      { source: "/docs/:file*.md", headers: [{ key: "Content-Type", value: "text/markdown; charset=utf-8" }] },
    ];
  },
});
