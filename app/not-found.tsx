import { EmptyState } from "@gr/shared-ui";
import Link from "next/link";
import { content } from "@/config/content";

export default function NotFound() {
  return (
    <main className="standalone-state">
      <EmptyState title={content.error.notFound} description={content.error.notFoundDescription}>
        <Link className="gr-button gr-button--secondary" href="/">
          {content.module.back}
        </Link>
      </EmptyState>
    </main>
  );
}
