import { Card, HomePage, type HomeModule } from "@gr/shared-ui";
import { content } from "@/config/content";
import { modules } from "@/config/modules";
import { ModuleIcon } from "./module-icon";

export function HomeContent({ items = modules }: { items?: HomeModule[] }) {
  return (
    <HomePage {...content.home} modules={items}>
      <Card className="home-note">
        <ModuleIcon name="info" />
        <div>
          <h2>{content.note.title}</h2>
          <p>{content.note.description}</p>
        </div>
      </Card>
    </HomePage>
  );
}
