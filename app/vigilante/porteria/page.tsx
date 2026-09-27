import { AppRedirect } from "@/features/apps/app-redirect";
import { gateUiUrl } from "@/lib/gate-ui-url";

export const metadata = { title: "Portería" };

export default function VigilantePorteriaPage() {
  return <AppRedirect audience="vigilante" targetOrigin={gateUiUrl()} label="Abriendo portería" />;
}
