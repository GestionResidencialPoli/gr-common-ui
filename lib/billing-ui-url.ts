export function billingUiUrl(): string {
  return process.env.BILLING_UI_URL || "http://localhost:3007";
}
