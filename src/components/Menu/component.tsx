"use client";

import React from "react";
import st from "./styles.module.scss";

import Calendar from "@/assets/Calendar.svg";
import Person from "@/assets/Person.svg";
import Chart from "@/assets/Chart.svg";
import Schedule from "@/assets/Schedule.svg";
import { usePathname, useRouter } from "next/navigation";

const Menu = ({ isMobile }: { isMobile: boolean }) => {
  const route = useRouter();
  const pathname = usePathname();

  const menuList = [
    {
      component: <Schedule />,
      src: "/transaction",
    },
    {
      component: <Calendar />,
      src: "/calendar",
    },
    {
      component: <Chart />,
      src: "/summary",
    },
    {
      component: <Person />,
      src: "/mypage",
    },
  ];

  return (
    <div className={`${st.container} ${isMobile && st.isMobile}`}>
      {menuList.map((menu) => (
        <div
          key={menu.src}
          className={`${st.menuBtn} ${
            pathname === menu.src ? st.select : undefined
          }`}
          onClick={() => route.push(menu.src)}
        >
          {menu.component}
        </div>
      ))}
    </div>
  );
};

export default Menu;
