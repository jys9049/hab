"use client";

import React from "react";
import st from "./styles.module.scss";
import Image from "next/image";
import Link from "next/link";

import miniLogo from "@/assets/LogoIcon.png";
import loginIntro from "@/assets/introduce/loginIntro.png";
import kakaoLogin from "@/assets/introduce/kakaoLogin.png";
import transaction from "@/assets/introduce/transactionIntro.png";
import addtransaction from "@/assets/introduce/addTransaction.png";
import calendar from "@/assets/introduce/calendarIntro.png";
import summary from "@/assets/introduce/summaryIntro.png";
import summary2 from "@/assets/introduce/summary2.png";
import react from "@/assets/introduce/react.png";
import ts from "@/assets/introduce/ts.png";
import supabase from "@/assets/introduce/supabase-logo-icon.png";
import postgreSQL from "@/assets/introduce/PostgreSQL.png";
import docker from "@/assets/introduce/docker-mark-blue.png";
import ec2 from "@/assets/introduce/EC2.png";
import gitaction from "@/assets/introduce/GitHub Actions.png";
import nextjs from "@/assets/introduce/nextjs.png";
import linkedIn from "@/assets/introduce/LI-In-Bug.png";
import sass from "@/assets/introduce/sass.png";
import TanstackQuery from "@/assets/introduce/tanstackQuery.svg";
import Zustand from "@/assets/introduce/zustand.svg";
import State from "@/assets/introduce/state.svg";
import Auth from "@/assets/introduce/auth.svg";
import Deploy from "@/assets/introduce/deploy.svg";

