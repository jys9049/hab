"use client";

import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";
import Add from "@/assets/AddIcon.svg";
import Close from "@/assets/Close.svg";
import Typography from "../Typography";
import CategoryIcon from "../CategoryIcon";
import More from "@/assets/ExpandMore.svg";
import CategorySelect from "../CategorySelect";
import Calendar from "../Calendar";
import CalendarIcon from "@/assets/Calendar.svg";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { IAddHistoryProps } from "./types";

const AddHistory = ({ onSubmit, date }: IAddHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [value, setValue] = useState({
    amount: "",
    category: "FOOD",
    date: date,
    time: {
      hour: "",
      minute: "",
    },
    memo: "",
  });

  const [categorySelect, setCategorySelect] = useState("FOOD");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value: inputValue } = e.target;

    if (id === "amount") {
      const rawValue = inputValue.replace(/,/g, "");
      if (rawValue !== "" && !/^\d+$/.test(rawValue)) return;
      const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setValue({ ...value, [id]: formatted });
    } else if (id === "hour" && /^\d*$/.test(inputValue)) {
      setValue({
        ...value,
        time: {
          ...value.time,
          [id]: Number(inputValue) > 23 ? "23" : inputValue,
        },
      });
    } else if (id === "minute" && /^\d*$/.test(inputValue)) {
      setValue({
        ...value,
        time: {
          ...value.time,
          [id]: Number(inputValue) > 23 ? "59" : inputValue,
        },
      });
    } else {
      setValue({ ...value, [id]: inputValue });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleCategoryClose();
    setValue({
      amount: "",
      category: "FOOD",
      date: date,
      time: {
        hour: "",
        minute: "",
      },
      memo: "",
    });
  };

  const handleCategoryOpen = () => {
    setCategoryOpen(true);
  };

  const handleCalendarClose = () => {
    setCalendarOpen(false);
  };
  const handleCalendarOpen = () => {
    setCalendarOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    setCategorySelect(category);
    setValue({ ...value, category: category });
    setCategoryOpen(false);
  };

  const handleSubmit = async () => {
    if (!value.amount)
      return toast("금액을 입력해주세요.", { type: "error", autoClose: 500 });

    const updateDate = dayjs(value.date)
      .hour(value.time.hour ? Number(value.time.hour) : dayjs(date).hour())
      .minute(
        value.time.minute ? Number(value.time.minute) : dayjs(date).minute()
      );

    const updateValue = {
      ...value,
      amount: value.amount.replaceAll(",", ""),
      date: updateDate,
    };

    onSubmit(updateValue);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        <>
          <div className={st.background} onClick={handleClose}></div>
          <div className={`${st.container} ${st.slideTop}`}>
            <div className={st.header}>
              <Typography variant="title">내역 추가</Typography>
              <button className={st.closeBtn} onClick={handleClose}>
                <Close />
              </button>
            </div>
            <div className={st.contentContainer}>
              <div className={st.contentWrap}>
                <Typography>금액</Typography>
                <div
                  className={`${st.amountInputContainer} ${st.inputContainer}`}
                >
                  <input
                    id="amount"
                    className={st.amountInput}
                    placeholder="0"
                    value={value.amount}
                    onChange={handleValueChange}
                  />
                  <span className={st.amountTitle}>₩</span>
                </div>
              </div>
              <div className={st.contentWrap}>
                <Typography>카테고리</Typography>
                <div
                  className={`${st.inputContainer} ${st.categorySelect} ${
                    categoryOpen && st.categoryOpen
                  }`}
                  onClick={handleCategoryOpen}
                >
                  <CategoryIcon
                    variant={categorySelect}
                    color="black"
                    size="BIG"
                  />
                  <More />
                  <>
                    <CategorySelect
                      isOpen={categoryOpen}
                      handleClick={handleCategorySelect}
                      handleClose={handleCategoryClose}
                    />
                  </>
                </div>
              </div>
              <div className={st.contentWrap}>
                <Typography>날짜 및 시간</Typography>
                <div className={st.dateContainer}>
                  <div
                    className={`${st.inputContainer} ${st.dateWrap}`}
                    onClick={handleCalendarOpen}
                  >
                    <Typography>
                      {dayjs(value.date).format("YYYY년 MM월 DD일")}
                    </Typography>
                    <CalendarIcon />
                  </div>
                  <div className={st.timeWrap}>
                    <input
                      id="hour"
                      type="number"
                      placeholder="00"
                      inputMode="numeric"
                      value={value.time.hour}
                      onChange={handleValueChange}
                    />
                    :
                    <input
                      id="minute"
                      type="number"
                      placeholder="00"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={value.time.minute}
                      onChange={handleValueChange}
                    />
                  </div>
                </div>
              </div>
              <div className={st.contentWrap}>
                <Typography>메모</Typography>
                <input
                  id="memo"
                  className={st.inputContainer}
                  value={value.memo}
                  onChange={handleValueChange}
                />
              </div>
            </div>
            <button className={st.addBtn} onClick={handleSubmit}>
              <Typography color="white">추가하기</Typography>
            </button>
          </div>
          <Calendar
            isOpen={calendarOpen}
            handleClose={handleCalendarClose}
            value={dayjs(value.date).toDate()}
            handleChange={(date) => setValue({ ...value, date: date as Date })}
          />
        </>
      ) : (
        <button className={st.addIcon} onClick={handleOpen}>
          <Add />
        </button>
      )}
    </>
  );
};

export default AddHistory;
