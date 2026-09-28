import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const target = resolve(process.argv[2] ?? "dist");

const SPECIFIER = /(\bfrom\s*|\bimport\s*\(\s*)(["'])(\.{1,2}\/[^"']*)\2/g;

function toJsSpecifier(specifier) {
  if (specifier.endsWith(".ts")) return `${specifier.slice(0, -3)}.js`;
  if (specifier.endsWith(".tsx")) return `${specifier.slice(0, -4)}.js`;
  if (/\.(js|mjs|cjs|json|css)$/.test(specifier)) return specifier;
  return `${specifier}.js`;
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (full.endsWith(".js")) files.push(full);
  }
  return files;
}

let rewritten = 0;
for (const file of walk(target)) {
  const source = readFileSync(file, "utf8");
  const output = source.replace(
    SPECIFIER,
    (_match, keyword, quote, specifier) => `${keyword}${quote}${toJsSpecifier(specifier)}${quote}`,
  );
  if (output !== source) {
    writeFileSync(file, output);
    rewritten += 1;
  }
}

console.log(`normalize-esm-imports: ${rewritten} archivo(s) reescrito(s) en ${target}`);
