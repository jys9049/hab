"use client";
import React, { useEffect, useRef, useState } from "react";
import More from "@/assets/ExpandMore.svg";
import CategoryIcon from "../CategoryIcon";
import st from "./styles.module.scss";
import { ICategorySelectProps } from "./types";

const categories = ["FOOD", "BUS", "PAY", "SHOPPING", "ETC", "SAVE"];

const CategorySelect = ({
  category,
  fullWidth = true,
  handleClick,
}: ICategorySelectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [selectCategory, setSelectCategory] = useState(category);

  const handleCategoryClick = (category: string) => {
    setSelectCategory(category);
  };

  const handleCategoryOpenClick = () => {
    setCategoryOpen(true);
  };

  const handleCategoryCloseClick = () => {
    setCategoryOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    handleClick(category);
    handleCategoryClick(category);
    handleCategoryCloseClick();
  };

  useEffect(() => {
    const notRefArea = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        handleCategoryCloseClick();
      }
    };

    if (categoryOpen) {
      document.addEventListener("click", notRefArea);

      return () => {
        document.removeEventListener("click", notRefArea);
      };
    }
  }, [categoryOpen]);

  return (
    <div className={st.container}>
      <div
        className={`${st.inputContainer} ${st.categorySelect} ${
          categoryOpen && st.categoryOpen
        } ${fullWidth && st.inputFullWidth}`}
        onClick={handleCategoryOpenClick}
      >
        <CategoryIcon variant={selectCategory} color="black" size="BIG" />
        <More />
      </div>
      {categoryOpen && (
        <div ref={containerRef} className={st.categoriesWrap}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectCategory(category);
              }}
            >
              <CategoryIcon variant={category} color="black" size="BIG" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
