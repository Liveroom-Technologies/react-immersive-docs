import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { generate, markdown, pages, root, slugify, support } from "./generate-agent-docs.mjs";

const docs = pages();
const errors = [];
function check(condition, message) { if (!condition) errors.push(message); }
const routes = new Map();
const anchors = new Map();
for (const doc of docs) {
  const url = new URL(doc.url);
  routes.set(url.pathname, doc);
  routes.set(`${url.pathname === "/docs" ? "/docs/index" : url.pathname}.md`, doc);
  let fenced = false;
  const ids = new Set();
  const seen = new Map();
  for (const line of doc.text.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced;
    const heading = !fenced && line.match(/^#{1,6}\s+(.+)$/);
    if (!heading) continue;
    const slug = slugify(heading[1]);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    ids.add(slug + (count ? `-${count}` : ""));
  }
  anchors.set(doc.url, ids);
}
const manifest = generate();
const generated = new Set(["/docs/manifest.json", "/docs/llms.txt", "/llms.txt", "/llms-full.txt", "/LICENSE.txt",
  ...manifest.resources.map((resource) => new URL(resource.markdown).pathname),
  ...manifest.sections.map((section) => new URL(section.markdown).pathname)]);

// Validate actual destinations, including fragments, rather than the spelling
// of link source. URLs in code blocks are examples and intentionally excluded.
const external = new Set();
for (const doc of docs) {
  const prose = doc.text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, "");
  for (const match of prose.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const url = new URL(match[1], doc.url);
    if (!/^https?:$/.test(url.protocol)) continue;
    if (url.origin !== support.site) {
      const repositoryPath = new URL(support.repository).pathname.toLowerCase();
      const prefix = `${repositoryPath}/`;
      if (url.hostname === "github.com" && url.pathname.toLowerCase().startsWith(prefix)) {
        const local = url.pathname.slice(prefix.length).match(/^(?:blob|tree)\/main\/(.+)$/);
        if (local) {
          check(existsSync(path.join(root, local[1])), `${doc.relative}: missing repository file ${url.href}`);
          continue;
        }
      }
      external.add(url.href); continue;
    }
    const destination = routes.get(url.pathname);
    if (destination) {
      if (url.hash) check(anchors.get(destination.url).has(decodeURIComponent(url.hash.slice(1))), `${doc.relative}: missing fragment ${url.href}`);
    } else if (!generated.has(url.pathname) && !existsSync(path.join(root, "public", url.pathname))) {
      check(["/", "/pricing", "/console", "/editor", "/showcase"].includes(url.pathname) || /^\/examples\/[a-z0-9-]+$/.test(url.pathname), `${doc.relative}: unknown route ${url.href}`);
    }
  }
}

