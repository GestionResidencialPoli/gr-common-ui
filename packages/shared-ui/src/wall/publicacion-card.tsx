import type { ReactNode } from "react";
import { Card } from "../components/primitives";
import { CategoriaBadge } from "./categoria-badge";
import type { PublicacionResumen } from "./types";

export function PublicacionCard({
  publicacion,
  href,
  dateLabel,
  actions,
}: {
  publicacion: PublicacionResumen;
  href: string;
  dateLabel: string;
  actions?: ReactNode;
}) {
  return (
    <Card className="gr-publicacion-card">
      {publicacion.fijada && <span className="gr-badge gr-badge--pin">Fijada</span>}
      <a href={href} className="gr-publicacion-link">
        <CategoriaBadge categoria={publicacion.categoria} />
        <h3>{publicacion.titulo}</h3>
        <p>{publicacion.extracto}</p>
      </a>
      <div className="gr-publicacion-meta">
        <span>{publicacion.autorNombre}</span>
        <span>{dateLabel}</span>
      </div>
      {actions && <div className="gr-publicacion-actions">{actions}</div>}
    </Card>
  );
}
