import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version ?? "")) throw new Error("Usage: npm run starters:update -- <exact SDK version>");
const folders = readdirSync(path.join(root, "examples"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < folders.length) {
    const folder = folders[cursor++];
    const cwd = path.join(root, "examples", folder);
    const manifest = path.join(cwd, "package.json");
    const pkg = JSON.parse(readFileSync(manifest, "utf8"));
    // Vite and Next.js starters already use ESM configuration.
    pkg.type = "module";
    writeFileSync(manifest, `${JSON.stringify(pkg, null, 2)}\n`);
    await new Promise((resolve, reject) => {
      const child = spawn("npm", ["install", "--package-lock-only", "--ignore-scripts", "--no-audit", "--no-fund", "--save-exact", `@liveroom-tech/react-immersive@${version}`], { cwd, stdio: ["ignore", "pipe", "pipe"] });
      let output = "";
      child.stdout.on("data", (data) => { output += data; });
      child.stderr.on("data", (data) => { output += data; });
      child.on("error", reject);
      child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${folder}: ${output}`)));
    });
    console.log(`${folder}: locked ${version}`);
  }
}));
