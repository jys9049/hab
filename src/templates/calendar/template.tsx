"use client";

import Calendar from "@/components/Calendar";
import CategoryIcon from "@/components/CategoryIcon";
import Typography from "@/components/Typography";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";
import { useQuery } from "@tanstack/react-query";
import { ITransactionByMonth } from "@/components/Calendar/types";
import { IGetTransactionDto } from "@/services/dto/types";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import Skeleton from "@/components/Skeleton";
import { formatAsIsoDate } from "@/utils/date";
import { getDailySummaryByMonth, getTransaction } from "@/services/api/client";

const CalendarTemplate = () => {
  const [date, setDate] = useState(formatAsIsoDate(dayjs()));
  const [selectDate, setSelectDate] = useState(formatAsIsoDate(dayjs()));
  const [isLoading, setIsLoading] = useState(true);

  const user = useUserStore((state) => state.user);

  const { data: monthData, isLoading: monthLoading } = useQuery({
    queryKey: ["getDailySummaryByMonth", user.id, date],
    queryFn: () => getDailySummaryByMonth(user.id, date),
    enabled: !!user.id,
  });

  const { data: selectDayData, isLoading: selectDateLoading } =
    useQuery<IGetTransactionDto | null>({
      queryKey: ["transactions", user.id, selectDate],
      queryFn: () => getTransaction(user.id, selectDate),
      enabled: !!user.id,
    });

  const handleDateChange = (date: Date) => {
    setDate(formatAsIsoDate(dayjs(date)));
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
              setSelectDate(formatAsIsoDate(dayjs(value as Date)));
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

export default CalendarTemplate;
