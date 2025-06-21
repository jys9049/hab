import { NextRequest, NextResponse } from "next/server";

export const tokenCheck = (request: NextRequest) => {
  const token =
    typeof window === "undefined"
      ? request.headers.get("Authorization")
      : request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }
};
