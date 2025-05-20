"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "@/components/Header";
import Menu from "@/components/Menu";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <>
      <Header />
      {children}
      <Menu />
    </>
  );
};

export default AppLayout;
