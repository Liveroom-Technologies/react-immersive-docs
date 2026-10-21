import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const support = JSON.parse(readFileSync(path.join(root, "docs-version.json"), "utf8"));
export const contentDir = path.join(root, existsSync(path.join(root, "content")) ? "content" : "pages");

export function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

export function slugify(title) {
  return title.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/ /g, "-");
}

export function markdown(source, canonical) {
  // Transform presentation wrappers only outside fenced code. Example TSX must
  // remain byte-for-byte equivalent, apart from indentation around Nextra tabs.
  let indent = 0;
  let fenced = false;
  const parts = [];
  let prose = [];
  function flush() {
    parts.push(prose.join("\n")
      .replace(/^import\s+.*from\s+["']nextra\/components["'];?\s*$/gm, "")
      .replace(/<\/?(?:Callout|Steps|Tabs(?:\.Tab)?|span)\b[^>]*>/gs, "")
      .replace(/\]\((#[^)]+)\)/g, (_, hash) => `](${canonical}${hash})`)
      .replace(/^[\t ]+$/gm, "")
      .replace(/\n{3,}/g, "\n\n"));
    prose = [];
  }
  for (const line of source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").split("\n")) {
    const fence = line.match(/^(\s*)```/);
    if (!fenced && fence) {
      flush(); indent = fence[1].length; fenced = true;
      parts.push(line.slice(indent));
    } else if (fenced) {
      parts.push(line.startsWith(" ".repeat(indent)) ? line.slice(indent) : line);
      if (fence) fenced = false;
    } else prose.push(line);
  }
  flush();
  return parts.join("\n").trim() + "\n";
}

export function pages() {
  return walk(contentDir).filter((file) => file.endsWith(".mdx")).map((file) => {
    const relative = path.relative(contentDir, file).split(path.sep).join("/");
    const slug = relative.replace(/\.mdx$/, "").replace(/(^|\/)index$/, "");
    const url = `${support.site}/docs${slug ? `/${slug}` : ""}`;
    const source = readFileSync(file, "utf8");
    const title = source.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, "") ?? slug;
    const text = markdown(source, url);
    return { file, relative, slug, url, title, text };
  });
}

export function generate() {
  const docs = pages();
  const publicDir = path.join(root, "public");
  const outputDir = path.join(publicDir, "docs");
  rmSync(outputDir, { recursive: true, force: true }); // This directory contains generated files only.
  function write(relative, value) {
    const file = path.join(publicDir, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, value);
  }
  const sections = [];
  const manifestPages = [];
  for (const doc of docs) {
    const output = `${doc.slug || "index"}.md`;
    const header = `<!-- Generated from ${doc.relative}; edit the MDX source. -->\n\nPackage: ${support.package}@${support.version}\nCanonical: ${doc.url}\n\n`;
    const text = header + doc.text;
    write(`docs/${output}`, text);
    manifestPages.push({ title: doc.title, url: doc.url, markdown: `${support.site}/docs/${output}`,
      source: `${support.repository}/blob/main/pages/${doc.relative}`,
      bytes: Buffer.byteLength(text), sha256: createHash("sha256").update(text).digest("hex") });
    if (doc.slug !== "reference/model-viewer") continue;
    const lines = doc.text.split("\n");
    const headings = [];
    const seen = new Map();
    let fenced = false;
    lines.forEach((line, index) => {
      if (line.startsWith("```")) fenced = !fenced;
      const heading = !fenced && line.match(/^(#{1,3})\s+(.+)$/);
      if (!heading) return;
      const slug = slugify(heading[2]);
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      headings.push({ index, level: heading[1].length, title: heading[2], slug: slug + (count ? `-${count}` : "") });
    });
    for (const heading of headings.filter((h) => h.level > 1)) {
      const next = headings.find((h) => h.index > heading.index && h.level <= heading.level);
      const text = `${header}# ModelViewer: ${heading.title}\n\nSource section: ${doc.url}#${heading.slug}\n\n${lines.slice(heading.index + 1, next?.index).join("\n").trim()}\n`;
      const relative = `docs/reference/model-viewer/${heading.slug}.md`;
      write(relative, text);
      sections.push({ title: heading.title, url: `${doc.url}#${heading.slug}`, markdown: `${support.site}/${relative}`, bytes: Buffer.byteLength(text) });
    }
  }
  const resources = [];
  const packageReference = path.join(root, "reference/package.md");
  if (existsSync(packageReference)) {
    write("docs/package-reference.md", readFileSync(packageReference));
    resources.push({ title: "Extended package reference", markdown: `${support.site}/docs/package-reference.md` });
  }
  const manifest = { ...support, pages: manifestPages, sections, resources };
  write("docs/manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  const agent = docs.find((doc) => doc.slug === "agent-guide");
  const index = `# React Immersive\n\n> ${support.package}@${support.version}: interactive 3D viewers and scene authoring for React 19.\n\n` +
    `Official package: https://www.npmjs.com/package/${support.package}\nPublic source: ${support.repository}\nCompatibility: React/React DOM ${support.peerDependencies.react}; Three.js ${support.peerDependencies.three}; React Three Fiber ${support.peerDependencies["@react-three/fiber"]}.\n\n` +
    `Start with SimpleModelViewer from /simple-model-viewer, its simple-model-viewer.css stylesheet, a public model URL and a container with explicit height. ModelViewer is imported from the main entry; BindingBuilder from /binding-builder. Both need a runtime licenseKey. SimpleModelViewer has no key prop and needs no key or paid plan, including in production.\n\n` +
    `## Start here\n\n- [Agent guide](${support.site}/docs/agent-guide.md): component choice, first render, APIs and validation.\n- [Vite setup](${support.site}/docs/frameworks/vite.md): complete React 19 files.\n- [Next.js setup](${support.site}/docs/frameworks/nextjs.md): App Router, CSS and client boundary.\n- [Getting started](${support.site}/docs/getting-started.md): bindings and mutable state.\n- [Licensing](${support.site}/docs/licensing.md): local vs production, manual account/key steps.\n- [Troubleshooting](${support.site}/docs/troubleshooting.md): imports, types, assets, CORS and rendering.\n- [Versions and migration](${support.site}/docs/releases.md): supported baseline and upgrading starters.\n- [Manifest](${support.site}/docs/manifest.json): exact version, peers, all page URLs and small ModelViewer section URLs.\n\n## Reference pages\n\n` +
    manifestPages.filter((doc) => /\/docs\/(hooks|reference)\//.test(doc.url)).map((doc) => `- [${doc.title}](${doc.markdown})`).join("\n") +
    `\n\n## Examples and optional full reference\n\n- [Examples](${support.site}/docs/examples.md): runnable starters and live demos.\n- [Sample model](${support.site}/red_room.glb): Red Room by LaisLH, CC BY 4.0; https://skfb.ly/6VBJR.\n- [Package license](${support.site}/LICENSE.txt)\n- [Extended package reference](${support.site}/docs/package-reference.md): detailed package examples preserved separately from the short npm README.\n- [Full documentation](${support.site}/llms-full.txt): large; prefer individual pages or manifest sections.\n\nEach HTML docs page has a .md alternative. Accept: text/markdown also selects it.\n`;
  write("llms.txt", index);
  write("docs/llms.txt", index);
  write("llms-full.txt", docs.map((doc) => `Canonical: ${doc.url}\nPackage: ${support.package}@${support.version}\n\n${doc.text}`).join("\n\n---\n\n"));
  const license = path.join(root, "PACKAGE-LICENSE.txt");
  if (existsSync(license)) write("LICENSE.txt", readFileSync(license));
  if (!agent) throw new Error("Agent guide is missing");
  console.log(`Generated ${docs.length} Markdown pages and ${sections.length} ModelViewer sections for ${support.version}.`);
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
