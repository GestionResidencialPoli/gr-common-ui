import { defineConfig } from "tsup";

// Mismo criterio que shared-ui: sin empaquetar, archivo por archivo.
export default defineConfig({
  entry: ["src/**/*.ts"],
  outDir: "dist",
  format: ["esm"],
  bundle: false,
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2022",
});
