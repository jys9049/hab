"use client";

import Script from "next/script";
import React, { PropsWithChildren, useEffect } from "react";

const KakaoLoadProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }, []);

  return (
    <>
      {children}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
        integrity={process.env.NEXT_PUBLIC_KAKAO_INTERGRITY}
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
    </>
  );
};

export default KakaoLoadProvider;
