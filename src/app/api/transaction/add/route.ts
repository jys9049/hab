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
  const req = await request.json();

  if (!accessToken) return;
  const { data } = await supabase
    .from("transactions")
    .insert({
      user_id: accessToken.id,
      date: req.date,
      category: req.category,
      type: req.category === "PAY" ? "income" : "expense",
      amount: Number(req.amount),
      memo: req.memo,
    })
    .select()
    .single();

  if (data) {
    return NextResponse.json({ message: "success" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "데이터 추가에 실패헀습니다." },
      { status: 400 }
    );
  }
}
