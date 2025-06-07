import "@/styles/global.scss";
import st from "@/styles/layout.module.scss";
import logoImg from "@/assets/mainLogo.png";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import AppLayout from "@/components/AppLayout/component";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  dayjs().locale("kr").format();

  return (
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
        <div className={st.content}>{children}</div>
      </AppLayout>
    </div>
  );
}
