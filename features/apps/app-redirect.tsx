"use client";

import { useEffect } from "react";
import { Skeleton } from "@gestionresidencial/shared-ui";
import { initiateSsoHandoff, type SsoAudience } from "@gestionresidencial/auth-client";

export function AppRedirect({
  audience,
  targetOrigin,
  label,
}: {
  audience: SsoAudience;
  targetOrigin: string;
  label: string;
}) {
  useEffect(() => {
    initiateSsoHandoff(audience, targetOrigin).then();
  }, [audience, targetOrigin]);

  return (
    <div className="standalone-state">
      <Skeleton label={label} />
    </div>
  );
}
