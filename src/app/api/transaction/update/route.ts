import { supabase } from "@/lib/supabase";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  const req = await request.json();

  if (!accessToken) return;
  const { count, error } = await supabase
    .from("transactions")
    .update({
      date: req.date,
      category: req.category,
      type: req.category === "PAY" ? "income" : "expense",
      amount: Number(req.amount.replace(",", "")),
      memo: req.memo,
    })
    .match({ id: req.id, user_id: userId })
    .select()
    .single();

  if (error || count === 0) {
    return NextResponse.json(
      { message: "데이터 수정에 실패헀습니다." },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
}
