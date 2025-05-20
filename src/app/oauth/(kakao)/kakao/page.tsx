import { redirect } from "next/navigation";

const getToken = async (code: string) => {
  const res = await fetch(`${process.env.BASE_URL}/api/auth/kakaoLogin`, {
    method: "POST",
    body: JSON.stringify({ code }),
    credentials: "include",
  });

  if (res.ok) {
    const resData = await res.json();

    return resData.data;
  }
};

const KakaoLogin = async ({
  searchParams,
}: {
  searchParams: Promise<{ code: string | undefined }>;
}) => {
  const code = (await searchParams).code;
  if (!code) return;

  const token = await getToken(code);

  if (token) {
    redirect(`/oauth/kakao/redirect?${token}`);
  }

  return <></>;
};

export default KakaoLogin;
