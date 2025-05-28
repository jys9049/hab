import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/oauth"]; // 인증 불필요 경로

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const baseUrl = process.env.BASE_URL;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) {
    if (pathname === "/oauth/kakao/redirect") {
      const newAccessTokenFromKakao = searchParams.get("accessToken");
      const newRefreshTokenFromKakao = searchParams.get("refreshToken");

      if (!newAccessTokenFromKakao || !newRefreshTokenFromKakao) {
        console.error(
          "[Middleware] Kakao redirect missing tokens. Redirecting to login."
        );
        return NextResponse.redirect(new URL("/login", baseUrl));
      }

      const response = NextResponse.redirect(new URL("/", baseUrl));
      response.cookies.set("accessToken", newAccessTokenFromKakao, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60,
        path: "/",
      });
      response.cookies.set("refreshToken", newRefreshTokenFromKakao, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      return response;
    }

    return NextResponse.next();
  }

  if (!accessToken) {
    if (!refreshToken) {
      console.log("refreshToken null");
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    try {
      const refreshResponse = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (!refreshResponse.ok) {
        console.error(
          `[Middleware] Failed to refresh token (status: ${refreshResponse.status}). Redirecting to login for path: ${pathname}`
        );
        const loginRedirect = NextResponse.redirect(new URL("/login", baseUrl));
        loginRedirect.cookies.delete("accessToken");
        loginRedirect.cookies.delete("refreshToken");
        return loginRedirect;
      }

      const refreshedData = await refreshResponse.json();

      const newAccessToken = refreshedData.data;

      if (newAccessToken) {
        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        });
        return response;
      } else {
        const loginRedirect = NextResponse.redirect(new URL("/login", baseUrl));
        loginRedirect.cookies.delete("refreshToken");
        return loginRedirect;
      }
    } catch (error) {
      console.error(error);
      const loginRedirect = NextResponse.redirect(new URL("/login", baseUrl));
      loginRedirect.cookies.delete("accessToken");
      loginRedirect.cookies.delete("refreshToken");
      return loginRedirect;
    }
  }

  return NextResponse.next(); // 요청 계속 진행
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
