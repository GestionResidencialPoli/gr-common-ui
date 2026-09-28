export function gateUiUrl(): string {
  return process.env.NEXT_PUBLIC_GATE_UI_URL || "http://localhost:3005";
}