// Compatibility tables are checked in addition to the machine manifest.
const introduction = docs.find((doc) => doc.slug === "introduction").text;
for (const slug of ["index", "introduction", "getting-started", "agent-guide", "frameworks/vite", "frameworks/nextjs", "releases"]) {
  const doc = docs.find((page) => (page.slug || "index") === slug);
  check(doc?.text.includes(support.version), `${slug}: missing supported version ${support.version}`);
}
for (const [peer, range] of Object.entries(support.peerDependencies)) {
  check(introduction.includes(`| \`${peer}\` | \`${range}\` |`), `Introduction is missing ${peer} ${range}`);
}
for (const folder of readdirSync(path.join(root, "examples"), { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const directory = path.join(root, "examples", folder.name);
  if (!existsSync(path.join(directory, "package.json"))) continue;
  const pkg = JSON.parse(readFileSync(path.join(directory, "package.json"), "utf8"));
  if (!existsSync(path.join(directory, "package-lock.json"))) {
    errors.push(`${folder.name}: missing package-lock.json`);
    continue;
  }
  const lock = JSON.parse(readFileSync(path.join(directory, "package-lock.json"), "utf8"));
  check(pkg.dependencies[support.package] === support.version, `${folder.name}: incorrect SDK version`);
  check(lock.packages[""].dependencies[support.package] === support.version, `${folder.name}: stale root lockfile version`);
  const locked = lock.packages[`node_modules/${support.package}`];
  check(locked?.version === support.version, `${folder.name}: stale resolved SDK version`);
  check(Boolean(pkg.scripts.typecheck), `${folder.name}: missing typecheck script`);
  const native = pkg.dependencies.next ? "@next/swc" : "@rolldown/binding";
  for (const platform of ["linux-x64-gnu", "darwin-arm64"]) {
    check(Boolean(lock.packages[`node_modules/${native}-${platform}`]), `${folder.name}: lockfile is missing ${native}-${platform}; regenerate it without an existing node_modules directory`);
  }
}

// The Next.js guide is executable source, so changes must also update its app.
const nextGuide = docs.find((doc) => doc.slug === "frameworks/nextjs").text;
for (const match of nextGuide.matchAll(/```(?:tsx|js) filename="([^"]+)"\n([\s\S]*?)\n```/g)) {
  const file = path.join(root, "examples/nextjs-model-viewer-demo", match[1]);
  check(existsSync(file) && readFileSync(file, "utf8").trim() === match[2].trim(), `Next.js starter does not match ${match[1]} in the guide`);
}

// The sample bindings must address authored nodes in the actual GLB.
const glb = readFileSync(path.join(root, "public/red_room.glb"));
const model = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString());
// GLTFLoader uses Three.js PropertyBinding.sanitizeNodeName: spaces become
// underscores and animation-path punctuation is removed before IDs are exposed.
const nodes = new Set(model.nodes.map((node) => (node.name ?? "").replace(/\s/g, "_").replace(/[\[\].:/]/g, "")));
const bindings = readFileSync(path.join(root, "public/objectBindings.ts"), "utf8");
for (const match of bindings.matchAll(/modelObjectId:\s*"([^"]+)"/g)) check(nodes.has(match[1]), `Sample binding does not address a model node: ${match[1]}`);
const license = readFileSync(path.join(root, "PACKAGE-LICENSE.txt"), "utf8");
check(license.includes("SimpleModelViewer may be used and distributed as part of local and production\napplications without a license key."), "Package terms must explicitly permit SimpleModelViewer in production without a key");
check(docs.find((doc) => doc.slug === "licensing").text.includes("No key or paid plan required"), "Licensing guide must keep SimpleModelViewer key-free in production");

// A regression here would silently turn the examples into prose or strip JSX.
const sample = markdown('---\ntitle: Example\n---\nimport { Callout } from "nextra/components";\n<Callout type="info">\nRead this.\n</Callout>\n```tsx\n<div style={{ height: "100vh" }}><Viewer /></div>\n```\n', support.site);
assert(sample.includes('<div style={{ height: "100vh" }}><Viewer /></div>'));
assert(!sample.includes("<Callout"));
for (const doc of docs) {
  check(doc.text.match(/^```/gm)?.length % 2 !== 1, `${doc.relative}: unclosed code fence`);
  check(!doc.text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, "").match(/<\/?(?:Callout|Tabs|Steps|span)\b/), `${doc.relative}: leaked MDX wrapper`);
}

if (process.argv.includes("--published")) {
  const response = await fetch(`https://registry.npmjs.org/${support.package.replace("/", "%2f")}/${support.version}`);
  check(response.ok, `Cannot read published ${support.package}@${support.version}`);
  if (response.ok) {
    const published = await response.json();
    check(published.version === support.version, "Published version mismatch");
    for (const [peer, range] of Object.entries(support.peerDependencies)) check(published.peerDependencies[peer] === range, `Published peer mismatch: ${peer}`);
  }
}
if (process.argv.includes("--external")) {
  // Bounded link checks: redirects are followed; rate-limited/bot-blocked
  // responses are reported separately rather than mislabeled as broken links.
  const links = [...external];
  const blocked = [];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (links.length) {
      const url = links.shift();
      try {
        const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(15000) });
        check(response.status !== 404 && response.status !== 410, `Broken external link: ${response.status} ${url}`);
        if (!response.ok) blocked.push(`${response.status} ${url}`);
      } catch { blocked.push(`Could not verify ${url}`); }
    }
  }));
  if (blocked.length) console.warn(`External links requiring manual verification:\n${blocked.join("\n")}`);
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`Validated ${docs.length} pages, links/fragments, compatibility, starter versions, sample bindings and Markdown generation.`);
