import { server_supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const categories = ["FOOD", "BUS", "PAY", "SAVE", "ETC", "SHOPPING"];

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

    const kstStart = dayjs.tz(date, "Asia/Seoul").startOf("day");
    const kstEnd = dayjs.tz(date, "Asia/Seoul").endOf("day");

    const utcStart = kstStart.utc().toISOString();
    const utcEnd = kstEnd.utc().toISOString();

    const { data, error } = await server_supabase
      .from("transactions")
      .select("*")
      .eq("user_id", id)
      .gte("date", utcStart.toString())
      .lte("date", utcEnd.toString())
      .order("date", { ascending: false });

    const filterOfCategoryData = (
      data: any[] | null,
      category: string,
      other?: boolean
    ) => {
      if (!data) return;
      if (other) {
        return data.filter((item) => item.category !== category);
      } else {
        return data.filter((item) => item.category === category);
      }
    };

    const sumOfAmount = (data: any[] | undefined) => {
      return data?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
    };

    const income = filterOfCategoryData(data, "PAY");
    const expense = filterOfCategoryData(data, "PAY", true);

    const incomeAmount = sumOfAmount(income);
    const expenseAmount = sumOfAmount(expense);

    const categoryData: { type: string; amount: any }[] = [];
    categories.forEach((type) =>
      categoryData.push({
        type: type,
        amount: sumOfAmount(filterOfCategoryData(data, type)),
      })
    );

    if (!error) {
      return Response.json(
        {
          data: data,
          incomeAmount: incomeAmount,
          expenseAmount: expenseAmount,
          expenseLength: expense?.length ?? 0,
          categoryData: categoryData,
        },
        { status: 200 }
      );
    } else {
      return Response.json({ message: "데이터가 없습니다." }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return Response.json({ message: "데이터가 없습니다." }, { status: 400 });
  }
}
