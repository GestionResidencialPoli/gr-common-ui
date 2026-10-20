export function bookingUiUrl(): string {
  return process.env.BOOKING_UI_URL || "http://localhost:3004";
}
