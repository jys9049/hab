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

  if (!accessToken) return;
  const { error: transactionDeleteError, count: transactionDeleteCount } =
    await supabase.from("transactions").delete().eq("user_id", userId);

  const { error: userDeleteError, count: userDeleteCount } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (
    transactionDeleteError ||
    transactionDeleteCount === 0 ||
    userDeleteError ||
    userDeleteCount === 0
  ) {
    return NextResponse.json(
      { message: "회원 탈퇴에 실패헀습니다." },
      { status: 400 }
    );
  } else {
    return NextResponse.json({ message: "success" }, { status: 200 });
  }
}
