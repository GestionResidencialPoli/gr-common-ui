import { EmptyState } from "@gr/shared-ui";
import { content } from "@/config/content";

export const metadata = { title: "Portería" };

export default function VigilantePage() {
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">{content.staffModule.eyebrow}</span>
        <h1>Portería</h1>
      </div>
      <EmptyState title={content.staffModule.title} description={content.staffModule.description} />
    </>
  );
}
