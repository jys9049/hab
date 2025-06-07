"use client";

import React from "react";
import st from "./styles.module.scss";

const Header = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <header className={`${st.header} ${isMobile && st.isMobile}`}>
      <h5 className={st.hText}>슬기로운 지갑생활</h5>
    </header>
  );
};

export default Header;
