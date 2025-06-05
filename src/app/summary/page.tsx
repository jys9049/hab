import { TUserType } from "@/lib/zustand/store/useUserStore";
import {
  getAllMonthlyTransactionData,
  getMonthlySummary,
  getMonthlyTransactionSummary,
} from "@/services/api/server";
import SummaryTemplate from "@/templates/summary";
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

const SummaryPage = async () => {
  const queryClient = new QueryClient();
  const accessToken = (await cookies()).get("accessToken");
  const date = formatAsIsoDate(dayjs());

  if (!accessToken) return;
  const user = decode(accessToken.value) as TUserType;

  await queryClient.prefetchQuery({
    queryKey: ["getMonthlyTransactionSummary", user.id, date],
    queryFn: async () => await getMonthlyTransactionSummary(user.id, date),
  });

  await queryClient.prefetchQuery({
    queryKey: ["getMonthlySummary", user.id],
    queryFn: async () => await getMonthlySummary(user.id),
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["getAllMonthlyTransactionData", user.id, date],
    queryFn: async ({ pageParam }) =>
      await getAllMonthlyTransactionData(user.id, pageParam, date),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SummaryTemplate />
    </HydrationBoundary>
  );
};

export default SummaryPage;
