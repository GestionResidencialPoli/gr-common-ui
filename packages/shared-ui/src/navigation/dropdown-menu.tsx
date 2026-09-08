"use client";

import type { ReactNode } from "react";
import type { NavigationItem } from "../types";

// Native disclosure: keyboard navigation remains the normal navigation of links.
export function DropdownMenu({
  trigger,
  label,
  items,
}: {
  trigger: ReactNode;
  label: string;
  items: NavigationItem[];
}) {
  return (
    <details
      className="gr-dropdown"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.open = false;
          event.currentTarget.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={label}>{trigger}</summary>
      <div className="gr-dropdown-panel">
        {items.map((item) => (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </details>
  );
}
