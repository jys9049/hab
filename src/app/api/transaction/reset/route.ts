import { supabase } from "@/lib/supabase";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  if (!supabase) {
    NextResponse.next();
  }

  const token = request.cookies.get("accessToken");
  if (!token) {
    return NextResponse.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }

  const accessToken = decode(token.value) as JwtPayload;

  const userId = accessToken.id;
  const transactionId = request.nextUrl.searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json("유효하지 않은 Transaction ID입니다.");
  }

  if (!accessToken && !userId) return;
  const { error, count } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", userId);

  if (error || count === 0) {
    return NextResponse.json(
      { message: "데이터 삭제 중 에러가 발생헀습니다." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "데이터가 성공적으로 삭제되었습니다." },
    { status: 200 }
  );
}
