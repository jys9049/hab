import { supabase } from "@/lib/supabase";
import { TUserType } from "@/lib/zustand/store/useUserStore";
import { decode } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      NextResponse.next();
    }

    const token =
      typeof window === "undefined"
        ? req.headers.get("Authorization")?.replace("Bearer", "").trim()
        : req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json("AccessToken이 만료되었습니다.", {
        status: 401,
      });
    }

    const userInfo = decode(token) as TUserType;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userInfo.id)
      .single();

    if (error) {
      throw new Error("DB 정보를 불러오는데 실패하였습니다.");
    }

    const resData = {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      profile_img: data.profile_img,
    };

    return NextResponse.json({ data: resData }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "로그인에 실패하였습니다" },
      { status: 500 }
    );
  }
}
