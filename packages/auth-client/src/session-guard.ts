/**
 * Decision de acceso para el borde de la aplicacion, sin depender de Next.js.
 *
 * La funcion es pura: recibe la ruta y si hay cookie de sesion, y devuelve que
 * hacer. Cada frontend traduce la decision a la respuesta de su framework. Asi
 * el guard se prueba sin levantar un servidor y sirve al login y a las cuatro
 * aplicaciones de rol, que no comparten las mismas rutas publicas.
 */

export const ACCESS_TOKEN_COOKIE = "access_token";

export type SessionGuardConfig = {
  /** Rutas exactas accesibles sin sesion. */
  publicPaths?: readonly string[];
  /** Prefijos accesibles sin sesion. */
  publicPrefixes?: readonly string[];
  /** Destino cuando falta la sesion. */
  loginPath?: string;
  /** Prefijo que se reenvia al backend en lugar de evaluarse como pagina. */
  apiPrefix?: string;
};

export type SessionGuardDecision =
  { type: "forward-to-backend" } | { type: "allow" } | { type: "redirect"; to: string };

const DEFAULTS = {
  publicPaths: ["/login"] as readonly string[],
  publicPrefixes: [] as readonly string[],
  loginPath: "/login",
  apiPrefix: "/api/",
};

export function isPublicPath(pathname: string, config: SessionGuardConfig = {}): boolean {
  const paths = config.publicPaths ?? DEFAULTS.publicPaths;
  const prefixes = config.publicPrefixes ?? DEFAULTS.publicPrefixes;
  return paths.includes(pathname) || prefixes.some((prefix) => pathname.startsWith(prefix));
}

export function decideSessionAccess(
  pathname: string,
  hasSession: boolean,
  config: SessionGuardConfig = {},
): SessionGuardDecision {
  const apiPrefix = config.apiPrefix ?? DEFAULTS.apiPrefix;
  if (pathname.startsWith(apiPrefix)) return { type: "forward-to-backend" };

  if (isPublicPath(pathname, config)) return { type: "allow" };

  if (!hasSession) return { type: "redirect", to: config.loginPath ?? DEFAULTS.loginPath };

  return { type: "allow" };
}

/**
 * Cabeceras que deben eliminarse al reenviar al backend. Son las del propio
 * origen de la pagina; si llegan a Spring, evalua CORS sobre una llamada
 * servidor a servidor y responde 403 a las mutaciones.
 */
export const HEADERS_TO_STRIP_ON_FORWARD = ["origin", "referer"] as const;
