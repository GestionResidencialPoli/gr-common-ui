import { notFound } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@gr/shared-ui";
import { content } from "@/config/content";
import { modules, parkingModule } from "@/config/modules";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const selectedModule = [...modules, parkingModule].find((item) => item.id === moduleId);
  if (!selectedModule) notFound();
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
