const DEFAULT_BACKEND_API_URL = "http://localhost:8080";

export const env = {
  backendApiUrl: process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_API_URL,
  isCi: Boolean(process.env.CI),
};
