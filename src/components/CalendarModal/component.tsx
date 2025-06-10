"use client";

import React, { useEffect, useState } from "react";
import { Calendar as ReactCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // css import
import "./styles.scss";
import dayjs from "dayjs";
import Typography from "../Typography";
import Close from "@/assets/Close.svg";
import { ICalendarProps } from "./types";

const CalendarModal = ({
  isOpen,
  value,
  handleClose,
  handleChange,
}: ICalendarProps) => {
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    setIsRendering(true);
  }, []);

  return (
    isRendering &&
    isOpen && (
      <>
        <div className="calendar-background" onClick={handleClose}></div>
        <div className="calendar-container slideTop">
          <div className="calendar-title-container">
            <Typography variant="title">날짜 선택</Typography>
            <button className="calendar-close-btn" onClick={handleClose}>
              <Close />
            </button>
          </div>
          <ReactCalendar
            calendarType="gregory"
            onChange={handleChange}
            value={value}
            next2Label={null}
            prev2Label={null}
            formatDay={(locale, date) => dayjs(date).format("D")}
            onClickDay={handleClose}
          />
        </div>
      </>
    )
  );
};

export default CalendarModal;
