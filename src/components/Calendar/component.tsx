"use client";

import React, { useEffect, useState } from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.scss";
import dayjs from "dayjs";
import { ICalendarProps, ITransactionByMonth } from "./types";
import DateNavigator from "../DateNavigator";

const Calendar = ({
  historyData,
  value,
  handleClose,
  handleChange,
  handleMonthChange,
}: ICalendarProps) => {
  const [isRendering, setIsRendering] = useState(false);
  const [history, setHistory] = useState<ITransactionByMonth[]>(
    historyData || []
  );

  useEffect(() => {
    if (historyData) setHistory(historyData);
  }, [historyData]);

  useEffect(() => {
    setIsRendering(true);
  }, []);

  return (
    isRendering && (
      <div className="dateNavContainer">
        <DateNavigator date={value} handleDateChange={handleMonthChange} />
        <ReactCalendar
          tileContent={({ date, view }) => {
            if (view !== "month") return null;

            const filtered = history.filter((item) =>
              dayjs(item.date).isSame(date, "day")
            )[0];

            if (!filtered) return;

            return (
              <div className="amountContainer">
                {filtered.income > 0 && (
                  <div style={{ color: "green" }}>
                    {filtered.income.toLocaleString()}
                  </div>
                )}
                {filtered.expense > 0 && (
                  <div style={{ color: "red" }}>
                    {filtered.expense.toLocaleString()}
                  </div>
                )}
              </div>
            );
          }}
          className={"positionUp"}
          calendarType="gregory"
          onChange={handleChange}
          value={value}
          showNavigation={false}
          nextLabel={null}
          prevLabel={null}
          next2Label={null}
          prev2Label={null}
          formatDay={(locale, date) => dayjs(date).format("D")}
          onClickDay={handleClose}
        />
      </div>
    )
  );
};

export default Calendar;
