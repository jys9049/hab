"use client";
import React, { useEffect, useRef } from "react";
import CategoryIcon from "../CategoryIcon";
import st from "./styles.module.scss";
import { ICategorySelectProps } from "./types";

const categories = ["FOOD", "BUS", "PAY", "SHOPPING", "ETC", "SAVE"];

const CategorySelect = ({
  isOpen,
  handleClick,
  handleClose,
}: ICategorySelectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const notRefArea = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", notRefArea);

      return () => {
        document.removeEventListener("click", notRefArea);
      };
    }
  }, [isOpen, handleClose]);

  return isOpen ? (
    <div ref={containerRef} className={st.categoriesWrap}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(category);
          }}
        >
          <CategoryIcon variant={category} color="black" size="BIG" />
        </button>
      ))}
    </div>
  ) : (
    <></>
  );
};

export default CategorySelect;
