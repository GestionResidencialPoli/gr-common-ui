function read(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : fallback;
}

function flag(name: string): boolean {
  return process.env[name] === "1" || process.env[name]?.toLowerCase() === "true";
}

const e2ePort = read("E2E_PORT", "3100");

export const env = {
  // El gateway es el único origen de API expuesto al navegador.
  backendApiUrl: read("BACKEND_API_URL", "http://localhost:4000"),
  isCI: flag("CI"),
  e2e: {
    port: e2ePort,
    baseUrl: read("E2E_BASE_URL", `http://localhost:${e2ePort}`),
    email: read("E2E_USER_EMAIL", "residente.demo@gestionresidencial.test"),
    password: read("E2E_USER_PASSWORD", "Semilla#2026"),
  },
} as const;
