"use client";

import { useId, useState } from "react";
import { Button, TextField } from "./primitives";

export function PasswordField({
  name = "password",
  autoComplete = "current-password",
  label,
  showLabel,
  hideLabel,
  disabled,
}: {
  name?: string;
  autoComplete?: string;
  label: string;
  showLabel: string;
  hideLabel: string;
  disabled?: boolean;
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
        maxLength={256}
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
