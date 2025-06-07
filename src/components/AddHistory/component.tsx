"use client";

import React, { useEffect, useState } from "react";
import st from "./styles.module.scss";
import Add from "@/assets/AddIcon.svg";
import Close from "@/assets/Close.svg";
import Typography from "@/components/Typography";
import CategorySelect from "@/components/CategorySelect";
import Modal from "@/components/Modal";
import Calendar from "@/components/Calendar";
import CalendarIcon from "@/assets/Calendar.svg";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { IAddHistoryProps } from "./types";
import { formatAsDateTime } from "@/utils/date";
import useMobileCheck from "@/hooks/useMobileCheck";

const AddHistory = ({ onSubmit, date }: IAddHistoryProps) => {
  const { isMobile } = useMobileCheck();
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
          [id]: Number(inputValue) > 59 ? "59" : inputValue,
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
    setCategorySelect("FOOD");
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

  const handleCalendarClose = () => {
    setCalendarOpen(false);
  };
  const handleCalendarOpen = () => {
    setCalendarOpen(true);
  };

  const handleCategorySelect = (category: string) => {
    setCategorySelect(category);
    setValue({ ...value, category: category });
  };

  const handleSubmit = async () => {
    if (!value.amount)
      return toast("금액을 입력해주세요.", { type: "error", autoClose: 500 });

    const updateDate = formatAsDateTime(
      dayjs(value.date)
        .hour(value.time.hour ? Number(value.time.hour) : dayjs(date).hour())
        .minute(
          value.time.minute ? Number(value.time.minute) : dayjs(date).minute()
        )
    );
    console.log(updateDate);

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
        <Modal isOpen={isOpen} handleClose={handleClose} slideTop={true}>
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
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={value.amount}
                  onChange={handleValueChange}
                />
                <span className={st.amountTitle}>₩</span>
              </div>
            </div>
            <div className={st.contentWrap}>
              <Typography>카테고리</Typography>
              <CategorySelect
                category={categorySelect}
                handleClick={handleCategorySelect}
              />
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
                type="text"
                className={st.inputContainer}
                value={value.memo}
                onChange={handleValueChange}
              />
            </div>
          </div>
          <button className={st.addBtn} onClick={handleSubmit}>
            <Typography color="white">추가하기</Typography>
          </button>
          <Calendar
            isOpen={calendarOpen}
            handleClose={handleCalendarClose}
            value={formatAsDateTime(dayjs(value.date))}
            handleChange={(date) =>
              setValue({
                ...value,
                date: formatAsDateTime(dayjs(date as Date)),
              })
            }
          />
        </Modal>
      ) : (
        <button
          className={`${st.addIcon} ${isMobile && st.isMobile}`}
          onClick={handleOpen}
          aria-label="addBtn"
        >
          <Add />
        </button>
      )}
    </>
  );
};

export default AddHistory;
