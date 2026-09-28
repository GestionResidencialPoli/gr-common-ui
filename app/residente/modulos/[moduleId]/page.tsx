import { notFound } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@gestionresidencial/shared-ui";
import { content } from "@/config/content";
import { modules, parkingModule } from "@/config/modules";
import { AppRedirect } from "@/features/apps/app-redirect";
import { wallUiUrl } from "@/lib/wall-ui-url";
import { bookingUiUrl } from "@/lib/booking-ui-url";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const selectedModule = [...modules, parkingModule].find((item) => item.id === moduleId);
  if (!selectedModule) notFound();
  if (moduleId === "tablero") {
    return <AppRedirect audience="residente" targetOrigin={wallUiUrl()} label="Abriendo el muro" />;
  }
  if (moduleId === "reservas") {
    return <AppRedirect audience="residente" targetOrigin={bookingUiUrl()} label="Abriendo zonas comunes" />;
  }
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">{content.module.eyebrow}</span>
        <h1>{selectedModule.label}</h1>
        <p>{selectedModule.description}</p>
      </div>
      <EmptyState title={content.module.title} description={content.module.description}>
        <Link className="gr-button gr-button--secondary" href="/residente">
          {content.module.back}
        </Link>
      </EmptyState>
    </>
  );
}
