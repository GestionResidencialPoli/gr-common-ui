import { Skeleton } from "@gestionresidencial/shared-ui";
import { content } from "@/config/content";

export default function Loading() {
  return <Skeleton label={content.auth.loading} />;
}
