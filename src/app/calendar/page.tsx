"use client";

import Calendar from "@/components/Calendar";
import CategoryIcon from "@/components/CategoryIcon";
import Typography from "@/components/Typography";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import { ITransactionByMonth } from "@/components/Calendar/types";
import { IGetTransactionDto } from "@/services/dto/types";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import Skeleton from "@/components/Skeleton";

const CalendarPage = () => {
  const today = dayjs().toDate();
  const [date, setDate] = useState(today);
  const [selectDate, setSelectDate] = useState(today);
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useUserStore((state) => state.user);

  const { data: monthData, isLoading: monthLoading } = useQuery({
    queryKey: ["monthTransaction", userInfo.id, date],
    queryFn: async () => {
      const res = await fetchWithAuth(
        `/api/transaction/getDailySummaryByMonth?id=${userInfo.id}&date=${date}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      return data;
    },
    enabled: !!userInfo.id,
  });

  const { data: selectDayData, isLoading: selectDateLoading } =
    useQuery<IGetTransactionDto | null>({
      queryKey: ["transactions", userInfo.id, selectDate],
      queryFn: async () => {
        const res = await fetchWithAuth(
          `/api/transaction?id=${userInfo.id}&date=${selectDate}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        return data;
      },
      enabled: !!userInfo.id,
    });

  const handleDateChange = (date: Date) => {
    setDate(dayjs(date).toDate());
  };

  useEffect(() => {
    if (!monthLoading && !selectDateLoading) setIsLoading(false);
  }, [monthLoading, selectDateLoading]);

  return (
    <div className={st.container}>
      <div className={st.calendarContainer}>
        <Skeleton loading={isLoading} height={300}>
          <Calendar
            historyData={monthData && (monthData.data as ITransactionByMonth[])}
            isOpen={true}
            value={date}
            disabledModalStyle={true}
            handleClose={() => {}}
            handleMonthChange={handleDateChange}
            handleChange={(value) => {
              setSelectDate(dayjs(value as Date).toDate());
            }}
          />
        </Skeleton>
      </div>
      <div className={st.historyContainer}>
        <Typography variant="title">
          {dayjs(selectDate).format("MM월 DD일")} 내역
        </Typography>
        <div className={st.summaryContainer}>
          <div className={st.flexSpaceBetween}>
            <Typography variant="subTitle">수입</Typography>
            <Skeleton
              loading={isLoading || selectDateLoading}
              width={80}
              height={20}
            >
              <Typography color="green">
                ₩ {selectDayData?.incomeAmount.toLocaleString() ?? 0}
              </Typography>
            </Skeleton>
          </div>
          <div className={st.flexSpaceBetween}>
            <Typography variant="subTitle">지출</Typography>
            <Skeleton
              loading={isLoading || selectDateLoading}
              width={80}
              height={20}
            >
              <Typography color="red">
                ₩ {selectDayData?.expenseAmount.toLocaleString() ?? 0}
              </Typography>
            </Skeleton>
          </div>
        </div>
        <div className={st.categoryHistoryContainer}>
          <Typography variant="subTitle">카테고리별 내역</Typography>
          <div className={st.categoryHistoryWrap}>
            <Skeleton loading={isLoading || selectDateLoading} height={20}>
              {selectDayData &&
                selectDayData.categoryData.map((item: any) => {
                  return item.amount !== 0 ? (
                    <div key={item.type} className={st.flexSpaceBetween}>
                      <CategoryIcon variant={item.type} color="black" />
                      <Typography color={item.type === "PAY" ? "green" : "red"}>
                        {item.amount.toLocaleString()}
                      </Typography>
                    </div>
                  ) : null;
                })}
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
