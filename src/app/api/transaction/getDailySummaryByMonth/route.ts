import { server_supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export async function GET(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  if (!token) {
    return Response.json("AccessToken이 만료되었습니다.", {
      status: 401,
    });
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const date = searchParams.get("date");

    const { data, error } = await server_supabase.rpc(
      "get_daily_summary_by_month",
      {
        user_id: id,
        year_month: dayjs(date).format("YYYY-MM"),
      }
    );

    if (!error) {
      return Response.json(
        {
          data: data,
        },
        { status: 200 }
      );
    } else {
      return Response.json({ message: "데이터가 없습니다." }, { status: 400 });
    }
  } catch (e) {
    console.error(e);
    return Response.json({ message: "데이터가 없습니다." }, { status: 400 });
  }
}
