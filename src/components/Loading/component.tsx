import React from "react";
import st from "./styles.module.scss";
const component = ({ loading }: { loading: boolean }) => {
  return loading ? (
    <div className={st.container}>
      <div className={st.loader}></div>
    </div>
  ) : (
    <></>
  );
};

export default component;
