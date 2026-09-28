"use client";

import { useId, useState } from "react";
import { Button, TextField } from "./primitives";

export const PASSWORD_POLICY_PATTERN = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,72}";

export function PasswordField({
  name = "password",
  autoComplete = "current-password",
  label,
  showLabel,
  hideLabel,
  disabled,
  policy = false,
  hint,
}: {
  name?: string;
  autoComplete?: string;
  label: string;
  showLabel: string;
  hideLabel: string;
  disabled?: boolean;
  policy?: boolean;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className="gr-password">
      <TextField
        id={id}
        name={name}
        label={label}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={policy ? 8 : undefined}
        maxLength={72}
        pattern={policy ? PASSWORD_POLICY_PATTERN : undefined}
        title={policy ? hint : undefined}
        hint={hint}
        disabled={disabled}
      />
      <Button
        variant="ghost"
        aria-controls={id}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible(!visible)}
      >
        {visible ? hideLabel : showLabel}
      </Button>
    </div>
  );
}
