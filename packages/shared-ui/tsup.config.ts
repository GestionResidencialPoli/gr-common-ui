import { defineConfig } from "tsup";

// bundle: false transpila archivo por archivo en lugar de agrupar. Es
// deliberado: la biblioteca mezcla componentes de servidor y de cliente, y
// agrupar perderia las directivas "use client" de cada archivo, forzando a
// que todo el paquete se ejecute en el cliente.
export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  outDir: "dist",
  format: ["esm"],
  bundle: false,
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2022",
});
