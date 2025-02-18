import { NextRequest, NextResponse } from "next/server";
``;
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  try {
    let token = (await cookies()).get("token")?.value;
    if (token == undefined && !request.url.endsWith("login")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (token == undefined && request.url.endsWith("login")) {
      return NextResponse.next();
    }

    if (token != undefined && request.url.endsWith("login")) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json({ error: "Middleware error" }, { status: 500 });
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|seed|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
