import type { ReactNode } from "react";
import type { HomeModule } from "../types";

export function HomePage({
  eyebrow,
  title,
  description,
  sectionTitle,
  sectionDescription,
  modules,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sectionTitle: string;
  sectionDescription: string;
  modules: HomeModule[];
  children?: ReactNode;
}) {
  return (
    <div className="gr-home">
      <section className="gr-welcome">
        <div>
          <span className="gr-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="gr-building" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </section>
      <section>
        <div className="gr-section-heading">
          <div>
            <h2>{sectionTitle}</h2>
            <p>{sectionDescription}</p>
          </div>
          <span className="gr-count">{String(modules.length).padStart(2, "0")}</span>
        </div>
        <div className="gr-module-grid">
          {modules.map((module, index) => (
            <a className="gr-module" href={module.href} key={module.id}>
              <div className="gr-module-top">
                <span className="gr-module-icon">{module.icon}</span>
                <span className="gr-module-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{module.label}</h3>
              <p>{module.description}</p>
              <span className="gr-module-action">
                {module.actionLabel}
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
      </section>
      {children}
    </div>
  );
}
