import { HomeContent } from "@/components/home-content";
import { content } from "@/config/content";
import { vigilanteModules } from "@/config/modules";

export const metadata = { title: "Portería" };

export default function VigilantePage() {
  return <HomeContent items={vigilanteModules} homeContent={content.staffHome} />;
}
