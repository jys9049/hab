"use client";

import Typography from "@/components/Typography";
import st from "./style.module.scss";
import Card from "@/components/Card";
import CategoryIcon from "@/components/CategoryIcon";
import AddHistory from "@/components/AddHistory";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  IHistoryType,
  IParentHistoryType,
} from "@/components/AddHistory/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import Skeleton from "@/components/Skeleton";

import { useUserStore } from "@/lib/zustand/store/useUserStore";
import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import HistoryDetail from "@/components/HistoryDetail";

import { formatAsDateTime, formatAsIsoDate } from "@/utils/date";
import { ITransactionResponseDto } from "@/services/dto/types";
import { getTransaction } from "@/services/api/client";
import DateNavigator from "@/components/DateNavigator";
import { useSearchParams } from "next/navigation";
import CalendarModal from "@/components/CalendarModal";

export default function MainTemplate() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const dateParam = useSearchParams().get("date");
  const { loginLoading } = useLoadingStore((state) => state);

  const [date, setDate] = useState(formatAsDateTime(dayjs()));

  useEffect(() => {
    if (dateParam) {
      setDate(
        formatAsDateTime(
          dayjs(dateParam)
            .set("hour", dayjs().hour())
            .set("minute", dayjs().minute())
        )
      );
    }
  }, [dateParam]);

  const [isCalendarOpen, setIsOpenCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectHistory, setSelectHistory] = useState<IParentHistoryType | null>(
    null
  );
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(false);

  const handleSelectClick = (history: IParentHistoryType) => {
    setSelectHistory(history);
  };

  const handleHistoryDetailOpen = () => {
    setIsHistoryDetailOpen(true);
  };

  const handleHistoryDetailClose = () => {
    setSelectHistory(null);
    setIsHistoryDetailOpen(false);
  };

  const { data: transactionData, isLoading: transactionLoading } =
    useQuery<ITransactionResponseDto>({
      queryKey: ["transactions", user.id, dayjs(date).format("YYYY-MM-DD")],
      queryFn: () => getTransaction(user.id, dayjs(date).format("YYYY-MM-DD")),
      enabled: !!user.id,
    });

  const addTransactionMutation = useMutation({
    mutationFn: (data: IHistoryType) => {
      return fetchWithAuth("/api/transaction/add", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", user.id, dayjs(date).format("YYYY-MM-DD")],
      });
    },
  });

  const handleDateChange = (type: string) => {
    if (type === "BACK") {
      setDate(formatAsDateTime(dayjs(date).add(-1, "day")));
    } else {
      setDate(formatAsDateTime(dayjs(date).add(1, "day")));
    }
  };

  const handleOpenCalendar = () => {
    setIsOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setIsOpenCalendar(false);
  };

  useEffect(() => {
    if (!transactionLoading && !loginLoading) setIsLoading(false);
  }, [transactionLoading, loginLoading]);

  return (
    <>
      <div className={st.container}>
        <DateNavigator
          date={date}
          handleOpenCalendar={handleOpenCalendar}
          handleDateChange={handleDateChange}
          dateFormat="MM월 DD일"
        />
        {!isLoading && transactionData && transactionData.expenseLength > 0 && (
          <div className={st.alarmContainer}>
            <Typography>
              💰 {transactionData?.expenseLength}건의 지출이 있었어요. 총
              <Typography as="span" color="red">
                {" "}
                {transactionData?.expenseAmount.toLocaleString()}
              </Typography>{" "}
              사용!
            </Typography>
          </div>
        )}
        <Card>
          <div>
            <div className={st.summaryBox}>
              <Typography variant="title">요약</Typography>
              <div className={st.flexWrap}>
                <Typography>수입</Typography>
                <Skeleton loading={isLoading} width={80} height={20}>
                  <Typography color="green">
                    ₩ {transactionData?.incomeAmount.toLocaleString()}
                  </Typography>
                </Skeleton>
              </div>
              <div className={st.flexWrap}>
                <Typography>지출</Typography>
                <Skeleton loading={isLoading} width={80} height={20}>
                  <Typography color="red">
                    ₩ {transactionData?.expenseAmount.toLocaleString()}
                  </Typography>
                </Skeleton>
              </div>
              <div className={`${st.flexWrap} ${st.borderTop}`}>
                <Typography> 잔액</Typography>
                <Skeleton loading={isLoading} width={80} height={20}>
                  <Typography>
                    ₩{" "}
                    {transactionData &&
                      (
                        transactionData.incomeAmount -
                        transactionData.expenseAmount
                      ).toLocaleString()}
                  </Typography>
                </Skeleton>
              </div>
              <div className={st.crossLine}></div>
              <div className={st.historyContainer}>
                <Typography variant="title">내역</Typography>
                <Skeleton loading={isLoading} height={20}>
                  <div className={st.historyWrap}>
                    {transactionData &&
                      transactionData.data.map((history, idx) => (
                        <div
                          key={idx}
                          className={`${st.historyDetail} ${
                            idx !== 0 && st.historyTopLine
                          }`}
                          onClick={() => {
                            handleSelectClick(history);
                            handleHistoryDetailOpen();
                          }}
                        >
                          <div className={st.historyTitleAndDate}>
                            <span>{dayjs(history.date).format("HH:mm")}</span>
                            <span>
                              <CategoryIcon variant={history.category} />
                            </span>
                          </div>
                          <Typography
                            variant="small"
                            color={history.category === "PAY" ? "green" : "red"}
                          >
                            ₩ {Number(history.amount).toLocaleString()}
                          </Typography>
                        </div>
                      ))}
                  </div>
                </Skeleton>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <AddHistory onSubmit={addTransactionMutation.mutate} date={date} />
      <HistoryDetail
        isOpen={isHistoryDetailOpen}
        handleClose={handleHistoryDetailClose}
        history={selectHistory}
        date={formatAsIsoDate(dayjs(date))}
      />
      <CalendarModal
        isOpen={isCalendarOpen}
        value={date}
        handleClose={handleCloseCalendar}
        handleChange={(date) => {
          setDate(formatAsIsoDate(dayjs(date as Date)));
        }}
      />
    </>
  );
}
