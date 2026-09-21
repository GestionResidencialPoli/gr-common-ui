/**
 * Normaliza los especificadores relativos de la salida ESM.
 *
 * El build corre sin empaquetar para preservar las directivas "use client", y
 * en ese modo esbuild no reescribe los especificadores: deja `./x.ts` tal cual
 * o `./x` sin extension. Ninguno de los dos resuelve bajo ESM de Node, donde la
 * extension es obligatoria y el archivo emitido es `./x.js`. Los bundlers lo
 * toleran, Node no, y un paquete publicado debe funcionar en ambos.
 *
 * Uso: node scripts/normalize-esm-imports.mjs <directorio>
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const target = resolve(process.argv[2] ?? "dist");

// Captura la parte del especificador en import/export ... from "..." y en
// import("...") dinamico, solo cuando es relativo.
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
