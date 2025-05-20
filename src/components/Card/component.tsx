import React, { PropsWithChildren } from "react";
import st from "./styles.module.scss";

const Card = ({ children }: PropsWithChildren) => {
  return <div className={st.container}>{children}</div>;
};

export default Card;
