import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

const categories = ["FOOD", "BUS", "PAY", "SAVE", "ETC", "SHOPPING"];

export async function GET(request: NextRequest) {
  if (!supabase) {
    NextResponse.next();
  }

  const token = request.cookies.get("accessToken");
  if (!token) {
    return NextResponse.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const date = searchParams.get("date"); // YYYY-MM-DD

  const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", id)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  if (error) {
    return NextResponse.json({ message: "불러오기 실패" }, { status: 400 });
  }

  const income = data.filter((item) => item.category === "PAY");
  const expense = data.filter((item) => item.category !== "PAY");

  const sum = (arr: typeof data) =>
    arr.reduce((acc, cur) => acc + cur.amount, 0);

  const categoryData = categories.map((type) => ({
    type,
    amount: sum(data.filter((item) => item.category === type)),
  }));

  return NextResponse.json({
    incomeAmount: sum(income),
    expenseAmount: sum(expense),
    expenseLength: expense.length,
    categoryData,
  });
}
