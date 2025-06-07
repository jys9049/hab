"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import st from "./styles.module.scss";
import useMobileCheck from "@/hooks/useMobileCheck";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isMobile } = useMobileCheck();
  return pathname === "/login" ? (
    <div className={st.layoutCard}>{children}</div>
  ) : (
    <div className={`${st.layoutCard}`}>
      <Header isMobile={isMobile} />
      {children}
      <Menu isMobile={isMobile} />
    </div>
  );
};

export default AppLayout;
