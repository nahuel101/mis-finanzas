import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Protege todas las rutas excepto /login y /setup: si no hay sesión,
 * redirige a /login. Si ya hay sesión y el usuario visita /login,
 * lo manda al dashboard. /setup se deja pasar siempre — la propia
 * página decide si mostrarse (solo si todavía no hay ninguna cuenta).
 */
export default async function proxy(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;
  const esLogin = pathname.startsWith("/login");
  const esSetup = pathname.startsWith("/setup");

  if (!session && !esLogin && !esSetup) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && esLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json|api/auth|api/precios).*)",
  ],
};
