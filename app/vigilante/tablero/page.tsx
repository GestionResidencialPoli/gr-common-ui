import { AppRedirect } from "@/features/apps/app-redirect";
import { wallUiUrl } from "@/lib/wall-ui-url";

export const metadata = { title: "Tablero" };

export default function VigilanteTableroPage() {
  return <AppRedirect audience="vigilante" targetOrigin={wallUiUrl()} label="Abriendo el muro" />;
}
