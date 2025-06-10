"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import st from "./styles.module.scss";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return pathname === "/login" ? (
    <div className={st.layoutCard}>{children}</div>
  ) : (
    <div className={`${st.layoutCard}`}>
      <Header />
      {children}
      <Menu />
    </div>
  );
};

export default AppLayout;
