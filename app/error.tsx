"use client";

import { Button, EmptyState } from "@gr/shared-ui";
import { content } from "@/config/content";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone-state">
      <EmptyState title={content.error.title} description={content.error.description}>
        <Button onClick={reset}>{content.error.retry}</Button>
      </EmptyState>
    </main>
  );
}
