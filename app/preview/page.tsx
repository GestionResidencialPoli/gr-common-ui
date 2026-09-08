import type { CSSProperties } from "react";
import { AppShell } from "@gr/shared-ui";
import { HomeContent } from "@/components/home-content";
import { content } from "@/config/content";
import { modules, navigation, parkingModule } from "@/config/modules";

export const metadata = { title: "Vista previa" };

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string }>;
}) {
  const { variant } = await searchParams;
  const alternate = variant === "four";
  const items = alternate ? [...modules, parkingModule] : modules;
  const brand = alternate
    ? {
        ...content.brand,
        name: content.preview.name,
        description: content.preview.description,
        mark: "p.",
      }
    : content.brand;
  const theme = alternate
    ? ({
        "--radius-card": "3px",
        "--radius-control": "3px",
        "--color-background": "#eeeeee",
      } as CSSProperties)
    : undefined;
  return (
    <div style={theme}>
      <AppShell
        brand={brand}
        navigation={alternate ? [...navigation, parkingModule] : navigation}
        activeId="home"
        user={{ name: content.preview.user, caption: content.preview.caption }}
        userMenuItems={[{ id: "login", label: content.auth.loginLink, href: "/login" }]}
        labels={content.shell}
        eyebrow={content.preview.title}
      >
        <div className="preview-switch">
          <span>{content.preview.label}</span>
          <a href="/preview">{content.preview.first}</a>
          <a href="/preview?variant=four">{content.preview.second}</a>
        </div>
        <HomeContent items={items} />
      </AppShell>
    </div>
  );
}
