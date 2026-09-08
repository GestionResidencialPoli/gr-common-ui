import { Skeleton } from "@gr/shared-ui";
import { content } from "@/config/content";

export default function Loading() {
  return <Skeleton label={content.auth.loading} />;
}
