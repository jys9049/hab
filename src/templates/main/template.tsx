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
import Calendar from "@/components/Calendar";
import Forward from "@/assets/Forward.svg";
import Back from "@/assets/Back.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/utils/fetch/fetchWithAuth";
import Skeleton from "@/components/Skeleton";

import { useUserStore } from "@/lib/zustand/store/useUserStore";
import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import HistoryDetail from "@/components/HistoryDetail";

import { formatAsIsoDate } from "@/utils/date";
import { ITransactionResponseDto } from "@/services/dto/types";
import { getTransaction } from "@/services/api/client";

export default function MainTemplate() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { loginLoading } = useLoadingStore((state) => state);

  const [date, setDate] = useState(formatAsIsoDate(dayjs()));

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
      queryKey: ["transactions", user.id, date],
      queryFn: () => getTransaction(user.id, date),
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
        queryKey: ["transactions", user.id, date],
      });
    },
  });

  const handleDateChange = (type: string) => {
    if (type === "BACK") {
      setDate(formatAsIsoDate(dayjs(date).add(-1, "day")));
    } else {
      setDate(formatAsIsoDate(dayjs(date).add(1, "day")));
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
        <div className={st.dateContainer}>
          <button
            className={st.iconBtn}
            aria-label="backBtn"
            onClick={() => handleDateChange("BACK")}
          >
            <Back />
          </button>
          <div onClick={handleOpenCalendar}>
            <Typography variant="title">
              {dayjs(date).format("MM월 DD일")}
            </Typography>
          </div>
          <button
            className={st.iconBtn}
            aria-label="forwardBtn"
            onClick={() => handleDateChange("FORWARD")}
          >
            <Forward />
          </button>
        </div>

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
        date={date}
      />
      <Calendar
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
