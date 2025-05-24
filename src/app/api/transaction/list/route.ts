import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  if (!token) {
    return Response.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const date = searchParams.get("date");

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const startDate = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs(date).endOf("month").format("YYYY-MM-DD");

  const { data, error, count } = await supabase
    .from("transactions")
    .select("*", { count: "exact" }) // count 포함
    .eq("user_id", id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    return Response.json({ message: "불러오기 실패" }, { status: 400 });
  }

  return Response.json({
    data,
    page,
    hasMore: to + 1 < (count ?? 0),
  });
}
