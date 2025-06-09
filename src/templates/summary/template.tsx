"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import st from "./styles.module.scss";
import dayjs from "dayjs";
import {
  ICategoryDataType,
  IGetMonthlySummaryResponseDto,
  IMonthSummaryDataDto,
  ITransactionSummaryResponseDto,
} from "@/services/dto/types";

import { useUserStore } from "@/lib/zustand/store/useUserStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Typography from "@/components/Typography";

import { IParentHistoryType } from "@/components/AddHistory/types";
import CategoryIcon from "@/components/CategoryIcon";
import Skeleton from "@/components/Skeleton";
import {
  donutChartOptions,
  donutDisplayOptions,
  barChartOptions,
  barChartDisplayOptions,
} from "@/templates/summary/const";
import {
  getAllMonthlyTransactionData,
  getMonthlySummary,
  getMonthlyTransactionSummary,
} from "@/services/api/client";
import { formatAsIsoDate } from "@/utils/date";
import DateNavigator from "@/components/DateNavigator";

ChartJS.register(
  ArcElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
  Tooltip,
  Legend
);

const SummaryTemplate = () => {
  const [date, setDate] = useState(formatAsIsoDate(dayjs()));

  const id = useUserStore((state) => state.user).id;

  const [isLoading, setIsLoading] = useState(true);

  const { data: monthTransactionSummary, isLoading: summaryLoading } =
    useQuery<ITransactionSummaryResponseDto>({
      queryKey: ["getMonthlyTransactionSummary", id, date],
      queryFn: () => getMonthlyTransactionSummary(id, date),
      enabled: !!id,
    });

  const { data: monthlyData, isLoading: getMonthlySummaryLoading } =
    useQuery<IGetMonthlySummaryResponseDto>({
      queryKey: ["getMonthlySummary", id],
      queryFn: () => getMonthlySummary(id),
      enabled: !!id,
    });

  const {
    data: getAllTransactionData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["getAllMonthlyTransactionData", id, date],
    queryFn: ({ pageParam }) =>
      getAllMonthlyTransactionData(id, pageParam, date),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    enabled: !!id,
  });

  const barRecentMonths = Array.from({ length: 5 }, (_, i) =>
    dayjs(date)
      .subtract(4 - i, "month")
      .format("YYYY-MM")
  );

  const barChartData = () => {
    const barData: number[] = [];
    if (monthlyData) {
      barRecentMonths.forEach((month) => {
        const match = monthlyData?.data.find(
          (item: IMonthSummaryDataDto) =>
            dayjs(item.year_month).format("YYYY-MM") === month
        );
        const data = match ? match.expense : 0;
        barData.push(data);
      });
    }
    return barData;
  };

  const handleDateChange = (type: string) => {
    if (type === "BACK") {
      setDate(formatAsIsoDate(dayjs(date).add(-1, "month")));
    } else {
      setDate(formatAsIsoDate(dayjs(date).add(1, "month")));
    }
  };

  const labelConvert = (type: string) => {
    switch (type) {
      case "FOOD":
        return "식비";
      case "BUS":
        return "교통";
      case "PAY":
        return "월급";
      case "SAVE":
        return "저축";
      case "ETC":
        return "기타";
      case "SHOPPING":
        return "쇼핑";
    }
  };

  useEffect(() => {
    if (!summaryLoading && !getMonthlySummaryLoading) setIsLoading(false);
  }, [summaryLoading, getMonthlySummaryLoading]);

  return (
    <div className={st.container}>
      <DateNavigator date={date} handleDateChange={handleDateChange} />
      <div className={st.contentsWrap}>
        <div className={st.summaryBox}>
          <p className={st.title}>이번달 요약</p>
          <div className={st.flexWrap}>
            <p className={st.subText}>총 수입</p>
            <Skeleton loading={isLoading} width={80} height={20}>
              <Typography color="green">
                ₩ {monthTransactionSummary?.incomeAmount.toLocaleString() ?? 0}
              </Typography>
            </Skeleton>
          </div>
          <div className={st.flexWrap}>
            <p className={st.subText}>총 지출</p>
            <Skeleton loading={isLoading} width={80} height={20}>
              <Typography color="red">
                ₩ {monthTransactionSummary?.expenseAmount.toLocaleString() ?? 0}
              </Typography>
            </Skeleton>
          </div>
          <div className={`${st.flexWrap} ${st.borderTop}`}>
            <p className={st.subText}>잔액</p>
            <Skeleton loading={isLoading} width={80} height={20}>
              <Typography>
                ₩{" "}
                {(monthTransactionSummary &&
                  (
                    monthTransactionSummary?.incomeAmount -
                    monthTransactionSummary?.expenseAmount
                  ).toLocaleString()) ??
                  0}
              </Typography>
            </Skeleton>
          </div>
        </div>
        <div className={st.expenseCategoryContainer}>
          <p className={st.title}>이번달 지출 카테고리</p>
          <div className={st.expenseCategoryChart}>
            <Skeleton loading={isLoading} height={150}>
              <div className={st.chartWrap}>
                {monthTransactionSummary &&
                  monthTransactionSummary?.categoryData.length > 0 && (
                    <Doughnut
                      data={{
                        labels: monthTransactionSummary?.categoryData.map(
                          (item: ICategoryDataType) => {
                            if (item.type === "PAY") return;
                            return labelConvert(item.type);
                          }
                        ),
                        datasets: [
                          {
                            data: [
                              ...monthTransactionSummary?.categoryData.map(
                                (item: ICategoryDataType) => {
                                  if (item.type === "PAY") return;
                                  return item.amount;
                                }
                              ),
                            ],
                            ...donutChartOptions,
                          },
                        ],
                      }}
                      options={donutDisplayOptions}
                    />
                  )}
              </div>
            </Skeleton>
            <div className={st.legendContainer}>
              {monthTransactionSummary?.categoryData.map(
                (item: ICategoryDataType, idx: number) => (
                  <div key={item.type} className={st.legendLabelWrap}>
                    <div className={st.legendTitleWrap}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor:
                            donutChartOptions.backgroundColor[idx],
                        }}
                      />
                      <span>{labelConvert(item.type)}</span>
                    </div>
                    <span>₩ {item.amount.toLocaleString()}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className={st.trendGap}>
          <div>
            <p className={st.title}>최근 5개월 지출 트렌드</p>
          </div>
          <Skeleton loading={isLoading} height={150}>
            <Bar
              data={{
                labels: barRecentMonths,
                datasets: [
                  {
                    data: barChartData(),
                    ...barChartOptions,
                  },
                ],
              }}
              options={barChartDisplayOptions}
            />
          </Skeleton>
        </div>
        <div className={st.historyContainer}>
          <p className={st.title}>최근 내역</p>
          <div className={st.historyWrap}>
            <Skeleton loading={isLoading} height={20}>
              {getAllTransactionData &&
                getAllTransactionData?.pages.map(
                  (transaction: { data: IParentHistoryType[] }, idx) => (
                    <React.Fragment key={idx}>
                      {transaction &&
                        transaction?.data.map((history, idx) => (
                          <div
                            key={idx}
                            className={`${st.historyDetail} ${st.historyBottomLine}`}
                          >
                            <div className={st.historyTitleAndDate}>
                              <span>
                                {dayjs(history.date).format("MM월 DD일")}
                              </span>
                              <span>
                                <CategoryIcon variant={history.category} />
                              </span>
                            </div>
                            <span
                              className={
                                history.category !== "PAY"
                                  ? st.expense
                                  : st.income
                              }
                            >
                              ₩ {history.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                    </React.Fragment>
                  )
                )}
            </Skeleton>

            {hasNextPage && (
              <div className={st.historyBtnContainer}>
                <button
                  className={st.historyBtn}
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  더 보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTemplate;
