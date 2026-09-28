export const CATEGORIAS_PUBLICACION = ["AVISO", "NOTICIA", "URGENTE", "MANTENIMIENTO"] as const;
export type CategoriaPublicacion = (typeof CATEGORIAS_PUBLICACION)[number];

export type PublicacionResumen = {
  id: number;
  autorNombre: string;
  titulo: string;
  extracto: string;
  categoria: CategoriaPublicacion;
  fijada: boolean;
  createdAt: string;
};

export type Publicacion = {
  id: number;
  autorUserId: number;
  autorNombre: string;
  titulo: string;
  cuerpo: string;
  categoria: CategoriaPublicacion;
  fijada: boolean;
  vigenciaHasta: string | null;
  editada: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageResult<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
