import React from "react";
import { ITypographyProps } from "./types";
import st from "./style.module.scss";

const Typography = ({
  as = "p",
  variant = "body",
  color = "black",
  bold,
  children,
}: ITypographyProps) => {
  const Component = as;
  return (
    <Component className={`${st[variant]} ${st[color]} ${bold && st.bold}`}>
      {children}
    </Component>
  );
};

export default Typography;
