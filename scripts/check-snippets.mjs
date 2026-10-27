import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pages, root, support } from "./generate-agent-docs.mjs";

const fixture = path.join(root, ".cache", "docs-snippets");
const sdkOption = process.argv.indexOf("--sdk-path");
if (sdkOption !== -1 && !process.argv[sdkOption + 1]) throw new Error("--sdk-path requires a built package directory");
const sdkPath = sdkOption === -1 ? null : path.resolve(process.argv[sdkOption + 1]);
if (sdkPath && !existsSync(path.join(sdkPath, "dist/index.d.ts"))) throw new Error(`Build the SDK first: ${sdkPath}`);
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
  for (const match of doc.text.matchAll(/```(?:tsx?|jsx?)([^\n]*)\n([\s\S]*?)\n```/g)) {
    const ast = ts.createSourceFile("example.tsx", match[2], ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
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
    const filename = match[1].match(/filename="([^"]+)"/)?.[1];
    if (filename) {
      const file = path.join(src, doc.slug, filename);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, match[2] + "\n");
    }
  }

}
writeFileSync(path.join(src, "public-imports.ts"), imports);
writeFileSync(path.join(src, "sample-bindings.ts"), readFileSync(path.join(root, "public/objectBindings.ts")));
writeFileSync(path.join(fixture, "tsconfig.json"), JSON.stringify({
  compilerOptions: { target: "ES2022", lib: ["DOM", "DOM.Iterable", "ES2022"], module: "ESNext", moduleResolution: "bundler", jsx: "react-jsx", strict: true, noEmit: true, skipLibCheck: false, esModuleInterop: true, types: ["node"],
    ...(sdkPath ? { paths: {
      [support.package]: [path.join(sdkPath, "dist/index.d.ts")],
      [`${support.package}/*`]: [path.join(sdkPath, "dist/*")],
    } } : {}),
  },
  include: ["src"],
}, null, 2));
run(process.execPath, [path.join(fixture, "node_modules/typescript/bin/tsc"), "-p", fixture]);
console.log(`Compiled onboarding, Vite/Next.js guide files, sample bindings, complete reference examples, and ${counter} documented package imports against ${sdkPath ?? `npm ${support.version}`}.`);
