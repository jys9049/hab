import React from "react";
import st from "./styles.module.scss";

import Bus from "@/assets/bus.svg";
import Etc from "@/assets/document.svg";
import Saving from "@/assets/saving.svg";
import Pay from "@/assets/money.svg";
import Shopping from "@/assets/shopping.svg";
import Food from "@/assets/food.svg";

import { ICategoryProps } from "./types";
import Typography from "../Typography";

const CategoryIcon = ({
  variant = "FOOD",
  showText = true,
  size = "SMALL",
  color = "default", //
}: ICategoryProps) => {
  let icon;
  let text;
  switch (variant) {
    case "FOOD":
      icon = <Food />;
      text = "식비";
      break;
    case "BUS":
      icon = <Bus />;
      text = "교통";
      break;
    case "ETC":
      icon = <Etc />;
      text = "기타";
      break;
    case "SAVE":
      icon = <Saving />;
      text = "저축";
      break;
    case "PAY":
      icon = <Pay />;
      text = "월급";
      break;
    case "SHOPPING":
      icon = <Shopping />;
      text = "쇼핑";
      break;
    default:
      icon = <Food />;
      text = "식비";
      break;
  }

  return (
    <div className={st.container}>
      <div className={`${st.iconWrap} ${st[variant.toLowerCase()]}`}>
        {icon}
      </div>
      {showText && (
        <Typography
          as="span"
          variant={size === "SMALL" ? "small" : "body"}
          color={color === "default" ? "gray" : "black"}
        >
          {text}
        </Typography>
      )}
    </div>
  );
};

export default CategoryIcon;
