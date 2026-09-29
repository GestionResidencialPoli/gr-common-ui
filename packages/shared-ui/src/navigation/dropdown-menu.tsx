"use client";

import type { MouseEvent, ReactNode } from "react";
import type { NavigationItem } from "../types";

// Native disclosure: keyboard navigation remains the normal navigation of links.
export function DropdownMenu({
  trigger,
  label,
  items,
  onNavigate,
}: {
  trigger: ReactNode;
  label: string;
  items: NavigationItem[];
  onNavigate?: (item: NavigationItem, event: MouseEvent<HTMLAnchorElement>) => void;
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
          <a
            key={item.id}
            href={item.href}
            onClick={onNavigate ? (event) => onNavigate(item, event) : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </details>
  );
}
