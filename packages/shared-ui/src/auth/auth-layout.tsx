import type { ReactNode } from "react";

export function AuthLayout({
  brand,
  mark,
  eyebrow,
  headline,
  description,
  title,
  subtitle,
  footer,
  children,
}: {
  brand: string;
  mark: string;
  eyebrow: string;
  headline: string;
  description: string;
  title: string;
  subtitle: string;
  footer: string;
  children: ReactNode;
}) {
  return (
    <main className="gr-auth">
      <section className="gr-auth-story">
        <div className="gr-brand">
          <span className="gr-brand-mark">{mark}</span>
          <strong>{brand}</strong>
        </div>
        <div className="gr-auth-message">
          <span className="gr-eyebrow">{eyebrow}</span>
          <h1>{headline}</h1>
          <p>{description}</p>
          <div className="gr-auth-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <small>{footer}</small>
      </section>
      <section className="gr-auth-panel">
        <div className="gr-auth-form">
          <span className="gr-eyebrow">{brand}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
