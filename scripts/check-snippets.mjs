import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pages, root, support } from "./generate-agent-docs.mjs";

const fixture = path.join(root, ".cache", "docs-snippets");
mkdirSync(fixture, { recursive: true });
const pkg = {
  private: true,
  dependencies: { [support.package]: support.version, ...support.peerDependencies, next: "16.2.7" },
  devDependencies: { typescript: "^5.9.0", "@types/node": "^22", "@types/react": "~19.2.0", "@types/react-dom": "~19.2.0", "@types/three": "^0.184.0" },
};
const packageFile = path.join(fixture, "package.json");
const packageText = JSON.stringify(pkg, null, 2) + "\n";
if (!existsSync(packageFile) || readFileSync(packageFile, "utf8") !== packageText) writeFileSync(packageFile, packageText);
function run(command, args) {
  const result = spawnSync(command, args, { cwd: fixture, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"]);
const ts = await import(path.join(fixture, "node_modules/typescript/lib/typescript.js"));
const src = path.join(fixture, "src");
rmSync(src, { recursive: true, force: true });
mkdirSync(src, { recursive: true });
const docs = pages();
let imports = "";
let counter = 0;
for (const doc of docs) {
  for (const match of doc.text.matchAll(/```(?:tsx?|jsx?)[^\n]*\n([\s\S]*?)\n```/g)) {
    const ast = ts.createSourceFile("example.tsx", match[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const node of ast.statements) {
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const module = node.moduleSpecifier.text;
      if (!module.startsWith(support.package) || !node.importClause?.namedBindings || !ts.isNamedImports(node.importClause.namedBindings)) continue;
      for (const item of node.importClause.namedBindings.elements) {
        const name = (item.propertyName ?? item.name).text;
        const type = node.importClause.isTypeOnly || item.isTypeOnly ? "type " : "";
        imports += `import ${type}{ ${name} as symbol${counter++} } from ${JSON.stringify(module)};\n`;
      }
    }
  }
  if (!["getting-started", "frameworks/vite", "frameworks/nextjs", "index"].includes(doc.slug)) continue;
  for (const match of doc.text.matchAll(/```tsx? filename="([^"]+)"\n([\s\S]*?)\n```/g)) {
    const file = path.join(src, doc.slug, match[1]);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, match[2] + "\n");
  }
}
writeFileSync(path.join(src, "public-imports.ts"), imports);
writeFileSync(path.join(src, "sample-bindings.ts"), readFileSync(path.join(root, "public/objectBindings.ts")));
writeFileSync(path.join(fixture, "tsconfig.json"), JSON.stringify({
  compilerOptions: { target: "ES2022", lib: ["DOM", "DOM.Iterable", "ES2022"], module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false, esModuleInterop: true, types: ["node"] },
  include: ["src"],
}, null, 2));
run(process.execPath, [path.join(fixture, "node_modules/typescript/bin/tsc"), "-p", fixture]);
console.log(`Compiled onboarding, Vite/Next.js guide files, sample bindings, and ${counter} documented package imports against npm ${support.version}.`);
