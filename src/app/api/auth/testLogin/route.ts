import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      NextResponse.next();
    }

    const req = await request.json();
    const testId = req.testId;

    if (!testId)
      return NextResponse.json("테스트 아이디 로그인에 실패하였습니다..", {
        status: 401,
      });

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", testId)
      .single();

    const access_token = generateAccessToken({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    });

    const refresh_token = generateRefreshToken({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    });

    const token = new URLSearchParams();
    token.append("accessToken", access_token);
    token.append("refreshToken", refresh_token);

    const cookieStore = cookies();

    (await cookieStore).set("accessToken", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    (await cookieStore).set("refreshToken", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      { ok: true, data: token.toString() },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "로그인에 실패하였습니다" },
      { status: 500 }
    );
  }
}
