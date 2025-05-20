import { redirect } from "next/navigation";

const KakaoRedirect = async ({
  searchParams,
}: {
  searchParams: Promise<{
    accessToken: string | undefined;
    refreshToken: string | undefined;
  }>;
}) => {
  const accessToken = (await searchParams).accessToken;
  const refreshToken = (await searchParams).refreshToken;

  if (accessToken && refreshToken) {
    redirect("/");
  }

  return <></>;
};

export default KakaoRedirect;
