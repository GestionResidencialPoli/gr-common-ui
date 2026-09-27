export const ACCESS_TOKEN_COOKIE = "access_token";

export type SessionGuardConfig = {
  publicPaths?: readonly string[];
  publicPrefixes?: readonly string[];
  loginPath?: string;
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

export const HEADERS_TO_STRIP_ON_FORWARD = ["origin", "referer"] as const;
