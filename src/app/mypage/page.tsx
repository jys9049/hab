"use client";

import useLoadingStore from "@/lib/zustand/store/useLoadingStore";
import { useUserStore } from "@/lib/zustand/store/useUserStore";
import Image from "next/image";

import React, { useState } from "react";
import st from "./styles.module.scss";
import Typography from "@/components/Typography";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import WithdrawalModal from "@/components/WithdrawalModal";
import ResetModal from "@/components/ResetModal";

const MyPage = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const loading = useLoadingStore((state) => state.loginLoading);

  const handleLogoutClick = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/login");
  };

  const handleWithoutModalOpen = () => {
    setWithdrawalModalOpen(true);
  };

  const handleWithoutModalClose = () => {
    setWithdrawalModalOpen(false);
  };

  const handleResetModalOpen = () => {
    setResetModalOpen(true);
  };

  const handleResetModalClose = () => {
    setResetModalOpen(false);
  };

  if (loading) return <>loading...</>;
  return (
    <>
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
        <div className={st.menuContainer}>
          <button className={st.menuBtn} onClick={handleResetModalOpen}>
            <Typography variant="body">가계부 초기화</Typography>
          </button>
        </div>
        <div className={st.logoutBtnContainer}>
          <button className={st.logoutBtn} onClick={handleLogoutClick}>
            <Typography>로그아웃</Typography>
          </button>
          <button className={st.withdrawalBtn} onClick={handleWithoutModalOpen}>
            회원탈퇴
          </button>
        </div>
      </div>
      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        handleClose={handleWithoutModalClose}
      />
      <ResetModal isOpen={resetModalOpen} handleClose={handleResetModalClose} />
    </>
  );
};

export default MyPage;