const Main = () => {
  console.log(process.env.NEXT_PUBLIC_TEST_LOGIN_ID);

  return (
    <div className={st.container}>
      {/** 헤더 */}
      <header>
        <div className={st.titleWrap}>
          <Image
            src={miniLogo}
            width={40}
            height={40}
            alt="logo"
            className={st.logo}
          />
          <p className={st.title}>슬기로운 지갑생활</p>
        </div>
      </header>
      {/** 설명란 */}
      <section className={st.sectionContainer}>
        <p className={st.sectionTitle}>흩어져 있던 내 돈, 한눈에 모아보세요.</p>
        <div className={st.sectionDescAndBtn}>
          <p className={st.sectionDesc}>
            매일의 수입과 지출을 쉽고 아름답게 기록하고, 똑똑한 소비 습관을
            만들어보세요.
          </p>
          <div className={st.btnGroup}>
            <Link href={"/login"} className={st.startBtn}>
              Start
            </Link>
            <Link
              href={"https://github.com/jys9049/hab"}
              className={st.githubBtn}
            >
              GitHub
            </Link>
            <Link
              href={`/oauth/kakao?testId=${process.env.NEXT_PUBLIC_TEST_LOGIN_ID}`}
              className={st.demoBtn}
            >
              Demo
            </Link>
          </div>
        </div>
      </section>
      {/** 메인 */}
      <main className={st.mainContainer}>
        {/** 기술 스택 */}
        <section className={st.sectionContainer}>
          <p className={st.mainTitle}>기술 스택</p>
          <div className={st.techStackAndTitleContainer}>
            <div className={st.techStackAndTitleWrap}>
              <p>Frontend</p>
              <div className={st.techStackWrap}>
                <div className={st.techImgAndTitle}>
                  <Image src={nextjs} width={25} height={25} alt="nextjs" />
                  <p>Next.js</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={react} width={25} height={25} alt="react" />
                  <p>React</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={ts} width={25} height={25} alt="ts" />
                  <p>TypeScript</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <TanstackQuery />
                  <p>Tanstack-Query</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Zustand />
                  <p>Zustand</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={sass} width={25} height={25} alt="sass" />
                  <p>Sass</p>
                </div>
              </div>
            </div>
            <div className={st.techStackAndTitleWrap}>
              <p>Backend</p>
              <div className={st.techStackWrap}>
                <div className={st.techImgAndTitle}>
                  <Image src={supabase} width={25} height={25} alt="nextjs" />
                  <p>Supabase</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={postgreSQL} width={25} height={25} alt="react" />
                  <p>PostgreSQL</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={nextjs} width={25} height={25} alt="ts" />
                  <p>Nextjs API Router</p>
                </div>
              </div>
            </div>
            <div className={st.techStackAndTitleWrap}>
              <p>DevOps & Deployment</p>
              <div className={st.techStackWrap}>
                <div className={st.techImgAndTitle}>
                  <Image src={gitaction} width={25} height={25} alt="ts" />
                  <p>Git Action</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={ec2} width={25} height={25} alt="react" />
                  <p>AWS-EC2</p>
                </div>
                <div className={st.techImgAndTitle}>
                  <Image src={docker} width={25} height={25} alt="nextjs" />
                  <p>Docker</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/** 주요 기술 */}
        <section className={st.sectionContainer}>
          <p className={st.mainTitle}>주요 기술</p>
          <div className={st.keyFeaturesCardWrap}>
            <div className={st.keyFeaturesCard}>
              <div className={st.keyFeaturesCardTitle}>
                <Deploy />
                <p>서버 사이드 렌더링</p>
              </div>
              <div className={st.keyFeaturesCardDesc}>
                Next.js App Router로 서버 사이드 렌더링을 구현하고, TanStack
                Query의 prefetching 기능으로 초기 데이터 로딩을 최적화했습니다.
              </div>
            </div>
            <div className={st.keyFeaturesCard}>
              <div className={st.keyFeaturesCardTitle}>
                <State />
                <p>전역 상태 관리</p>
              </div>
              <div className={st.keyFeaturesCardDesc}>
                서버/비동기 상태는 TanStack Query로, 클라이언트 상태는 Zustand를
                사용하여 역할을 분리해 관리합니다.
              </div>
            </div>
            <div className={st.keyFeaturesCard}>
              <div className={st.keyFeaturesCardTitle}>
                <Auth />
                <p>인증 관리</p>
              </div>
              <div className={st.keyFeaturesCardDesc}>
                Next.js 미들웨어를 활용하여 사용자의 인증 상태를 확인하고 라우트
                접근을 제어 하는 로직을 구현했습니다.
              </div>
            </div>
          </div>
        </section>
        {/** 주요 기능 */}
        <section className={st.sectionContainer}>
          <p className={st.mainTitle}>주요 기능</p>
          <div className={st.keyFunctionContentsWrap}>
            <div className={st.keyFunctionContentsIntroWrap}>
              <div className={st.positionRight}>
                <div className={st.keyFunctionTextContainer}>
                  <p>간편한 로그인</p>
                  <p>카카오 간편 로그인 API를 활용한 쉬운 회원가입/로그인</p>
                </div>
              </div>
              <div className={st.positionLeft}>
                <div className={st.keyFunctionImagesWrap}>
                  <Image
                    src={loginIntro}
                    width={160}
                    height={349}
                    alt={"loginIntro"}
                    quality={100}
                    className={st.imgWrap}
                  />
                  <Image
                    src={kakaoLogin}
                    width={160}
                    height={349}
                    alt={"loginIntro"}
                    quality={100}
                    className={st.imgWrap}
                  />
                </div>
              </div>
            </div>
            <div className={st.keyFunctionContentsIntroWrap}>
              <div className={st.keyFunctionTextContainer}>
                <p>수입/지출 기록</p>
                <p>날짜, 카테고리, 금액, 메모 등을 포함한 상세 내역</p>
              </div>
              <div className={st.keyFunctionImagesWrap}>
                <Image
                  src={transaction}
                  width={160}
                  height={349}
                  alt={"transaction"}
                  quality={100}
                  className={st.imgWrap}
                />
                <Image
                  src={addtransaction}
                  width={160}
                  height={349}
                  alt={"addtransaction"}
                  quality={100}
                  className={st.imgWrap}
                />
              </div>
            </div>
            <div className={st.keyFunctionContentsIntroWrap}>
              <div className={st.positionRight}>
                <div className={st.keyFunctionTextContainer}>
                  <p>월별 수입/지출 내역 조회</p>
                  <p>캘린더 UI를 통해 일별/월별 수입/지출 내역 제공</p>
                </div>
              </div>
              <div className={st.positionLeft}>
                <div className={st.keyFunctionImagesWrap}>
                  <Image
                    src={calendar}
                    width={160}
                    height={349}
                    alt={"calendar"}
                    quality={100}
                    className={st.imgWrap}
                  />
                </div>
              </div>
            </div>
            <div className={st.keyFunctionContentsIntroWrap}>
              <div className={st.keyFunctionTextContainer}>
                <p>월별 통계 및 차트 시각화</p>
                <p>월별/카테고리별 소비 패턴을 분석하는 동적 차트 제공</p>
              </div>
              <div className={st.keyFunctionImagesWrap}>
                <Image
                  src={summary}
                  width={160}
                  height={349}
                  alt={"summary"}
                  quality={100}
                  className={st.imgWrap}
                />
                <Image
                  src={summary2}
                  width={160}
                  height={349}
                  alt={"summary2"}
                  quality={100}
                  className={st.imgWrap}
                />
              </div>
            </div>
          </div>
        </section>
        {/** 참고 이미지 */}
        <section className={st.imageSection}>
          <div className={st.imageWrap}>
            <Image
              src={transaction}
              width={140}
              height={306}
              alt={"transactionIntro"}
              quality={100}
              className={st.imgWrap}
            />
            <Image
              src={calendar}
              width={161}
              height={350}
              alt={"transactionIntro"}
              quality={100}
              className={st.imgWrap}
            />
            <Image
              src={summary}
              width={161}
              height={350}
              alt={"transactionIntro"}
              quality={100}
              className={st.imgWrap}
            />
          </div>
        </section>
      </main>
      <footer className={st.footerContainer}>
        <p className={st.mainTitle}>Contact Me!</p>
        <div className={st.contactWrap}>
          <p>E-Mail : jys9049@gmail.com</p>
          <div className={st.linkedInWrap}>
            <p>LinkedIn</p>
            <Link
              href={
                "https://www.linkedin.com/in/%EC%9A%A9%EC%84%B1-%EC%A0%95-454256325/"
              }
            >
              <Image
                src={linkedIn}
                width={25}
                height={25}
                alt={"linkedIn"}
                quality={100}
              />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;
