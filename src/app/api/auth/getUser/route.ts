import { supabase } from "@/lib/supabase";
import { TUserType } from "@/lib/zustand/store/useUserStore";
import { decode } from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken");

    if (!token) {
      return Response.json("AccessToken이 만료되었습니다.", {
        status: 401,
      });
    }

    const userInfo = decode(token.value) as TUserType;
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

    return Response.json({ data: resData }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "로그인에 실패하였습니다" },
      { status: 500 }
    );
  }
}
