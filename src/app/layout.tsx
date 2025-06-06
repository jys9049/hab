import type { Metadata } from "next";

import "@/styles/global.scss";
import st from "@/styles/layout.module.scss";
import logoImg from "@/assets/mainLogo.png";

import Image from "next/image";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import QueryProviders from "@/lib/tanstack/providers";

import AppLayout from "@/components/AppLayout/component";
import UserInitializer from "@/components/UserInitializer";
import Script from "next/script";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/services/api/server";
import { cookies } from "next/headers";

dayjs.extend(utc);
dayjs.extend(timezone);

export const metadata: Metadata = {
  title: "슬기로운 지갑생활",
  description: "오늘도 현명한 소비!",
  icons: {
    icon: "/resource/images/logo/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  dayjs().locale("kr").format();
  const queryClient = new QueryClient();

  const accessToken = (await cookies()).get("accessToken");
  if (accessToken) {
    await queryClient.prefetchQuery({
      queryKey: ["getUser"],
      queryFn: async () => await getUser(),
    });
  }

  return (
    <html lang="en">
      <body className={st.background}>
        <QueryProviders>
          <div className={st.container}>
            <div className={st.logoImg}>
              <Image
                src={logoImg}
                alt="mainImg"
                width={200}
                height={200}
                priority={true}
              />
            </div>
            <AppLayout>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <UserInitializer />
              </HydrationBoundary>
              <div className={st.content}>{children}</div>
            </AppLayout>
          </div>
          <ToastContainer />
        </QueryProviders>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity={process.env.NEXT_PUBLIC_KAKAO_INTERGRITY}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
