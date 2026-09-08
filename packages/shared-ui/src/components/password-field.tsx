"use client";

import { useId, useState } from "react";
import { Button, TextField } from "./primitives";

export function PasswordField({
  label,
  showLabel,
  hideLabel,
  disabled,
}: {
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
        name="password"
        label={label}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
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
