export function billingUiUrl(): string {
  return process.env.NEXT_PUBLIC_BILLING_UI_URL || "http://localhost:3007";
}
