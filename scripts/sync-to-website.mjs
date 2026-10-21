import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const website = path.resolve(process.env.REACT_IMMERSIVE_WEBSITE ?? path.join(root, "../react-immersive-core/react-immersive-web"));
const check = process.argv.includes("--check");
if (!existsSync(path.join(website, "content"))) throw new Error(`Website checkout not found: ${website}`);

const pairs = [["docs-version.json", "docs-version.json"], ["PACKAGE-LICENSE.txt", "PACKAGE-LICENSE.txt"],
  ["reference/package.md", "reference/package.md"],
  ["scripts/generate-agent-docs.mjs", "scripts/generate-agent-docs.mjs"], ["public/objectBindings.ts", "public/objectBindings.ts"]];
function collect(dir) {
  for (const entry of readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const source = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collect(source);
    else if (/\.(mdx|js)$/.test(entry.name)) pairs.push([source, source.replace(/^pages\//, "content/")]);
  }
}
collect("pages");
let changed = false;
for (const [source, destination] of pairs) {
  const from = path.join(root, source), to = path.join(website, destination);
  if (existsSync(to) && readFileSync(from).equals(readFileSync(to))) continue;
  changed = true;
  if (check) console.error(`Out of sync: ${destination}`);
  else { mkdirSync(path.dirname(to), { recursive: true }); copyFileSync(from, to); }
}
if (check && changed) process.exitCode = 1;
else if (!check) {
  const result = spawnSync(process.execPath, ["scripts/generate-agent-docs.mjs"], { cwd: website, stdio: "inherit" });
  process.exitCode = result.status ?? 1;
}
