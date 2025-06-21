import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { tokenCheck } from "@/utils/fetch/serverTokenCheck/serverTokenCheck";

dayjs.extend(utc);

export async function GET(request: NextRequest) {
  if (!supabase) {
    NextResponse.next();
  }

  tokenCheck(request);

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    const { data, error } = await supabase.rpc("get_monthly_summary", {
      user_id: id,
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
