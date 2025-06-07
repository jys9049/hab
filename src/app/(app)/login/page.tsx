"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import kakaoLogin from "@/assets/kakao_login.png";
import logo from "@/assets/LogoIcon.png";
import st from "./styles.module.scss";
import Typography from "@/components/Typography";

const LoginPage = () => {
  const login = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/kakao`,
        scope: "profile_nickname, profile_image, account_email",
      });
    }
  };

  return (
    <>
      <div className={st.container}>
        <div className={st.logoContainer}>
          <div className={st.loginTitleWrap}>
            <Typography variant="headerTitle" color="point">
              슬기로운 지갑생활
            </Typography>
            <Typography variant="title">
              지갑을 지키는 가장 똑똑한 습관!
            </Typography>
          </div>
          <Image
            src={logo}
            width={150}
            height={150}
            alt="logo"
            className={st.logo}
          />
        </div>
        <button onClick={login} className={st.loginBtn}>
          <Image
            src={kakaoLogin}
            width={300}
            height={45}
            alt="kakao login image"
          />
        </button>
      </div>
    </>
  );
};

export default LoginPage;
