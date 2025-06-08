import type { Metadata } from "next";
import "@/styles/global.scss";
import st from "@/styles/layout.module.scss";
import KakaoLoadProvider from "@/lib/kakao/provider";
import QueryProviders from "@/lib/tanstack/providers";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

export const metadata: Metadata = {
  metadataBase: new URL("https://hab.jeongyongseong.kr"),
  title: "슬기로운 지갑생활",
  description: "오늘도 현명한 소비!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "슬기로운 지갑생활",
    description: "오늘도 현명한 소비!",
    url: "https://hab.jeongyongseong.kr",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "슬기로운 지갑생활",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="Ds_ue00N3cB3mZK1o9tzocqgKLHrJMX-UWDrNAINNTo"
        />
      </Head>
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
