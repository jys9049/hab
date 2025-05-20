import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    const reissuedToken = await fetch(
      `${process.env.BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          cookie: `refreshToken=${refreshToken}`,
        },
      }
    )
      .then(async (res) => {
        const data = await res.json();
        return data.data;
      })
      .catch((error) => {
        console.error("error", error);
        return NextResponse.redirect(`${process.env.BASE_URL}/login`);
      });

    accessToken = reissuedToken as string;

    const response = NextResponse.next();
    response.cookies.set({
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      name: "accessToken",
      value: accessToken,
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  }

  if (request.nextUrl.pathname === "/oauth/kakao/redirect") {
    const searchParams = request.nextUrl.searchParams;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) return NextResponse.next();
    else if (!accessToken && refreshToken) {
      await fetch("/api/auth/refresh")
        .then(async (res) => {
          const data = await res.json();
          return data;
        })
        .catch((error) => {
          console.error(error);
          return NextResponse.redirect("/login");
        });
    }

    const response = NextResponse.next();
    response.cookies.set({
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      name: "accessToken",
      value: accessToken,
      maxAge: 15 * 60,
      path: "/",
    });

    response.cookies.set({
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      name: "refreshToken",
      value: refreshToken,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } else {
    NextResponse.next();
  }
}

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
