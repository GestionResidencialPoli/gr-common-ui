import type { CategoriaPublicacion } from "./types";

const LABELS: Record<CategoriaPublicacion, string> = {
  AVISO: "Aviso",
  NOTICIA: "Noticia",
  URGENTE: "Urgente",
  MANTENIMIENTO: "Mantenimiento",
};

export function CategoriaBadge({ categoria }: { categoria: CategoriaPublicacion }) {
  const emphasis = categoria === "URGENTE" ? " gr-badge--urgente" : "";
  return <span className={`gr-badge${emphasis}`}>{LABELS[categoria]}</span>;
}

export function categoriaLabel(categoria: CategoriaPublicacion): string {
  return LABELS[categoria];
}
