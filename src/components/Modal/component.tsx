"use client";

import React from "react";
import st from "./style.module.scss";
import { IModalProps } from "./types";

const Modal = ({ isOpen, handleClose, slideTop, children }: IModalProps) => {
  return (
    isOpen && (
      <>
        <div className={st.background} onClick={handleClose}></div>
        <div
          className={`${st.container} ${slideTop ? st.slideTop : st.center}`}
        >
          {children}
        </div>
      </>
    )
  );
};

export default Modal;
