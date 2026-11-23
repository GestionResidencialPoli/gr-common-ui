export function billingUiUrl(): string {
  return (
    process.env.BILLING_UI_URL || process.env.NEXT_PUBLIC_BILLING_UI_URL || "http://localhost:3007"
  );
}
