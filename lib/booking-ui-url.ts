export function bookingUiUrl(): string {
  return (
    process.env.BOOKING_UI_URL || process.env.NEXT_PUBLIC_BOOKING_UI_URL || "http://localhost:3004"
  );
}
