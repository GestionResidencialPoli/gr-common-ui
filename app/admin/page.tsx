import { EmptyState } from "@gr/shared-ui";
import { content } from "@/config/content";

export const metadata = { title: "Administración" };

export default function AdminPage() {
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">{content.staffModule.eyebrow}</span>
        <h1>Administración</h1>
      </div>
      <EmptyState title={content.staffModule.title} description={content.staffModule.description} />
    </>
  );
}
