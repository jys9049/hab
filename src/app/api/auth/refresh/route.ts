import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { TUserType } from "@/lib/zustand/store/useUserStore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: "refreshToken이 만료되었습니다" },
        { status: 401 }
      );
    }
    const verify = verifyRefreshToken(refreshToken) as TUserType;

    if (verify) {
      const access_token = generateAccessToken({
        id: verify.id,
        nickname: verify.nickname,
        email: verify.email,
      });

      return NextResponse.json(
        { ok: true, data: access_token.toString() },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
