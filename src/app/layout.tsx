import type { Metadata } from "next";
import "@/styles/global.scss";
import st from "@/styles/layout.module.scss";
import logoImage from "@/assets/mainLogo.png";
import KakaoLoadProvider from "@/lib/kakao/provider";
import QueryProviders from "@/lib/tanstack/providers";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "슬기로운 지갑생활",
  description: "오늘도 현명한 소비!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "슬기로운 지갑생활",
    description: "오늘도 현명한 소비!",
    url: "https://hab.jeongyongseong.kr",
    images: logoImage.src,
  },
  themeColor: "#f9f9",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={st.background}>
        <KakaoLoadProvider>
          <QueryProviders>
            {children}
            <ToastContainer />
          </QueryProviders>
        </KakaoLoadProvider>
      </body>
    </html>
  );
}
