import React from "react";
import st from "./styles.module.scss";

const Skeleton = ({
  loading,
  width,
  height,
  children,
}: {
  loading: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}) => {
  if (loading) {
    return (
      <div
        style={{ width: width ? `${width}px` : "100%", height: `${height}px` }}
        className={st.skeleton}
      />
    );
  }
  return <>{children}</>;
};

export default Skeleton;
