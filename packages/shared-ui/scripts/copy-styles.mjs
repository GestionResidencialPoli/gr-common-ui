// tsup no procesa la hoja de estilos porque el build corre sin empaquetar.
// Se copia tal cual: es CSS plano con variables, no necesita transformacion.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/styles.css", "dist/styles.css");
