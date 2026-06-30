import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const host = hostname.split(":")[0];
  const baseDomain = (process.env.BASE_DOMAIN ?? "localhost:3000").split(":")[0];

  let tenantSlug: string | null = null;

  if (host === "localhost" || host === "127.0.0.1") {
    tenantSlug = request.cookies.get("tenant-slug")?.value ?? "grace-community-system";
  } else if (host.endsWith(baseDomain) && host !== baseDomain) {
    tenantSlug = host.replace(`.${baseDomain}`, "");
  } else if (host !== baseDomain) {
    // Custom domain — set a header so the app can resolve it via DB lookup
    const response = NextResponse.next();
    response.headers.set("x-custom-domain", host);
    return response;
  }

  if (!tenantSlug) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("x-tenant-slug", tenantSlug);

  if (!request.cookies.get("tenant-slug")) {
    response.cookies.set("tenant-slug", tenantSlug, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|fonts|api/health).*)"],
};
