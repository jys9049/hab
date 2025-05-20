"use client";

import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import Image from "next/image";

import React from "react";
import st from "./styles.module.scss";
import Typography from "@/components/Typography";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const loading = useLoadingStore((state) => state.loginLoading);

  const handleLogoutClick = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/login");
  };

  if (loading) return <>loading...</>;
  return (
    <div className={st.container}>
      <div className={st.profileContainer}>
        <Image
          src={user.profile_img}
          width={100}
          height={100}
          alt="profile_img"
          className={st.profileImage}
        />
        <Typography variant="subTitle">
          😀 안녕하세요 {user.nickname}님.
        </Typography>
      </div>
      <div className={st.logoutBtnContainer}>
        <button className={st.logoutBtn} onClick={handleLogoutClick}>
          <Typography>로그아웃</Typography>
        </button>
      </div>
    </div>
  );
};

export default MyPage;
