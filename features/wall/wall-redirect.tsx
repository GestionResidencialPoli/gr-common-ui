"use client";

import { useEffect } from "react";
import { Skeleton } from "@gestionresidencial/shared-ui";
import { initiateSsoHandoff, type SsoAudience } from "@gestionresidencial/auth-client";
import { wallUiUrl } from "@/lib/wall-ui-url";

export function WallRedirect({ audience }: { audience: SsoAudience }) {
  useEffect(() => {
    initiateSsoHandoff(audience, wallUiUrl()).then();
  }, [audience]);

  return (
    <div className="standalone-state">
      <Skeleton label="Abriendo el muro" />
    </div>
  );
}
