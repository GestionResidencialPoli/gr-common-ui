import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button type={type} className={`gr-button gr-button--${variant} ${className}`} {...props} />
  );
}

export function TextField({
  label,
  hint,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}) {
  const description = error || hint;
  return (
    <div className="gr-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={description ? `${id}-description` : undefined}
        {...props}
      />
      {description && <small id={`${id}-description`}>{description}</small>}
    </div>
  );
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`gr-card ${className}`} {...props} />;
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return (
    <span className="gr-avatar" aria-hidden="true">
      {initials}
    </span>
  );
}

export function Feedback({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div className="gr-feedback" role={error ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Card className="gr-empty">
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </Card>
  );
}

export function Skeleton({ label }: { label: string }) {
  return (
    <div className="gr-skeleton" role="status" aria-label={label}>
      <span className="gr-sr-only">{label}</span>
    </div>
  );
}
