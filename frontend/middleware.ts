import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const host = hostname.split(":")[0];
  const baseDomain = (process.env.BASE_DOMAIN ?? "localhost:3000").split(":")[0];

  let tenantSlug: string | null = null;

  const parts = host.split(".");

  if (parts.length === 2 && parts[1] === "localhost") {
    // grace-community-system.localhost — Chrome/Edge resolve *.localhost natively
    if (parts[0] && parts[0] !== "www") tenantSlug = parts[0];
  } else if (host === "localhost" || host === "127.0.0.1") {
    // Plain localhost — dev convenience, no subdomain in URL
    tenantSlug = request.cookies.get("tenant-slug")?.value ?? "grace-community-system";
  } else if (host !== baseDomain && host.endsWith(`.${baseDomain}`)) {
    tenantSlug = host.slice(0, host.length - baseDomain.length - 1);
  } else if (host !== baseDomain) {
    // Custom domain — let the app resolve it via DB lookup
    const response = NextResponse.next();
    response.headers.set("x-custom-domain", host);
    return response;
  }

  if (!tenantSlug) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-slug", tenantSlug);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-tenant-slug", tenantSlug);

  if (!request.cookies.get("tenant-slug")) {
    response.cookies.set("tenant-slug", tenantSlug, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|fonts|api/health).*)"],
};
