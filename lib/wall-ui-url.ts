export function wallUiUrl(): string {
  return process.env.NEXT_PUBLIC_WALL_UI_URL || "http://localhost:3003";
}
