import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function GET(request: NextRequest) {
  if (!supabase) {
    NextResponse.next();
  }

  const token =
    typeof window === "undefined"
      ? request.headers.get("Authorization")
      : request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const date = searchParams.get("date");

    const { data, error } = await supabase.rpc("get_daily_summary_by_month", {
      user_id: id,
      year_month: dayjs(date).utc().format("YYYY-MM"),
    });

    if (!error) {
      return NextResponse.json(
        {
          data: data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "데이터가 없습니다." },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "데이터가 없습니다." },
      { status: 400 }
    );
  }
}
