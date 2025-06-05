import { TUserType } from "@/lib/zustand/store/useUserStore";
import { getDailySummaryByMonth, getTransaction } from "@/services/api/server";
import CalendarTemplate from "@/templates/calendar";
import { formatAsIsoDate } from "@/utils/date";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import React from "react";

const CalendarPage = async () => {
  const queryClient = new QueryClient();
  const accessToken = (await cookies()).get("accessToken");
  const date = formatAsIsoDate(dayjs());

  if (!accessToken) return;
  const user = decode(accessToken.value) as TUserType;

  await queryClient.prefetchQuery({
    queryKey: ["getDailySummaryByMonth", user.id, date],
    queryFn: async () => await getDailySummaryByMonth(user.id, date),
  });

  await queryClient.prefetchQuery({
    queryKey: ["transactions", user.id, date],
    queryFn: async () => await getTransaction(user.id, date),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarTemplate />
    </HydrationBoundary>
  );
};

export default CalendarPage;
