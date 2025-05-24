import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

export interface IKakaoTokenResponseType {
  refreshExpiresIn: number | undefined;
  access_token: string;
  token_type: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const code = req.code;

    const client_id = process.env.KAKAO_CLIENT_ID;
    const redirect_uri = process.env.KAKAO_REDIRECT_URI;
    const secret_key = process.env.KAKAO_SECRET_KEY;

    if (!client_id || !redirect_uri || !secret_key) {
      return NextResponse.json("유저 정보를 불러오는데 실패했습니다.", {
        status: 401,
      });
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", client_id);
    params.append("redirect_uri", redirect_uri);
    params.append("code", code);
    params.append("client_secret", secret_key);

    const kakaoTokenResponse = await fetch(
      "https://kauth.kakao.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: params,
      }
    );

    if (!kakaoTokenResponse.ok) {
      const errorData = await kakaoTokenResponse.json();
      throw new Error(errorData.error_description || "Failed to fetch token");
    }

    const data: IKakaoTokenResponseType = await kakaoTokenResponse.json();

    const kakaoUserInfoResponse = await fetch(
      "https://kapi.kakao.com/v2/user/me",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const data2 = await kakaoUserInfoResponse.json();
    const { id, kakao_account } = data2;

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("kakao_id", id)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({
          kakao_id: id,
          email: kakao_account.email ?? null,
          nickname: kakao_account.profile.nickname ?? "이름 없음",
          profile_img: kakao_account.profile.profile_image_url ?? null,
        })
        .select()
        .single();

      user = newUser;
    }

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
