import React from "react";
import Forward from "@/assets/Forward.svg";
import Back from "@/assets/Back.svg";
import st from "./style.module.scss";
import Typography from "@/components/Typography";
import dayjs from "dayjs";
const DateNavigator = ({
  date,
  dateFormat,
  handleDateChange,
  handleOpenCalendar,
}: {
  date: string;
  dateFormat?: string;
  handleDateChange?: (type: string) => void;
  handleOpenCalendar?: () => void;
}) => {
  return (
    <div className={st.dateContainer}>
      <button
        className={st.iconBtn}
        onClick={() => handleDateChange && handleDateChange("BACK")}
      >
        <Back aria-label="prevMonth" />
      </button>
      <div
        className={st.date}
        onClick={handleOpenCalendar && handleOpenCalendar}
      >
        <Typography variant="title">
          {dayjs(date).format(dateFormat ? dateFormat : "YYYY년 MM월")}
        </Typography>
      </div>
      <button
        className={st.iconBtn}
        onClick={() => handleDateChange && handleDateChange("FRONT")}
      >
        <Forward aria-label="forwardMonth" />
      </button>
    </div>
  );
};

export default DateNavigator;
