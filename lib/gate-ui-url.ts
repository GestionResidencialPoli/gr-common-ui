export function gateUiUrl(): string {
  return process.env.GATE_UI_URL || "http://localhost:3005";
}
