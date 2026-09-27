import { WallRedirect } from "@/features/wall/wall-redirect";

export const metadata = { title: "Tablero" };

export default function VigilanteTableroPage() {
  return <WallRedirect audience="vigilante" />;
}
