"use client";

import React, { useState } from "react";
import st from "./styles.module.scss";
import ExpandIcon from "@/assets/ExpandMore.svg";
import { ISelectProps } from "./types";
import { addFormat } from "@/utils/date";

const DateSelect = ({ select, options, handleOptionSelect }: ISelectProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenClick = () => {
    setOpen(!open);
  };

  const handleClick = (date: string) => {
    handleOpenClick();
    handleOptionSelect(date);
  };

  return (
    <div className={st.container}>
      <button className={st.selectBtn} onClick={handleOpenClick}>
        {addFormat(select, "YYYY년 MM월")} 가계부
        <span className={`${st.openIcon} ${open && st.open}`}>
          <ExpandIcon />
        </span>
      </button>
      {open && (
        <div className={st.optionContainer}>
          {options.map((option, idx) => (
            <div
              key={option}
              className={`${st.option} ${
                select === option && st.currentOption
              } ${idx !== 0 && st.borderTop}`}
              onClick={() => handleClick(option)}
            >
              {addFormat(option, "YYYY년 MM월")} 가계부
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateSelect;
